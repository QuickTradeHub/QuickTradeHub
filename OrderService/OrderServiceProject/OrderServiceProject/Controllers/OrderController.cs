// Controllers/OrderController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderServiceProject.Models;

namespace OrderServiceProject.Controllers
{
    [ApiController]
    [Route("")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(OrderDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Cart Endpoints
        [HttpPost("cart/items")]
        public async Task<IActionResult> AddToCart([FromBody] CartItem item)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.CartItems.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCartItems), new { id = item.Id }, item);
        }

        [HttpGet("cart/items/{userId}")]
        public async Task<IActionResult> GetCartItems(string userId)
        {
            var items = await _context.CartItems
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(items);
        }

        [HttpPut("cart/items/{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] CartItem item)
        {
            if (id != item.Id) return BadRequest();

            var existingItem = await _context.CartItems.FindAsync(id);
            if (existingItem == null) return NotFound();

            existingItem.Quantity = item.Quantity;
            existingItem.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("cart/items/{id}")]
        public async Task<IActionResult> RemoveCartItem(int id)
        {
            var item = await _context.CartItems.FindAsync(id);
            if (item == null) return NotFound();

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Order Endpoints
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto orderDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var cartItems = await _context.CartItems
                .Where(c => c.UserId == orderDto.UserId)
                .ToListAsync();

            if (!cartItems.Any()) return BadRequest("Cart is empty");

            var order = new Order
            {
                UserId = orderDto.UserId,
                ShippingAddress = orderDto.ShippingAddress,
                BillingAddress = orderDto.BillingAddress,
                OrderItems = cartItems.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    ProductName = c.ProductName,
                    Quantity = c.Quantity,
                    UnitPrice = c.Price
                }).ToList(),
                TotalAmount = cartItems.Sum(c => c.Price * c.Quantity)
            };

            _context.Orders.Add(order);

            // Clear cart
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            return order == null ? NotFound() : Ok(order);
        }

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
                .ToListAsync();

            return Ok(new PagedResult<Order>
            {
                Data = orders,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            });
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto statusDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = statusDto.NewStatus;
            order.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(order);
        }

        // Payment Endpoints
        [HttpPost("{orderId}/payments")]
        public async Task<IActionResult> CreatePayment(int orderId, [FromBody] PaymentCreateDto paymentDto)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound("Order not found");

            var payment = new Payment
            {
                OrderId = orderId,
                Amount = paymentDto.Amount,
                Currency = paymentDto.Currency,
                PaymentMethod = paymentDto.PaymentMethod,
                Status = PaymentStatus.Pending
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Payment), new { id = payment.Id }, payment);
        }

        [HttpPost("payments/{paymentId}/confirm")]
        public async Task<IActionResult> ConfirmPayment(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return NotFound();

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

        // Additional DTO classes
        public class OrderCreateDto
        {
            public string UserId { get; set; }
            public Address ShippingAddress { get; set; }
            public Address BillingAddress { get; set; }
        }

        public class OrderStatusUpdateDto
        {
            public OrderStatus NewStatus { get; set; }
        }

        public class PaymentCreateDto
        {
            public decimal Amount { get; set; }
            public string Currency { get; set; } = "USD";
            public string PaymentMethod { get; set; }
        }

        public class PagedResult<T>
        {
            public List<T> Data { get; set; }
            public int Page { get; set; }
            public int PageSize { get; set; }
            public int TotalCount { get; set; }
        }
    }
}