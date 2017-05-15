using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class StudentGroup
    {
        public StudentGroup()
        {
            IncludedClass = new HashSet<IncludedClass>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int StartingYear { get; set; }
        public int? TeamId { get; set; }
        public int UserId { get; set; }

        public virtual ICollection<IncludedClass> IncludedClass { get; set; }
        public virtual Team Team { get; set; }
        public virtual User User { get; set; }
    }
}
