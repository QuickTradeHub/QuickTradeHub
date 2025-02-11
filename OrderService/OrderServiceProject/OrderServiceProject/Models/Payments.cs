// Models/Payment.cs
using System.ComponentModel.DataAnnotations;

namespace OrderServiceProject.Models
{
    public class Payments
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string PaymentMethod { get; set; }
        public PaymentStatus Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? PaymentDate { get; set; }
    }
}