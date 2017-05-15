using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Models.Entities;

namespace WebApp.Models.VM
{
    public class ClassVM
    {
        public int Id { get; set; }
        [Display(Name = "Kursnamn")]
        public string ClassName { get; set; }
        [Display(Name = "Kurskod")]
        public string ClassCode { get; set; }
        [Display(Name = "Poäng")]
        public int Points { get; set; }
        public int SubjectId { get; set; }
        public int[] StudentGroupId { get; set; }
        //Collection of the student groups that take this class
        public StudentGroupVM[] StudentGroups { get; set; }

    }
}
