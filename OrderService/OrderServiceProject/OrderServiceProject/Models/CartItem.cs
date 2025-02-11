// Models/CartItem.cs
using System.ComponentModel.DataAnnotations;

namespace OrderServiceProject.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        [Required]
        public string ProductId { get; set; }

        [Required]
        public string ProductName { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        public int UserId { get; set; }
        public DateTime AddedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
    }
}