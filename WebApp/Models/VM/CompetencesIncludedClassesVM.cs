using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class CompetencesIncludedClassesVM
    {
        public CompetenceVM[] Competences { get; set; }
        public IncludedClassVM[] IncludedClasses { get; set; }
        public AuxiliaryAssignmentVM[] AuxAssignments { get; set; }
    }
}
