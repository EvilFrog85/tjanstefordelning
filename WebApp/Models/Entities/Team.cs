using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class Team
    {
        public Team()
        {
            IncludedClass = new HashSet<IncludedClass>();
            Personnel = new HashSet<Personnel>();
            StudentGroup = new HashSet<StudentGroup>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }

        public virtual ICollection<IncludedClass> IncludedClass { get; set; }
        public virtual ICollection<Personnel> Personnel { get; set; }
        public virtual ICollection<StudentGroup> StudentGroup { get; set; }
        public virtual User User { get; set; }
    }
}
