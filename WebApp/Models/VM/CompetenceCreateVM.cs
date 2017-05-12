using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class CompetenceCreateVM
    {
        public bool Qualified { get; set; }
        //To select/get all subjects
        public int SubjectId { get; set; }
        public string Name { get; set; }
    }
}
