using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderServiceProject.Models;
using OrderServiceProject.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace OrderServiceProject.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(OrderDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Create a new order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto orderDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var order = new Order
            {
                UserId = orderDto.UserId,
                ShippingAddress = orderDto.ShippingAddress,
                BillingAddress = orderDto.BillingAddress,
                OrderItems = orderDto.OrderItems.Select(item => new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                }).ToList(),
                TotalAmount = orderDto.OrderItems.Sum(item => item.UnitPrice * item.Quantity),
                Status = OrderStatus.Pending,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpGet]
        // Ensures only admins can access this endpoint
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)  // Include order items if you want detailed info about each order
                .ToListAsync();

            return Ok(orders);
        }

        // Get a specific order by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            return order == null ? NotFound() : Ok(order);
        }

        // Get all orders for a specific user with pagination
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(string userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedDate);

            var totalCount = await query.CountAsync();
            var orders = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(o => o.OrderItems)
                .ToListAsync();

            return Ok(new PagedResult<Order>
            {
                Data = orders,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            });
        }

        // Update the status of an order
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto statusDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            if (order.Status == statusDto.NewStatus)
            {
                return BadRequest("Order is already in the specified status.");
            }

            order.Status = statusDto.NewStatus;
            order.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(order);
        }

        // Delete an order by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();

            _context.OrderItems.RemoveRange(order.OrderItems);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Payment Endpoints
        [HttpPost("{orderId}/payments")]
        public async Task<IActionResult> CreatePayment(int orderId, [FromBody] PaymentCreateDto paymentDto)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound("Order not found");

            var payment = new Payments
            {
                OrderId = orderId,
                Amount = paymentDto.Amount,
                Currency = paymentDto.Currency,
                PaymentMethod = paymentDto.PaymentMethod,
                Status = PaymentStatus.Pending,
                CreatedDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
        }

        // Get Payment by ID
        [HttpGet("payments/{paymentId}")]
        public async Task<IActionResult> GetPayment(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            return payment == null ? NotFound() : Ok(payment);
        }

        // Confirm a payment
        [HttpPost("payments/{paymentId}/confirm")]
        public async Task<IActionResult> ConfirmPayment(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return NotFound();

            if (payment.Status == PaymentStatus.Completed)
            {
                return BadRequest("Payment is already completed.");
            }

            payment.Status = PaymentStatus.Completed;
            payment.PaymentDate = DateTime.UtcNow;

            var order = await _context.Orders.FindAsync(payment.OrderId);
            if (order != null)
            {
                order.PaymentStatus = PaymentStatus.Completed;
                order.UpdatedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(payment);
        }
    }
}
