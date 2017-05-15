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
using Microsoft.Extensions.Logging;
using System.Diagnostics;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApp.Controllers
{
    [Authorize]
    public class WizardController : Controller
    {
        TFContext _context;
        UserManager<IdentityUser> _userManager;
        private readonly ILogger _logger;
        public WizardController(UserManager<IdentityUser> userManager, TFContext context, ILogger<WizardController> logger)
        {
            _userManager = userManager;
            _context = context;
            _logger = logger;
            
        }
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult IndexPlayground()
        {
            return View();
        }

        [HttpPost]
        public async Task<int> NewTeam(TeamCreateVM viewModel)
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
        [HttpGet]
        public async Task<PersonnelWizardListVM[]> GetAllPersonnelToWizardList()
        {
            var userId = _userManager.GetUserId(User);
            var returnValue = await _context.GetAllPersonnelToWizardList(userId);
            return returnValue;
        }

        [HttpPost]
        public async Task<int> AddNewPersonnel(PersonnelCreateVM viewModel)
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
        public StudentGroupVM GetStudentGroupById(int id)
        {
            return _context.GetStudentGroupById(id);
        }

        [HttpPost]
        public async Task<bool> UpdatePersonnel(PersonnelCreateVM viewModel, int id)
        {
            return await _context.UpdatePersonnel(viewModel, id);
        }
        [HttpGet]
        public PersonnelCreateVM GetPersonnelById(int id)
        {
            var aPerson = _context.GetPersonnelById(id);
            return aPerson;
        }

        [HttpGet]
        public int[] GetAllCounts()
        {
            var userId = _userManager.GetUserId(User);
            return _context.GetAllCounts(userId);
        }

        [HttpPost]
        public async Task<int> NewStudentGroup(StudentGroupCreateVM viewModel)
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

        //TODO : move to different controller?
        [HttpGet]
        public async Task<IncludedClassCreateVM[]> GetAllIncludedClasses()
        {
            return await _context.GetAllIncludedClasses(_userManager.GetUserId(User));
            
        }
        //TODO : Move to different controller?
        public async Task<bool> NewIncludedClass(IncludedClassCreateVM viewModel)
        {
            string userId = _userManager.GetUserId(User);
            return await _context.AddNewIncludedClass(viewModel, userId);
        }

        public async Task<bool> NewCompetence(CompetenceCreateVM viewModel)
        {
            //Save competence as array
            var userId = _userManager.GetUserId(User);
            return await _context.NewCompetence(viewModel, userId);
        }

        public async Task<bool> NewAuxiliaryAssignment(AuxiliaryAssignmentCreateVM viewModel)
        {
            var userId = _userManager.GetUserId(User);
            return await _context.AddNewAuxiliaryAssignment(viewModel, userId);
        }
        
        public async Task<bool> DeleteAuxiliaryAssignment(int id)
        {
            return await _context.DeleteAuxiliaryAssignment(id);
        }
        public async Task<bool> UpdateAuxiliaryAssignment(AuxiliaryAssignmentCreateVM viewModel, int id)
        {
            return await _context.UpdateAuxiliaryAssignment(viewModel, id);
        }

    }
}
