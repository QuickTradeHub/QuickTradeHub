namespace OrderServiceProject.DTOs
{
    public class PaymentCreateDto
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string PaymentMethod { get; set; }
    }
}