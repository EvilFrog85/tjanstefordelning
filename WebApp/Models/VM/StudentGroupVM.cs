using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class StudentGroupVM
    {
        public int Id { get; set; }
        [Display(Name = "Klassnamn")]
        public string Name { get; set; }
        [Display(Name = "Arbetslag")]
        public int TeamId { get; set; }
        [Display(Name = "Startår")]
        public int StartingYear { get; set; }
    }
}
