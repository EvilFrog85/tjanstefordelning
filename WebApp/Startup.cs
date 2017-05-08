using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
//using WebApp.Models.Entities;

namespace WebApp
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            string connStr = @"Data Source=lagombra.database.windows.net;Initial Catalog=Gyllensvard;Persist Security Info=True;User ID=lagombra;Password=BananKakaCitron123";
            services.AddDbContext<IdentityDbContext>(OptionsConfigurationServiceCollectionExtensions => OptionsConfigurationServiceCollectionExtensions.UseSqlServer(connStr));

            services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 3; //TODO password options
                
            })
                .AddEntityFrameworkStores<IdentityDbContext>()
                .AddDefaultTokenProviders();

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddDebug(minLevel: LogLevel.Error);
            app.UseIdentity();
            app.UseStaticFiles();

            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseExceptionHandler("/Error/ServerError");

            app.UseStatusCodePagesWithRedirects("/Error/HttpError/{0}");

            app.UseMvcWithDefaultRoute();
        }
    }
}
