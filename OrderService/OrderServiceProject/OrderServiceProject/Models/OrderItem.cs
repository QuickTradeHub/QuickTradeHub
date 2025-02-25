﻿
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OrderServiceProject.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public string ProductId { get; set; }
        public int SellerId {  get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int OrderId { get; set; }

        [JsonIgnore]
        public Order Order { get; set; }
    }
}