// Models/Order.cs
using System.ComponentModel.DataAnnotations;

namespace OrderServiceProject.Models
{
    public class Order
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public string OrderNumber { get; set; } = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 12).ToUpper();

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }

        [Required]
        public Address ShippingAddress { get; set; }

        [Required]
        public Address BillingAddress { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new();

        [Range(0.01, double.MaxValue)]
        public decimal TotalAmount { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Created;
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        public DateTime? EstimatedDeliveryDate { get; set; }
        public string TrackingNumber { get; set; }
    }

    public enum OrderStatus
    {
        Created,
        Processing,
        Shipped,
        Delivered,
        Cancelled,
        Returned
    }

    public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed,
        Refunded
    }
}