// Models/Payment.cs
using System.ComponentModel.DataAnnotations;

namespace OrderServiceProject.Models
{
    public class Payment
    {
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public string Currency { get; set; } = "USD";

        [Required]
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string Notes { get; set; }
    }
}