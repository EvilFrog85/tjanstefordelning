using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class ClassToPersonVM
    {
        public int Id { get; set; }
        public string ClassName { get; set; }
        public int Points { get; set; }
        public bool Qualified { get; set; }
        public int SubjectId { get; set; }
    }
}
