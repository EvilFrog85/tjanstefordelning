﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class IncludedClassVM
    {
        public int Id { get; set; }
        public bool Assigned { get; set; }
        public int Duration { get; set; }
        public int? TeamId { get; set; }
        public int ClassId { get; set; }
        public int? PersonnelId { get; set; }
        public int? StudentGroupId { get; set; }
        public string ClassName { get; set; }
        public string StudentGroupName { get; set; }
        public string TeamName { get; set; }
        public int Points { get; set; }
        public string PersonnelSignature { get; set; }
    }
}
