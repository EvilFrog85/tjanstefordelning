using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class AuxiliaryAssignmentVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Points { get; set; }
        public bool Assigned { get; set; }
    }
}
