using System;
using System.Collections.Generic;

namespace WebApp.Models.Entities
{
    public partial class AuxiliaryAssignment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Points { get; set; }
        public int Duration { get; set; }
        public bool Assigned { get; set; }
        public bool Mandatory { get; set; }
        public int? PersonnelId { get; set; }
        public int UserId { get; set; }

        public virtual Personnel Personnel { get; set; }
        public virtual User User { get; set; }
    }
}
