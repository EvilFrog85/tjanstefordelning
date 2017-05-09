using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class ProgramCreateVM
    {
        [Display(Name = "Avdelning")]
        public string Name { get; set; }
    }
}
