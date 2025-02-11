using OrderServiceProject.Models;
namespace OrderServiceProject.DTOs
{
    public class OrderCreateDto
    {
        public int UserId { get; set; }
        public Address ShippingAddress { get; set; }
        public Address BillingAddress { get; set; }
        public List<OrderItemDto> OrderItems { get; set; }
    }
}