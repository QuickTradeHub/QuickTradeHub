using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderServiceProject.Models;

namespace OrderServiceProject.Controllers
{
   

    [ApiController]
    [Route("")]
    public class OrderController : ControllerBase
    {
        private readonly OrderDbContext _context;

        public OrderController(OrderDbContext context)
        {
            _context = context;
        }

        // POST /cart/add: Add a product to the cart
        [HttpPost("cart/add")]
        public async Task<IActionResult> AddToCart([FromBody] CartItem cartItem)
        {
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();
            return Ok(cartItem);
        }

        // PUT /cart/update: Update the quantity of a product in the cart
        [HttpPut("cart/update")]
        public async Task<IActionResult> UpdateCart([FromBody] CartItem cartItem)
        {
            var existingItem = await _context.CartItems.FindAsync(cartItem.Id);
            if (existingItem == null)
            {
                return NotFound();
            }

            existingItem.Quantity = cartItem.Quantity;
            await _context.SaveChangesAsync();
            return Ok(existingItem);
        }

        // DELETE /cart/remove/{id}: Remove a product from the cart
        [HttpDelete("cart/remove/{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)
            {
                return NotFound();
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET /cart/view: View the user's cart
        [HttpGet("cart/view")]
        public async Task<IActionResult> ViewCart([FromQuery] string userId)
        {
            var cartItems = await _context.CartItems.Where(x => x.UserId == userId).ToListAsync();
            return Ok(cartItems);
        }

        // POST /order/create: Create a new order from the cart
        [HttpPost("order/create")]
        public async Task<IActionResult> CreateOrder([FromQuery] string userId)
        {
            var cartItems = await _context.CartItems.Where(x => x.UserId == userId).ToListAsync();
            if (!cartItems.Any())
            {
                return BadRequest("No items in cart");
            }

            var order = new Order
            {
                UserId = userId,
                CreatedDate = DateTime.Now,
                CartItems = cartItems,
                TotalAmount = cartItems.Sum(x => x.Price * x.Quantity),
                Status = "Created"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Optionally, remove items from the cart after order creation
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        // GET /orders: Get all orders of a user
        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] string userId)
        {
            var orders = await _context.Orders.Where(x => x.UserId == userId).ToListAsync();
            return Ok(orders);
        }

        // GET /orders/{id}: Get details of a specific order by ID
        [HttpGet("orders/{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders.Include(o => o.CartItems).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        // PATCH /orders/{id}/status: Update the status of an order
        [HttpPatch("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.Status = status;
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        // POST /order/payment: Track or initiate a payment for an order
        [HttpPost("order/payment")]
        public async Task<IActionResult> TrackPayment([FromBody] Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return Ok(payment);
        }

        // GET /orders/history: Get order history for a user
        [HttpGet("orders/history")]
        public async Task<IActionResult> GetOrderHistory([FromQuery] string userId)
        {
            var orders = await _context.Orders.Where(x => x.UserId == userId).OrderByDescending(o => o.CreatedDate).ToListAsync();
            return Ok(orders);
        }
    }

}
