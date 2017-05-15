using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class StudentGroupToClassVM
    {
        public int Duration { get; set; }
        public int TeamId { get; set; }
        public int[] StudentGroupIds { get; set; }
    }
}
