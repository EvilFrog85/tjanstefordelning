using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models.VM;
using WebApp.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApp.Controllers
{
    [Authorize]
    public class WizardController : Controller
    {
        TFContext _context;
        UserManager<IdentityUser> _userManager;
        public WizardController(UserManager<IdentityUser> userManager, TFContext context)
        {
            _userManager = userManager;
            _context = context;
        }
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<bool> NewProgram(ProgramCreateVM viewModel)
        {
            //TODO : Validation
            var userId = _userManager.GetUserId(User);
            return await _context.AddNewProgram(viewModel, userId);
        }
        [HttpGet]
        public async Task<Models.Entities.Program[]> GetPrograms()
        {
            return await _context.GetAllPrograms(_userManager.GetUserId(User));
        }
    }
}
