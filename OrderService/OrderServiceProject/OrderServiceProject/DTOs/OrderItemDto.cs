﻿using OrderServiceProject.Models;

namespace OrderServiceProject.DTOs
{
    public class OrderItemDto
    {
        public int SellerId { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

       
    }
}