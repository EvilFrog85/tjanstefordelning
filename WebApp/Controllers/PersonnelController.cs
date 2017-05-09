using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApp.Controllers
{
    public class PersonnelController : Controller
    {
        TFContext _context;
        UserManager<IdentityUser> _userManager;
        public PersonnelController(UserManager<IdentityUser> userManager, TFContext context)
        {
            _userManager = userManager;
            _context = context; 
        }
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }
    }
}
