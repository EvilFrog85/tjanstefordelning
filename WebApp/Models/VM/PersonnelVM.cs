using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class PersonnelVM
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Signature { get; set; }
        public string ImageUrl { get; set; }
        public int TeamId { get; set; }
        public decimal AvailablePoints { get; set; }
        public decimal AssignedPoints { get; set; }
        public int Contract { get; set; }
        public CompetenceVM[] Competences { get; set; }
        public IncludedClassVM[] IncludedClasses { get; set; }
    }
}
