using Microsoft.AspNetCore.Mvc;
using OrderServiceProject.Services;
using OrderServiceProject.Models;
using System.Threading.Tasks;

namespace OrderServiceProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly RazorpayService _razorpayService;

        public PaymentsController(RazorpayService razorpayService)
        {
            _razorpayService = razorpayService;
        }

        // Card payment endpoint
        [HttpPost("card")]
        public async Task<IActionResult> PayByCard([FromBody] CardPaymentRequest request)
        {
            // Validate card details
            if (!IsValidCard(request))
            {
                return BadRequest(new { success = false, message = "Invalid card details." });
            }

            var paymentResponse = await _razorpayService.ProcessCardPaymentAsync(request);
            if (paymentResponse != null)
            {
                return Ok(new { success = true, message = "Card payment successful.", paymentResponse });
            }
            return StatusCode(500, new { success = false, message = "Card payment processing failed." });
        }

        // UPI payment endpoint
        [HttpPost("upi")]
        public async Task<IActionResult> PayByUPI([FromBody] UPIPaymentRequest request)
        {
            // Validate UPI ID
            if (!IsValidUPI(request))
            {
                return BadRequest(new { success = false, message = "Invalid UPI ID." });
            }

            var paymentResponse = await _razorpayService.ProcessUPIPaymentAsync(request);
            if (paymentResponse != null)
            {
                return Ok(new { success = true, message = "UPI payment request sent.", paymentResponse });
            }
            return StatusCode(500, new { success = false, message = "UPI payment processing failed." });
        }

        // Wallet payment endpoint
        [HttpPost("wallet")]
        public async Task<IActionResult> PayByWallet([FromBody] WalletPaymentRequest request)
        {
            // Validate wallet selection
            if (!IsValidWallet(request))
            {
                return BadRequest(new { success = false, message = "Invalid wallet selection." });
            }

            var paymentResponse = await _razorpayService.ProcessWalletPaymentAsync(request);
            if (paymentResponse != null)
            {
                return Ok(new { success = true, message = $"Payment successful via {request.Wallet}.", paymentResponse });
            }
            return StatusCode(500, new { success = false, message = "Wallet payment processing failed." });
        }

        // COD payment endpoint
        [HttpPost("cod")]
        public async Task<IActionResult> PayByCOD([FromBody] CODPaymentRequest request)
        {
            var paymentResponse = await _razorpayService.ProcessCODPaymentAsync(request);
            if (paymentResponse)
            {
                return Ok(new { success = true, message = "Order placed with Cash on Delivery." });
            }
            return StatusCode(500, new { success = false, message = "COD order processing failed." });
        }

        // Helper methods for validation
        private bool IsValidCard(CardPaymentRequest request)
        {
            return !string.IsNullOrEmpty(request.CardNumber) &&
                   !string.IsNullOrEmpty(request.ExpiryDate) &&
                   !string.IsNullOrEmpty(request.CVV);
        }

        private bool IsValidUPI(UPIPaymentRequest request)
        {
            return !string.IsNullOrEmpty(request.UpiId);
        }

        private bool IsValidWallet(WalletPaymentRequest request)
        {
            return !string.IsNullOrEmpty(request.Wallet);
        }
    }
}
