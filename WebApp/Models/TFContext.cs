﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebApp.Models.VM;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Threading;

namespace WebApp.Models.Entities
{
    public partial class TFContext : DbContext
    {
        public TFContext(DbContextOptions<TFContext> options) : base(options)
        {
        }
        internal async Task<bool> AddNewPersonnel(PersonnelCreateVM viewModel, string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var userSignature = CreateSignature(viewModel.FirstName, viewModel.LastName, userId);

            var newPersonnel = new Personnel
            {
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                Signature = userSignature,
                ImageUrl = viewModel.ImageUrl,
                TeamId = viewModel.TeamId,
                AvailablePoints = viewModel.AvailablePoints,
                Contract = viewModel.Contract,
                UserId = userId,
            };

            if (viewModel.Competences != null)
            {
                var competences = viewModel.Competences
                    .Select(c => new Competence
                    {
                        Qualified = c.Qualified,
                        SubjectId = c.SubjectId
                    }).ToArray();

                foreach (var competence in competences)
                {
                    newPersonnel.Competence.Add(competence);
                }
            }

            await Personnel.AddAsync(newPersonnel);

            bool success = false;
            try
            {
                success = await SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Debug.Write(ex.Message);
                return success;
            }
            return success;
        }

        internal string CreateSignature(string firstName, string lastName, int id)
        {
            string signature = firstName.Substring(0, 2) + lastName.Substring(0, 2);

            var simularSignatures = Personnel
                .Where(p => p.UserId == id && p.Signature.Substring(0, 4) == signature).Select(p => p.Signature).ToArray();

            Array.Sort(simularSignatures);

            //Unique signature
            if (simularSignatures.Length == 0)
                return String.Join("", signature + "01");
            else
            {
                int counter = 2;
                var newSignature = String.Join("", signature + "0" + counter);

                foreach (var item in simularSignatures)
                {
                    if (newSignature == item)
                    {
                        counter++;
                        newSignature = String.Join("", signature + "0" + counter);
                    }
                }
                return newSignature;
            }
        }

        internal async Task<bool> DeletePersonnel(int id)
        {
            var personToRemove = await Personnel
                .Include(p => p.Competence)
                .Include(p => p.AuxiliaryAssignment)
                .Include(p => p.IncludedClass)
                .SingleOrDefaultAsync(p => p.Id == id);

            var classesToRemove = personToRemove.IncludedClass;
            var competencesToRemove = personToRemove.Competence;
            var auxToRemove = personToRemove.AuxiliaryAssignment;

            foreach (var classe in classesToRemove)
            {
                classe.Assigned = false;
                classe.PersonnelId = null;
            }
            foreach (var aux in auxToRemove)
            {
                aux.Assigned = false;
                aux.PersonnelId = null;
            }

            Competence.RemoveRange(competencesToRemove);
            Personnel.Remove(personToRemove);

            bool success = false;
            try
            {
                success = await SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Debug.Write(ex.Message);
            }
            return success;
        }

        internal async Task<bool> UpdatePersonnel(PersonnelCreateVM viewModel, int id)
        {
            var personToUpdate = await Personnel
                .Where(p => p.Id == id)
                .Include(c => c.Competence)
                .Include(c => c.Team)
                .Include(c => c.User)
                .SingleOrDefaultAsync();

            personToUpdate.FirstName = viewModel.FirstName;
            personToUpdate.LastName = viewModel.LastName;
            // TODO - Activate once again when img-upload is functional
            //personToUpdate.ImageUrl = viewModel.ImageUrl;
            personToUpdate.TeamId = viewModel.TeamId;
            if (personToUpdate.Competence.Count() > 0)
            {
                Competence.RemoveRange(personToUpdate.Competence);
            }
            if (viewModel.Competences != null)
            {
                var competences = viewModel.Competences.Select(c => new Competence { SubjectId = c.SubjectId, Qualified = c.Qualified }).ToArray();
                foreach (var item in competences)
                {
                    personToUpdate.Competence.Add(item);
                }
            }
            personToUpdate.AvailablePoints = viewModel.AvailablePoints;
            personToUpdate.Contract = viewModel.Contract;

            bool success = false;

            try
            {
                success = await SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Debug.Write(ex.Message);
            }
            return success;
        }

