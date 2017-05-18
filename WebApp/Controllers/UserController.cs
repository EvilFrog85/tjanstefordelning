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
    public class UserController : Controller
    {
        UserManager<IdentityUser> _userManager;
        SignInManager<IdentityUser> _signInManager;
        IdentityDbContext _identityContext;
        TFContext _context;

        public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IdentityDbContext identityContext, TFContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _identityContext = identityContext;
            _context = context;
        }
        // GET: /<controller>/
        
        [HttpGet]
        public async Task<IActionResult> Login()
        {

            await _signInManager.PasswordSignInAsync("boom", "123", false, false);

            return Redirect("/Boom/BoomMethod");

            //return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(UserLoginVM viewModel)
        {
            var result = await _signInManager.PasswordSignInAsync(viewModel.UserName, viewModel.Password, false, false);

            if (!result.Succeeded)
                return View(viewModel);
            else
            {
                return RedirectToAction(nameof(WizardController.Index));
            }
        }
    }
}
