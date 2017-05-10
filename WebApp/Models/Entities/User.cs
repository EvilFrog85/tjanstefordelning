using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class User
    {
        public User()
        {
            AuxiliaryAssignment = new HashSet<AuxiliaryAssignment>();
            IncludedClass = new HashSet<IncludedClass>();
            Personnel = new HashSet<Personnel>();
            StudentGroup = new HashSet<StudentGroup>();
            Team = new HashSet<Team>();
        }

        public int Id { get; set; }
        public string SchoolName { get; set; }
        public string SchoolId { get; set; }

        public virtual ICollection<AuxiliaryAssignment> AuxiliaryAssignment { get; set; }
        public virtual ICollection<IncludedClass> IncludedClass { get; set; }
        public virtual ICollection<Personnel> Personnel { get; set; }
        public virtual ICollection<StudentGroup> StudentGroup { get; set; }
        public virtual ICollection<Team> Team { get; set; }
    }
}
