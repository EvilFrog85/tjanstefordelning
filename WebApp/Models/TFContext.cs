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
        internal void AddNewPersonnel(PersonnelCreateVM viewModel)
        {
            var newPersonnel = new Personnel
            {
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                Contract = viewModel.Contract,
                ImageUrl = viewModel.ImageUrl,
                ProgramId = viewModel.ProgramId,
                AvailablePoints = viewModel.AvailablePoints
            };
        }

        internal async Task<bool> AddNewProgram(ProgramCreateVM viewModel, string id)
        {

            var programToAdd = new Program
            {
                Name = viewModel.Name,
                SchoolId = id,
            };

            this.Program.Add(programToAdd);

            return await SaveChangesAsync() == 1;
        }

        internal async Task<bool> DeleteProgram(int id)
        {
            var programToRemove = await Program.SingleOrDefaultAsync(c => c.Id == id);
            Program.Remove(programToRemove);
            return await SaveChangesAsync() == 1;
        }

        internal async Task<Program[]> GetAllPrograms(string id)
        {
            return await Program.Where(p => p.SchoolId == id).ToArrayAsync();
        }

        internal async Task<bool> UpdateProgram(int id, ProgramCreateVM updatedProgram)
        {
            var oldProgram = Program.SingleOrDefault(c => c.Id == id);

            oldProgram.Name = updatedProgram.Name;

            return await SaveChangesAsync() == 1;
        }
    }
}