        internal async Task<PersonnelWizardListVM[]> GetAllPersonnelToWizardList(string id)
        {

            //Vi borde nog cachea svaret på anropet?
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var returnValue = await Personnel.Where(p => p.UserId == userId).Select(p => new PersonnelWizardListVM
            {
                FirstName = p.FirstName,
                LastName = p.LastName,
                Id = p.Id,
                Signature = p.Signature,
                TeamName = p.Team.Name// Team.SingleOrDefault(t => t.Id == p.TeamId).Name
            }).OrderBy(p => p.TeamName).ToArrayAsync();

            return returnValue;
        }
        //Metod som inte hör till Wizarden Nedanför!
        internal async Task<PersonnelVM[]> GetAllPersonnel(string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            return await Personnel
                .Where(p => p.UserId == userId)
                .Include(p => p.Competence)
                .Include(p => p.IncludedClass)
                .Select(p => new PersonnelVM
                {
                    AssignedPoints = p.AssignedPoints,
                    AvailablePoints = p.AvailablePoints * 6,//Hårdkodat värde i nuläget, här är 600 poäng ett helt läsårs lektioner
                    Competences = p.Competence.Select(c => new CompetenceVM { SubjectId = c.SubjectId, Qualified = c.Qualified }).ToArray(),
                    Contract = p.Contract,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Signature = p.Signature,
                    TeamName = p.Team.Name,
                    Id = p.Id,
                    ImageUrl = p.ImageUrl,
                    IncludedClasses = p.IncludedClass.Select(i => new IncludedClassVM { ClassName = i.Class.ClassName, Duration = i.Duration }).ToArray()
                }).ToArrayAsync();
        }
        internal PersonnelCreateVM GetPersonnelById(int id)
        {
            var person = Personnel
                .Where(p => p.Id == id)
                .Select(p => new PersonnelCreateVM
                {
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    AvailablePoints = p.AvailablePoints,
                    ImageUrl = p.ImageUrl,
                    Contract = p.Contract,
                    TeamId = p.TeamId,
                    Competences = p.Competence.Select(o => new CompetenceCreateVM
                    {
                        Qualified = o.Qualified,
                        Name = o.Subject.Name,
                        SubjectId = o.SubjectId
                    }).ToArray()
                })
                .SingleOrDefault();

            return person;
        }

        internal int[] GetAllCounts(string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;

            int personnelCount = Personnel.Where(p => p.UserId == userId).Count();
            int teamCount = Team.Where(p => p.UserId == userId).Count();
            int classesCount = IncludedClass.Where(p => p.UserId == userId).Count();
            int unAssignedClassesCount = IncludedClass.Where(p => p.UserId == userId && p.Assigned == false).Count();
            int personnelWithAvailabilityCount = Personnel.Where(p => p.UserId == userId && p.AssignedPoints < p.AvailablePoints).Count();

            return new int[] {
                teamCount,
                personnelCount,
                personnelWithAvailabilityCount,
                classesCount,
                unAssignedClassesCount };

        }

        internal async Task<int> AddNewTeam(TeamCreateVM viewModel, string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;

            var teamToAdd = new Team
            {
                Name = viewModel.Name,
                UserId = userId,
            };

            this.Team.Add(teamToAdd);
            await SaveChangesAsync();
            return teamToAdd.Id;
        }

        internal async Task<bool> DeleteTeam(int id)
        {
            var teamToRemove = await Team
                .Include(t => t.StudentGroup)
                .Include(t => t.IncludedClass)
                .Include(t => t.Personnel)
                .SingleOrDefaultAsync(c => c.Id == id);

            var studentGroups = teamToRemove.StudentGroup;
            var includedClasses = teamToRemove.IncludedClass;
            var personnel = teamToRemove.Personnel;

            foreach (var studentGroup in studentGroups)
            {
                studentGroup.TeamId = null;
            }
            foreach (var classe in includedClasses)
            {
                classe.TeamId = null;
            }
            foreach (var person in personnel)
            {
                person.TeamId = null;
            }

            Team.Remove(teamToRemove);
            return await SaveChangesAsync() > 0;
        }

        internal async Task<TeamVM[]> GetAllTeams(string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var teamArray = await Team.Where(p => p.UserId == userId)
                .Select(p => new TeamVM
                {
                    Name = p.Name,
                    Id = p.Id
                })
                .ToArrayAsync();
            return teamArray;
        }

        internal TeamVM GetTeamById(int id)
        {
            var team = Team
                .Where(t => t.Id == id)
                .Select(t => new TeamVM
                {
                    Id = t.Id,
                    Name = t.Name
                }).SingleOrDefault();

            return team;
        }

        internal async Task<bool> UpdateTeam(int id, TeamCreateVM updatedTeam)
        {
            var oldTeam = Team.SingleOrDefault(c => c.Id == id);

            oldTeam.Name = updatedTeam.Name;

            return await SaveChangesAsync() > 0;
        }

        internal async Task<SubjectVM[]> GetAllSubjects()
        {
            return await Subject.Select(s =>
            new SubjectVM
            {
                Name = s.Name,
                SubjectCode = s.SubjectCode,
                Id = s.Id
            }).ToArrayAsync();
        }

