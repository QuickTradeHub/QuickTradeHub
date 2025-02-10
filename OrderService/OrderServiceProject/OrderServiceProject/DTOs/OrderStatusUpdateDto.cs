using OrderServiceProject.Models;

namespace OrderServiceProject.DTOs
{
    public class OrderStatusUpdateDto
    {
        public OrderStatus NewStatus { get; set; }
    }
}