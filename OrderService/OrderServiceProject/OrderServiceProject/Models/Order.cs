// Models/Order.cs
using System.ComponentModel.DataAnnotations;

namespace OrderServiceProject.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Address ShippingAddress { get; set; }
        public Address BillingAddress { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public decimal TotalAmount { get; set; }
        public OrderStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
    public enum OrderStatus
    {
        Pending,
        Processing,
        Shipped,
        Delivered,
        Cancelled
    }
    public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed
    }
}

   