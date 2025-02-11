// Data/OrderDbContext.cs
using Microsoft.EntityFrameworkCore;

namespace OrderServiceProject.Models
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options) { }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Payments> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>()
                .OwnsOne(o => o.ShippingAddress);

            modelBuilder.Entity<Order>()
                .OwnsOne(o => o.BillingAddress);
        }
    }
}