namespace OrderServiceProject.Models
{
    public class CardPaymentRequest
    {
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
        public decimal Amount { get; set; }
    }
}
