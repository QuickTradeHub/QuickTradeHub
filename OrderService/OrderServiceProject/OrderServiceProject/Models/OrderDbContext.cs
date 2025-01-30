// Models/OrderDbContext.cs
using Microsoft.EntityFrameworkCore;

namespace OrderServiceProject.Models
{
    public class OrderDbContext : DbContext
    {
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>()
                .OwnsOne(o => o.ShippingAddress);

            modelBuilder.Entity<Order>()
                .OwnsOne(o => o.BillingAddress);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<Payment>()
            //    .HasOne(p => p.Order)
            //    .WithMany()
            //    .HasForeignKey(p => p.OrderId);
        }
    }
}