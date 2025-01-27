namespace OrderServiceProject.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public string UserId { get; set; }
    }

}
