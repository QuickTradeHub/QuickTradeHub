using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OrderServiceProject.Models;


var builder = WebApplication.CreateBuilder(args);

// Load the configuration from appsettings.json
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Register DbContext with SQL Server and configure it to use the connection string from appsettings.json
builder.Services.AddDbContext<OrderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers to the services container
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseRouting();
app.MapControllers();

// Run the application
app.Run();
