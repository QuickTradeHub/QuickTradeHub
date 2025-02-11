using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OrderServiceProject.Models;

namespace OrderServiceProject.Services
{
    public class RazorpayService
    {
        private readonly string razorpayKey;
        private readonly string razorpaySecret;

        private readonly HttpClient _httpClient;

        public RazorpayService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            razorpayKey = configuration["Razorpay:Key"]; // Read Razorpay Key from appsettings.json
            razorpaySecret = configuration["Razorpay:Secret"]; // Read Razorpay Secret from appsettings.json
        }

        private async Task<string> CreateOrderAsync(decimal amount)
        {
            var orderRequest = new
            {
                amount = amount * 100, // Amount in paise (1 INR = 100 paise)
                currency = "INR",
                receipt = "order_receipt",
                payment_capture = 1 // Automatically capture payment
            };

            var requestContent = new StringContent(JsonConvert.SerializeObject(orderRequest), Encoding.UTF8, "application/json");

            var byteArray = Encoding.ASCII.GetBytes($"{razorpayKey}:{razorpaySecret}");
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

            var response = await _httpClient.PostAsync("https://api.razorpay.com/v1/orders", requestContent);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            dynamic orderResponse = JsonConvert.DeserializeObject(responseBody);

            return orderResponse.id;
        }

        public async Task<string> ProcessCardPaymentAsync(CardPaymentRequest request)
        {
            try
            {
                var orderId = await CreateOrderAsync(request.Amount);

                var paymentRequest = new
                {
                    amount = request.Amount * 100,
                    currency = "INR",
                    method = "card", // Payment method is card
                    order_id = orderId,
                    card = new
                    {
                        number = request.CardNumber,
                        expiry_month = request.ExpiryDate.Split('/')[0],
                        expiry_year = request.ExpiryDate.Split('/')[1],
                        cvv = request.CVV
                    }
                };

                var requestContent = new StringContent(JsonConvert.SerializeObject(paymentRequest), Encoding.UTF8, "application/json");

                var byteArray = Encoding.ASCII.GetBytes($"{razorpayKey}:{razorpaySecret}");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                var response = await _httpClient.PostAsync("https://api.razorpay.com/v1/payments", requestContent);
                response.EnsureSuccessStatusCode();

                var responseBody = await response.Content.ReadAsStringAsync();
                dynamic paymentResponse = JsonConvert.DeserializeObject(responseBody);

                return paymentResponse.id; // Payment ID after successful processing
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error during card payment: " + ex.Message);
                return null;
            }
        }

        public async Task<string> ProcessUPIPaymentAsync(UPIPaymentRequest request)
        {
            try
            {
                var orderId = await CreateOrderAsync(request.Amount);

                var paymentRequest = new
                {
                    amount = request.Amount * 100,
                    currency = "INR",
                    method = "upi", // UPI payment method
                    order_id = orderId,
                    upi = new { upii = request.UpiId }
                };

                var requestContent = new StringContent(JsonConvert.SerializeObject(paymentRequest), Encoding.UTF8, "application/json");

                var byteArray = Encoding.ASCII.GetBytes($"{razorpayKey}:{razorpaySecret}");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                var response = await _httpClient.PostAsync("https://api.razorpay.com/v1/payments", requestContent);
                response.EnsureSuccessStatusCode();

                var responseBody = await response.Content.ReadAsStringAsync();
                dynamic paymentResponse = JsonConvert.DeserializeObject(responseBody);

                return paymentResponse.id; // Payment ID after successful processing
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error during UPI payment: " + ex.Message);
                return null;
            }
        }

        public async Task<string> ProcessWalletPaymentAsync(WalletPaymentRequest request)
        {
            try
            {
                var orderId = await CreateOrderAsync(request.Amount);

                var paymentRequest = new
                {
                    amount = request.Amount * 100,
                    currency = "INR",
                    method = request.Wallet.ToLower(), // Wallet method (Paytm, etc.)
                    order_id = orderId
                };

                var requestContent = new StringContent(JsonConvert.SerializeObject(paymentRequest), Encoding.UTF8, "application/json");

                var byteArray = Encoding.ASCII.GetBytes($"{razorpayKey}:{razorpaySecret}");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

                var response = await _httpClient.PostAsync("https://api.razorpay.com/v1/payments", requestContent);
                response.EnsureSuccessStatusCode();

                var responseBody = await response.Content.ReadAsStringAsync();
                dynamic paymentResponse = JsonConvert.DeserializeObject(responseBody);

                return paymentResponse.id; // Payment ID after successful processing
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error during wallet payment: " + ex.Message);
                return null;
            }
        }

        public async Task<bool> ProcessCODPaymentAsync(CODPaymentRequest request)
        {
            try
            {
                Console.WriteLine($"Placing COD order for amount {request.Amount}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error during COD payment: " + ex.Message);
                return false;
            }
        }
    }
}
