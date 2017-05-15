using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class IncludedClassCreateVM
    {
        //TODO : Validation, Add Enum(?)

        //If the class has an assigned teacher
        public bool Assigned { get; set; }
        //Which semesters will the course be held over
        public int Duration { get; set; }
        //The user (school) the class is connected to
        public int UserId { get; set; }
        //Which Team the course is connected to
        public int? TeamId { get; set; }
        //Connection to class table with more information about the class
        public int ClassId { get; set; }
        //The assigned teacher, null if none is assigned
        public int? PersonnelId { get; set; }
        //Which student group that is taking the class
        public int? StudentGroupId { get; set; }


    }
}
