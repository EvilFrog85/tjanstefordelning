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
        public async Task<bool> NewTeam(TeamCreateVM viewModel)
        {
            //TODO : Validation
            var userId = _userManager.GetUserId(User);
            return await _context.AddNewTeam(viewModel, userId);
        }
        [HttpGet]
        public async Task<TeamVM[]> GetAllTeams()
        {
            return await _context.GetAllTeams(_userManager.GetUserId(User));
        }
        [HttpPost]
        public async Task<bool> UpdateTeam(int id, TeamCreateVM updatedTeam)
        {
            return await _context.UpdateTeam(id, updatedTeam);
        }
        [HttpPost]
        public async Task<bool> DeleteTeam(int id)
        {
            return await _context.DeleteTeam(id);
        }

        [HttpGet]
        public async Task<SubjectVM[]> GetAllSubjects()
        {
            return await _context.GetAllSubjects();
        }

        [HttpGet]
        public async Task<PersonnelVM[]> GetAllPersonnel()
        {
            var userId = _userManager.GetUserId(User);
            return await _context.GetAllPersonnel(userId);
        }

        [HttpPost]
        public async Task<bool> AddNewPersonnel(PersonnelCreateVM viewModel)
        {
            var userId = _userManager.GetUserId(User);
            return await _context.AddNewPersonnel(viewModel, userId);
        }

        [HttpPost]
        public async Task<bool> DeletePersonnel(int id)
        {
            return await _context.DeletePersonnel(id);
        }

        [HttpPost]
        public async Task<bool> UpdatePersonnel(PersonnelVM viewModel)
        {
            return await _context.UpdatePersonnel(viewModel);
        }

        [HttpGet]
        public int[] GetAllCounts()
        {
            var userId = _userManager.GetUserId(User);
            return _context.GetAllCounts(userId);
        }

        [HttpPost]
        public async Task<bool> NewStudentGroup(StudentGroupCreateVM viewModel)
        {
            string userId = _userManager.GetUserId(User);
            return await _context.AddNewStudentGroup(viewModel, userId);
        }

        [HttpPost]
        public async Task<bool> UpdateStudentGroup(StudentGroupCreateVM viewModel, int id)
        {
            //id is the StudentGroup's id
            return await _context.UpdateStudentGroup(viewModel, id);
        }
        [HttpPost]
        public async Task<bool> DeleteStudentGroup(int id)
        {
            return await _context.DeleteStudentGroup(id);
        }

        [HttpGet]
        public async Task<StudentGroupVM[]> GetAllStudentGroups()
        {
            return await _context.GetAllStudentGroups(_userManager.GetUserId(User));
        }

        public async Task<bool> NewCompetence(CompetenceCreateVM viewModel)
        {
            //Save competence as array
            var userId = _userManager.GetUserId(User);
            return await _context.NewCompetence(viewModel, userId);
        }

    }
}
