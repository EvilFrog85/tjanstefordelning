using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class Competence
    {
        public int Id { get; set; }
        public bool Qualified { get; set; }
        public int PersonnelId { get; set; }
        public int SubjectId { get; set; }

        public virtual Personnel Personnel { get; set; }
        public virtual Subject Subject { get; set; }
    }
}
