using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class Personnel
    {
        public Personnel()
        {
            AuxiliaryAssignment = new HashSet<AuxiliaryAssignment>();
            Competence = new HashSet<Competence>();
            IncludedClass = new HashSet<IncludedClass>();
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Signature { get; set; }
        public string ImageUrl { get; set; }
        public int? TeamId { get; set; }
        public decimal AvailablePoints { get; set; }
        public decimal AssignedPoints { get; set; }
        public int Contract { get; set; }

        public virtual ICollection<AuxiliaryAssignment> AuxiliaryAssignment { get; set; }
        public virtual ICollection<Competence> Competence { get; set; }
        public virtual ICollection<IncludedClass> IncludedClass { get; set; }
        public virtual Team Team { get; set; }
        public virtual User User { get; set; }
    }
}
