using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using WebApp.Models.Entities;

namespace WebApp.Models.VM
{
    public class PersonnelCreateVM
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
        //Searchable Drop down with autocompletion
        public int TeamId { get; set; }
        //Percentage, from which we calculate available points
        public decimal AvailablePoints { get; set; }
        //Name of the contract, e.g. Full time, part time...
        public int Contract { get; set; }
        public CompetenceCreateVM[] Competences { get; set; }
    }
}
