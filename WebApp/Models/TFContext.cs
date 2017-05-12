using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebApp.Models.VM;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebApp.Models.Entities
{
    public partial class TFContext : DbContext
    {
        //TODO lots of stuff
        public TFContext(DbContextOptions<TFContext> options) : base(options)
        {
        }
        internal async Task<bool> AddNewPersonnel(PersonnelCreateVM viewModel, string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var userSignature = await CreateSignature(viewModel.FirstName, viewModel.LastName, userId);

            var newPersonnel = new Personnel
            {
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                Signature = userSignature,
                //Signature = String.Join("", viewModel.FirstName[0], viewModel.LastName[0]),
                ImageUrl = viewModel.ImageUrl,
                //TODO : Lägg till signatur samt kontrollera så den är unik, typ en metod sign = CreateSignature(firstname, lastname)
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

            return await SaveChangesAsync() == 1;
        }

        internal async Task<string> CreateSignature(string firstName, string lastName, int id)
        {
            //bool generatingSignature = true;
            string signature = "";

            //await Task.Run(() =>
            //{
            signature = firstName.Substring(0, 2) + lastName.Substring(0, 2);

            int dataBaseSignature = Personnel
                .Where(p => p.UserId == id && p.Signature == signature).Count();
                //.Select(p => p.Signature == signature).Count();
            //.Select(p => p.Signature)

            if (dataBaseSignature == 0)
            {
                //Signaturen fanns i databasen
                return signature;
            }
            else
            {
                return String.Join("", signature, dataBaseSignature + 1);
            }

            //});
            //while (generatingSignature)
            //{

            //    
            //    else
            //    {
            //        //Signaturen fanns inte i databasen
            //    }
            //}
        }

        internal async Task<bool> DeletePersonnel(int id)
        {
            var personToRemove = await Personnel.SingleOrDefaultAsync(p => p.Id == id);
            Personnel.Remove(personToRemove);
            return await SaveChangesAsync() == 1;
        }

        internal async Task<bool> UpdatePersonnel(PersonnelVM viewModel)
        {
            var personToUpdate = await Personnel.SingleOrDefaultAsync(p => p.Id == viewModel.Id);

            personToUpdate.FirstName = viewModel.FirstName;
            personToUpdate.LastName = viewModel.LastName;
            personToUpdate.ImageUrl = viewModel.ImageUrl;
            personToUpdate.TeamId = viewModel.TeamId;
            personToUpdate.Competence = viewModel.Competences.Select(c => new Competence { SubjectId = c.SubjectId, Qualified = c.Qualified }).ToArray();
            personToUpdate.AvailablePoints = viewModel.AvailablePoints;
            personToUpdate.Contract = viewModel.Contract;

            return await SaveChangesAsync() == 1;
        }

        internal async Task<PersonnelVM[]> GetAllPersonnel(string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            return await Personnel.Where(p => p.UserId == userId).Select(p => new PersonnelVM
            {
                AssignedPoints = p.AssignedPoints,
                AvailablePoints = p.AvailablePoints,
                Competences = p.Competence.Select(c => new CompetenceVM { SubjectId = c.SubjectId, Qualified = c.Qualified }).ToArray(),
                Contract = p.Contract,
                FirstName = p.FirstName,
                Id = p.Id,
                ImageUrl = p.ImageUrl,
                IncludedClasses = p.IncludedClass.Select(i => new IncludedClassVM { ClassName = Class.SingleOrDefault(c => c.Id == i.ClassId).ToString(), Duration = i.Duration }).ToArray()
            }).ToArrayAsync();
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

        internal async Task<bool> AddNewTeam(TeamCreateVM viewModel, string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;

            var teamToAdd = new Team
            {
                Name = viewModel.Name,
                UserId = userId,
            };

            this.Team.Add(teamToAdd);

            return await SaveChangesAsync() == 1;
        }

        internal async Task<bool> DeleteTeam(int id)
        {
            var teamToRemove = await Team.SingleOrDefaultAsync(c => c.Id == id);
            Team.Remove(teamToRemove);
            return await SaveChangesAsync() == 1;
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

        internal async Task<bool> UpdateTeam(int id, TeamCreateVM updatedTeam)
        {
            var oldTeam = Team.SingleOrDefault(c => c.Id == id);

            oldTeam.Name = updatedTeam.Name;

            return await SaveChangesAsync() == 1;
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

        internal async Task<bool> AddNewStudentGroup(StudentGroupCreateVM viewModel, string id)
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
            return await SaveChangesAsync() == 1;
        }

        internal async Task<bool> DeleteStudentGroup(int id)
        {
            var studentGroupToRemove = StudentGroup.FirstOrDefault(s => s.Id == id);
            StudentGroup.Remove(studentGroupToRemove);
            return await SaveChangesAsync() == 1;
        }

        internal async Task<bool> UpdateStudentGroup(StudentGroupCreateVM viewModel, int studentGroupId)
        {
            var studentGroupToUpdate = StudentGroup.FirstOrDefault(s => s.Id == studentGroupId);
            studentGroupToUpdate.Name = viewModel.Name;
            studentGroupToUpdate.StartingYear = viewModel.Starting_Year;
            studentGroupToUpdate.TeamId = viewModel.TeamId;

            return await SaveChangesAsync() == 1;
        }

        internal async Task<StudentGroupVM[]> GetAllStudentGroups(string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var studentGroups = StudentGroup.Where(s => s.UserId == userId).Select(s => new StudentGroupVM
            {
                Id = s.Id,
                Name = s.Name,
                TeamId = s.TeamId,
                StartingYear = s.StartingYear,
            });
            return await studentGroups.ToArrayAsync();
        }

        internal async Task<bool> NewCompetence(CompetenceCreateVM viewModel, string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;

            var newCompetence = new Competence
            {
                Qualified = viewModel.Qualified,
                SubjectId = viewModel.SubjectId
            };
            return await SaveChangesAsync() == 1;

        }

        internal async Task<bool> AddNewAuxiliaryAssignment(AuxiliaryAssignmentCreateVM viewModel, string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;

            int? Personnel_id;

            //TODO - Remove comments when Signature is sent/fixed
            //if (viewModel.PersonnelSignature == "")
            //{
            Personnel_id = null;
            viewModel.Assigned = false;
            //}
            /*  
            else
                Personnel_id = Personnel.FirstOrDefault(p => p.Signature == viewModel.PersonnelSignature).Id;
            */


            var AuxiliaryAssignmentToAdd = new AuxiliaryAssignment
            {
                Name = viewModel.Name,
                Description = viewModel.Description,
                Points = viewModel.Points,
                Duration = viewModel.Duration,
                Assigned = viewModel.Assigned,
                Mandatory = viewModel.Mandatory,
                PersonnelId = Personnel_id,
                UserId = userId
            };
            this.AuxiliaryAssignment.Add(AuxiliaryAssignmentToAdd);
            return await SaveChangesAsync() == 1;
        }
    }
}