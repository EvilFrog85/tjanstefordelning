using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebApp.Models.VM;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace WebApp.Models.Entities
{
    public partial class TFContext : DbContext
    {
       //TODO lots of stuff

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

        internal async Task AddNewProgram(ProgramCreateVM viewModel, string id)
        {
            await AddAsync(new Program
            {
                Name = viewModel.Name,
                SchoolId = id,
            });

            await SaveChangesAsync();
        }
    }
}