        internal async Task<int> AddNewStudentGroup(StudentGroupCreateVM viewModel, string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var studentGroupToAdd = new StudentGroup
            {
                Name = viewModel.Name,
                UserId = userId,
                StartingYear = viewModel.Starting_Year,
                TeamId = viewModel.TeamId,
            };
            this.StudentGroup.Add(studentGroupToAdd);
            await SaveChangesAsync();
            return studentGroupToAdd.Id;
        }

        internal async Task<bool> DeleteStudentGroup(int id)
        {
            var studentGroupToRemove = await StudentGroup
                .Include(s => s.IncludedClass)
                .SingleOrDefaultAsync(s => s.Id == id);

            var includedClasses = studentGroupToRemove.IncludedClass;

            foreach (var item in includedClasses)
            {
                item.StudentGroupId = null;
            }

            StudentGroup.Remove(studentGroupToRemove);
            return await SaveChangesAsync() > 0;
        }

        internal async Task<bool> UpdateStudentGroup(StudentGroupCreateVM viewModel, int studentGroupId)
        {
            var studentGroupToUpdate = StudentGroup.FirstOrDefault(s => s.Id == studentGroupId);
            studentGroupToUpdate.Name = viewModel.Name;
            studentGroupToUpdate.StartingYear = viewModel.Starting_Year;
            studentGroupToUpdate.TeamId = viewModel.TeamId;

            return await SaveChangesAsync() > 0;
        }

        internal async Task<StudentGroupVM[]> GetAllStudentGroups(string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var studentGroups = StudentGroup
                .Include(s => s.Team)
                .Where(s => s.UserId == userId).Select(s => new StudentGroupVM
                {
                    Id = s.Id,
                    Name = s.Name,
                    TeamId = s.TeamId,
                    TeamName = s.Team.Name,
                    StartingYear = s.StartingYear,
                });
            return await studentGroups.ToArrayAsync();
        }
        internal async Task<ClassVM[]> GetAllClasses()
        {
            //int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            return await Class.Select(c => new ClassVM
            {
                Id = c.Id,
                ClassName = c.ClassName,
                ClassCode = c.ClassCode,
                Points = c.Points,
                SubjectId = c.SubjectId,
            }).ToArrayAsync();
        }

        internal StudentGroupVM GetStudentGroupById(int id)
        {
            var studentGroup = StudentGroup
                .Where(s => s.Id == id)
                .Select(s => new StudentGroupVM
                {
                    Id = s.Id,
                    Name = s.Name,
                    TeamId = s.TeamId,
                    StartingYear = s.StartingYear
                }).SingleOrDefault();

            return studentGroup;
        }

        internal async Task<int> AssignClassesToStudentGroupAsync(ClassesToStudentGroupVM viewModel, string id)
        {

            //TODO : Check if class and student group already exists in database
            var filteredClasses = viewModel.ClassData
                .Where(cd => !IncludedClass.Any(ic => cd.ClassId == ic.ClassId && cd.StudentGroupId == ic.StudentGroupId)).ToArray();

            //var notAlreadyExistingClasses = IncludedClass.Join(viewModel.ClassData, ic => new { ic.ClassId, ic.StudentGroupId }, cd => new { cd.ClassId, cd.StudentGroupId }, (ic, cd) => ic);
            //var notAlreadyExistingClasses = viewModel.ClassData.Where(cd => !IncludedClass.Select(ic => ic.ClassId).Contains(cd.ClassId) && !IncludedClass.Select(ic => ic.StudentGroupId).Contains(cd.StudentGroupId));
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var includedClasses = filteredClasses.Select(c => new IncludedClass
            {
                Duration = c.Duration,
                TeamId = c.TeamId,
                ClassId = c.ClassId,
                StudentGroupId = c.StudentGroupId,
                UserId = userId
            });
            foreach (var ic in includedClasses)
            {
                await IncludedClass.AddAsync(ic);
            }
            int numberOfClassesAdded = await SaveChangesAsync();
            return numberOfClassesAdded;
        }

        internal async Task<IncludedClassCreateVM[]> GetAllIncludedClasses(string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            return await IncludedClass.Where(u => u.UserId == userId).Select(c => new IncludedClassCreateVM
            {
                Assigned = c.Assigned,
                Duration = c.Duration,
                UserId = c.UserId,
                TeamId = c.TeamId,
                ClassId = c.ClassId,
                PersonnelId = c.PersonnelId,
                StudentGroupId = c.StudentGroupId,
            }).ToArrayAsync();
        }

