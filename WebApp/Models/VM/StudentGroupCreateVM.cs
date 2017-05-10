using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class StudentGroupCreateVM
    {
        public string Name { get; set; }

        public int TeamId { get; set; }
        public int UserId { get; set; }
        public int Starting_Year { get; set; }
    }
}
