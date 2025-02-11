using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using OrderServiceProject.Models;
using Steeltoe.Discovery.Client;
using Steeltoe.Discovery;
using OrderServiceProject.Services;

namespace OrderServiceProject
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add DbContext configuration for SQL Server
            services.AddDbContext<OrderDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // Add Eureka Client configuration from appsettings.json
            services.AddDiscoveryClient(Configuration);

            // Add Razorpay Service configuration
            services.AddScoped<RazorpayService>();

            // Add Controllers (API endpoints)
            services.AddControllers();

            // Add Swagger for API documentation
            services.AddSwaggerGen();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "OrderService v1"));
            }

            // Enable Eureka Client registration with the Eureka server
            if (app.ApplicationServices.GetService<IDiscoveryClient>() != null)
            {
                app.UseDiscoveryClient();
            }

            // Set up routing and API endpoints
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
