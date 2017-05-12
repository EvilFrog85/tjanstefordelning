using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class IncludedClass
    {
        public int Id { get; set; }
        public bool Assigned { get; set; }
        public int Duration { get; set; }
        public int UserId { get; set; }
        public int TeamId { get; set; }
        public int ClassId { get; set; }
        public int? PersonnelId { get; set; }
        public int StudentGroupId { get; set; }

        public virtual Class Class { get; set; }
        public virtual Personnel Personnel { get; set; }
        public virtual StudentGroup StudentGroup { get; set; }
        public virtual Team Team { get; set; }
        public virtual User User { get; set; }
    }
}
