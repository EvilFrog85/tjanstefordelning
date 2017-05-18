using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApp.Controllers
{
    public class BoomController : Controller
    {
        TFContext _context;
        private readonly ILogger _logger;
        UserManager<IdentityUser> _userManager;
        public BoomController(UserManager<IdentityUser> userManager, TFContext context, ILogger<WizardController> logger)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }
        // GET: /<controller>/
        public async Task BoomMethod()
        {
            var id = _userManager.GetUserId(User);
            await _context.BoomMethod(600, id);
        }
       
    }
}
