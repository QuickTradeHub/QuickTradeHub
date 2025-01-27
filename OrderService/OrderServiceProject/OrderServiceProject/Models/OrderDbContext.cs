using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace OrderServiceProject.Models
{
    public class OrderDbContext : DbContext
    {
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Payment> Payments { get; set; }

        private readonly IConfiguration _configuration;

        // Constructor for injecting the IConfiguration into the DbContext
        public OrderDbContext(DbContextOptions<OrderDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        // Use OnConfiguring to configure the database connection
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");
                optionsBuilder.UseSqlServer(connectionString);
            }
        }
    }
}