        internal IncludedClassVM GetIncludedClassById(int id)
        {
            var includedClass = IncludedClass
                .Where(i => i.Id == id)
                .Select(i => new IncludedClassVM
                {
                    Id = i.Id,
                    ClassId = i.ClassId,
                    Assigned = i.Assigned,
                    Duration = i.Duration,
                    StudentGroupId = i.StudentGroup.Id,
                    TeamId = i.Team.Id,
                    ClassName = i.Class.ClassName
                }).SingleOrDefault();

            return includedClass;
        }

        internal Task<IncludedClassVM[]> GetIncludedClassesByStudentGroupId(int studentGroupId, string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            //var classes = IncludedClass
                //.Where(ic => ic.UserId == userId && ic.StudentGroupId == studentGroupId)
                //.Join(Class, ic => ic, c => c, (ic, c) => new IncludedClassVM
                //{
                //    Id = ic.Id,
                //    Duration = ic.Duration,
                //    TeamId = ic.TeamId,
                //    ClassId = ic.ClassId,
                //    StudentGroupId = ic.StudentGroupId,

                //})ToArray();
            return null;
        }

        internal async Task<bool> AddNewIncludedClass(IncludedClassCreateVM viewModel, string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var includedClassToAdd = new IncludedClass
            {
                Assigned = viewModel.Assigned,
                Duration = viewModel.Duration,
                UserId = userId,
                TeamId = viewModel.TeamId,
                ClassId = viewModel.ClassId,
                PersonnelId = viewModel.PersonnelId,
                StudentGroupId = viewModel.StudentGroupId
            };

            return await SaveChangesAsync() > 0;
        }

        internal async Task<bool> NewCompetence(CompetenceCreateVM viewModel, string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;

            var newCompetence = new Competence
            {
                Qualified = viewModel.Qualified,
                SubjectId = viewModel.SubjectId
            };
            return await SaveChangesAsync() > 0;

        }

        internal async Task<bool> AddNewAuxiliaryAssignment(AuxiliaryAssignmentCreateVM viewModel, string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var AuxiliaryAssignmentToAdd = new AuxiliaryAssignment
            {
                Name = viewModel.Name,
                Description = viewModel.Description,
                Points = viewModel.Points,
                Duration = viewModel.Duration,
                Assigned = viewModel.Assigned,
                Mandatory = viewModel.Mandatory,
                PersonnelId = viewModel.PersonnelId,
                UserId = userId
            };
            this.AuxiliaryAssignment.Add(AuxiliaryAssignmentToAdd);
            return await SaveChangesAsync() > 0;
        }

        internal async Task<bool> DeleteAuxiliaryAssignment(int id)
        {
            var assignmentToRemove = AuxiliaryAssignment
                .SingleOrDefault(a => a.Id == id);
            
            AuxiliaryAssignment.Remove(assignmentToRemove);
            return await SaveChangesAsync() > 0;
        }
        internal async Task<bool> UpdateAuxiliaryAssignment(AuxiliaryAssignmentCreateVM viewModel, int id)
        {
            var assignmentToUpdate = AuxiliaryAssignment.SingleOrDefault(a => a.Id == id);

            assignmentToUpdate.Name = viewModel.Name;
            assignmentToUpdate.Description = viewModel.Description;
            assignmentToUpdate.Points = viewModel.Points;
            assignmentToUpdate.Duration = viewModel.Duration;
            assignmentToUpdate.Assigned = viewModel.Assigned;
            assignmentToUpdate.Mandatory = viewModel.Mandatory;
            assignmentToUpdate.PersonnelId = viewModel.PersonnelId;

            return await SaveChangesAsync() > 0;
        }
        internal async Task<AuxiliaryAssignmentVM[]> GetAllAuxiliaryAssignments(string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var AuxiliaryAssignments = AuxiliaryAssignment
                .Where(s => s.UserId == userId).Select(s => new AuxiliaryAssignmentVM
                {
                    Id = s.Id,
                    Name = s.Name,
                    Points = s.Points,
                    Assigned = s.Assigned,
                });
            return await AuxiliaryAssignments.ToArrayAsync();
        }

        internal AuxiliaryAssignmentCreateVM GetAuxiliaryAssignmentById(int id)
        {
            var auxiliaryAssignment = AuxiliaryAssignment
                .Where(a => a.Id == id)
                .Select(a => new AuxiliaryAssignmentCreateVM
                {
                    Name = a.Name,
                    Points = a.Points,
                    Assigned = a.Assigned,
                    Description = a.Description,
                    Mandatory = a.Mandatory,
                    Duration = a.Duration,
                    PersonnelId = a.PersonnelId
                }).SingleOrDefault();

            return auxiliaryAssignment;
        }
    }
}