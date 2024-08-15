var user = JSON.parse(localStorage.getItem("User"));
async function getData() {
  try {
    const response = await fetch(
      "https://localhost:7189/api/OrdersDatasApi/user/" + user.user.userId,{
        method:'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      }
    );

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error("No orders found"); // You can customize this message
    }

    const orderData = await response.json();

    // Check if orderData is empty
    if (orderData.length === 0) {
      throw new Error("No orders found"); // Handle the case for empty data
    }

    console.log(orderData);

    const orderContainer = document.getElementById("OrdersSection");
    orderData.forEach((item, index) => {

      orderContainer.innerHTML += `
          <div class="card menuCard" onmouseout="this.style.boxShadow = 'none'">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <h2 class="card-title">Order Id: ${item.orderId}</h2>
              <h5 class="card-title" id="order${index}">${(new Date(item.orderDateTime)).toDateString()}</h5>
              <h5 class="card-title" id="order${index}">${(new Date(item.orderDateTime)).toLocaleTimeString()}</h5>
              <h5 class="card-title">$${item.totalBillPrice}</h5>
            </div>
          </div>
        `;
    });
  } catch (error) {
    console.error(error.message);
    // Optionally, display an error message to the user
    const orderContainer = document.getElementById("OrdersSection");
    orderContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}
getData();
