export const fetchOrders = async (userId, page, pageSize) => {
    const response = await fetch(`http://13.49.132.61:5142/api/orders/user/${userId}?page=${page}&pageSize=${pageSize}`);
    const data = await response.json();
    return {
      data: data.data,  // Modify based on your actual API response structure
      totalPages: data.totalCount,  // Adjust accordingly
    };
  };
  