using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class AuxiliaryAssignmentCreateVM
    {
        // Name of assignment
        public string Name { get; set; }
        // Description to be saved as Text in SQL
        public string Description { get; set; }
        // Range should be 1-1000 points
        public int Points { get; set; }
        // Selectable drop down - HT, VT or Läsår
        public int Duration { get; set; }
        // "Checkbox", true if the assignment has to be appointed
        public bool Mandatory { get; set; }

        // To add functionality to this part we need to connect Axuxiliary_assignments to Team!! Ex. Övrig personal connect to "Övriga uppdrag"
        // Non-mandatory, if you want to assign staff straight away
        public string PersonnelSignature { get; set; }
        // True if Personnel_Id selected
        public bool Assigned { get; set; }

        // Predefined - Logged in user
        //public int User_Id { get; set; }
    }
}
