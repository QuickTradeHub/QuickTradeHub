using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Steeltoe.Discovery.Client;
using Steeltoe.Discovery;
using OrderServiceProject.Models;

namespace OrderServiceProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            // Apply database migrations automatically at startup
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<OrderDbContext>();

                // Apply migrations
                // context.Database.Migrate();
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }

    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // Add DbContext configuration for SQL Server
            services.AddDbContext<OrderDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // Add Eureka Client configuration from appsettings.json
            services.AddDiscoveryClient(Configuration);

            // Add Swagger for API documentation
            services.AddSwaggerGen();

            // Allow all CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
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

            app.UseRouting();

            // Use CORS policy
            app.UseCors("AllowAll");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
