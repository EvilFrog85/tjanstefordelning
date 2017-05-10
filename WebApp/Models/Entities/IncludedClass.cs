using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class IncludedClass
    {
        public int Id { get; set; }
        public bool Assigned { get; set; }
        public int Duration { get; set; }
        public string SchoolId { get; set; }
        public int ProgramId { get; set; }
        public int ClassId { get; set; }
        public int? PersonnelId { get; set; }
        public int StudentGroupId { get; set; }

        public virtual Personnel Personnel { get; set; }
        public virtual Program Program { get; set; }
        public virtual StudentGroup StudentGroup { get; set; }
    }
}
