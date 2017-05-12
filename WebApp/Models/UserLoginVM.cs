using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApp.Models.VM
{
    public class UserLoginVM
    {
        [Display(Name = "Användarnamn")]
        [Required]
        public string UserName { get; set; }
        [DataType(DataType.Password)]
        [Required]
        [Display(Name = "Lösenord")]
        public string Password { get; set; }
    }
}
