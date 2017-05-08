using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class Subject
    {
        public Subject()
        {
            Class = new HashSet<Class>();
            Competence = new HashSet<Competence>();
        }

        public int Id { get; set; }
        public string Subject1 { get; set; }
        public string SubjectCode { get; set; }

        public virtual ICollection<Class> Class { get; set; }
        public virtual ICollection<Competence> Competence { get; set; }
    }
}
