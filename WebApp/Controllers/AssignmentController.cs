using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using WebApp.Models.Entities;
using WebApp.Models.VM;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApp.Controllers
{
    public class AssignmentController : Controller
    {
        TFContext _context;
        UserManager<IdentityUser> _userManager;
        public AssignmentController(UserManager<IdentityUser> userManager, TFContext context)
        {
            _userManager = userManager;
            _context = context;

        }
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<TeamVM[]> GetAllTeams()
        {
            return await _context.GetAllTeams(_userManager.GetUserId(User));
        }

        //Needed?
        //[HttpGet]
        //public async Task<StudentGroupVM> GetStudentGroupById(int id)
        //{
        //    return await _context.GetStudentGroup(_userManager.GetUserId(User), id);
        //}

        [HttpGet]
        public async Task<StudentGroupVM[]> GetAllStudentGroups()
        {
            return await _context.GetAllStudentGroups(_userManager.GetUserId(User));
        }

        [HttpGet]
        public async Task<ClassVM[]> GetAllClasses()
        {
            return await _context.GetAllClasses();
        }

        [HttpPost]
        public async Task<int> AssignStudentGroups(ClassesToStudentGroupVM viewModel)
        {
            string userId = _userManager.GetUserId(User);
            return await _context.AssignClassesToStudentGroupAsync(viewModel, userId);
            
        }

        [HttpGet]
        public async Task<IncludedClassVM[]> GetStudentGroupClassesById(int id)
        {
            string userId = _userManager.GetUserId(User);
            return await _context.GetIncludedClassesByStudentGroupId(id, userId);
        }
    }
}
