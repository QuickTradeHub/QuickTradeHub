namespace OrderServiceProject.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public double Amount { get; set; }
        public bool IsPaid { get; set; }
        public DateTime PaymentDate { get; set; }
    }

}
