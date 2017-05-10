using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebApp.Models.VM;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Linq;

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
            var newPersonnel = new Personnel
            {
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                ImageUrl = viewModel.ImageUrl,
                TeamId = viewModel.TeamId,
                AvailablePoints = viewModel.AvailablePoints,
                Contract = viewModel.Contract,
            };
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

        internal async Task<Team[]> GetAllTeams(string id)
        {
            var userId = User.FirstOrDefault(u => u.SchoolId == id).Id;
            var teamArray = await Team.Where(p => p.UserId == userId).ToArrayAsync();
            return teamArray;
        }

        internal async Task<bool> UpdateTeam(int id, TeamCreateVM updatedTeam)
        {
            var oldTeam = Team.SingleOrDefault(c => c.Id == id);

            oldTeam.Name = updatedTeam.Name;

            return await SaveChangesAsync() == 1;
        }

        internal async Task<Subject[]> GetAllSubjects()
        {
            return await Subject.ToArrayAsync();
        }
    }
}