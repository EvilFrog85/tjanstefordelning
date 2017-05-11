using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebApp.Models.VM;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

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
            var newPersonnel = new Personnel
            {
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                Signature = String.Join("", viewModel.FirstName[0], viewModel.LastName[0]),
                ImageUrl = viewModel.ImageUrl,
                //TODO : Lägg till signatur samt kontrollera så den är unik, typ en metod sign = CreateSignature(firstname, lastname)
                TeamId = viewModel.TeamId,
                AvailablePoints = viewModel.AvailablePoints,
                Contract = viewModel.Contract,
                UserId = userId,
                
            };
            var competences = viewModel.Competences
                .Select(c => new Competence
                {
                    Qualified = c.Qualified,
                    SubjectId = c.SubjectId
                }).ToArray();

            foreach(var competence in competences)
            {
                newPersonnel.Competence.Add(competence);
            }

            await Personnel.AddAsync(newPersonnel);
            return await SaveChangesAsync() == 1;
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
            studentGroupToUpdate.TeamId = viewModel.TeamId ;

            return await SaveChangesAsync() == 1;
        }

        internal async Task<StudentGroupVM[]> GetAllStudentGroups(string id)
        {
            int userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var studentGroups = StudentGroup.Where(s => s.UserId == userId).Select(s => new StudentGroupVM
            {
                Name = s.Name,
                TeamId = s.TeamId,
                StartingYear = s.StartingYear,
            });
            return await studentGroups.ToArrayAsync();
        }
        internal async Task<StudentGroupVM[]> GetAllStudentGroupsJson(string id)
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