namespace OrderServiceProject.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<CartItem> CartItems { get; set; }
        public double TotalAmount { get; set; }
        public string Status { get; set; }
    }

}
