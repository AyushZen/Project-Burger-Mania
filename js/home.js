// const menuItems = [
//   {
//     id:"burger1",
//     name: "Crispy Supreme",
//     price: [100,150,200],
//     imageUrl: "./images/crispySupreme.png",
//     type: "Veg",
//     availableTypes:["Veg","Egg","Non-Veg"],
//     count:0
//   },
//   {
//     id:"burger2",
//     name: "Surprise",
//     price: [100,150,200],
//     imageUrl: "./images/surprise.png",
//     type: "Veg",
//     availableTypes:["Veg","Egg","Non-Veg"],
//     count:0
//   },
// {
//   id:"burger3",
//   name: "WHOPPER",
//   price: [100,150,200],
//   imageUrl: "./images/whooper.png",
//   type: "Veg",
//   availableTypes:["Veg","Egg","Non-Veg"],
//   count:0
// },
// {
//   id:"burger4",
//   name: "Chilli Cheese",
//   price: [100,150,200],
//   imageUrl: "./images/chilliCheese.png",
//   type: "Veg",
//   availableTypes:["Veg","Egg","Non-Veg"],
//   count:0
// },
// {
//   id:"burger5",
//   name: "Tandoor Grill",
//   price: [100,150,200],
//   imageUrl: "./images/tandooriGrill.png",
//   type: "Veg",
//   availableTypes:["Veg","Egg","Non-Veg"],
//   count:0
// },
// ];

const user  = JSON.parse(localStorage.getItem('User'));

var menuItems;
async function getData() {
  console.log(user.token);
  var getDatas = await fetch(
    "https://localhost:7189/api/BurgerAvailabilityDatasApi",{
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
    }
  );
  const burgerData = await getDatas.json();
  console.log(burgerData);
  menuItems = burgerData;

  const menuContainer = document.getElementById("menuSection");
  menuItems.map((item, index) => {
    menuContainer.innerHTML += `
        <div class="card menuCard" onmouseover="this.style.boxShadow = '${
          item.burgerType === "Veg"
            ? "0 0 10px green"
            : item.burgerType === "Egg"
            ? "0 0 10px yellow"
            : "0 0 10px red"
        }'" onmouseout="this.style.boxShadow = 'none'">
          <img
            class="card-img-top"
            src="${item.burgerImage}"
            alt="Card image cap"
            width="150px"
            height="250px"
          />
          <div
            class="card-body d-flex flex-column justify-content-center align-items-center"
          >
            <h5 class="card-title">${item.burgerName}</h5>
            <h5 class="card-title" id="price${index}">$${
      item.burgerPrice[item.burgerAvailableTypes.indexOf(item.burgerType)]
    }</h5>
            <div class="d-flex flex-column justify-content-center align-items-center">
              <select onchange="updateBurgerType(${index}, this.value)">
                ${item.burgerAvailableTypes
                  .map(
                    (type) =>
                      `<option value="${type}" ${
                        type === item.burgerType ? "selected" : ""
                      }>${type}</option>`
                  )
                  .join("")}
              </select>
              <input
                type="number"
                name="phone"
                id="phone"
                min="0"
                class="m-2 w-25 p-1"
                value="${item.burgerCount}"
                onchange="updateBurgerCount(${index},this.value)"
              />
              <button
                type="submit"
                class="btn btn-primary p-1 w-50 addCartButtons"
                id="cartButtons"
                onclick="addToCart(${index})"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
    `;
  });
}

getData();

function updateBurgerCount(id, value) {
  menuItems[id].burgerCount = value;
}

// function updateBurgerType(id, value) {
//   menuItems[id].burgerType = value;
// }

function updateBurgerType(id, value) {
  const burgerId = menuItems[id].burgerId;
  menuItems[id].burgerType = value;
  document.getElementById(`price${id}`).innerText = `$${
    menuItems[burgerId].burgerPrice[menuItems[burgerId].burgerAvailableTypes.indexOf(value)]
  }`;
}

const cartItems = new Map();

function updateBurgerCount(id, value) {
  menuItems[id].burgerCount = value;
}

function addToCart(index) {
  const item = menuItems[index];
  const key = `${item.burgerId}-${item.burgerType}`;

  if (item.burgerCount > 0) {
    const pricePerItem = item.burgerPrice[item.burgerAvailableTypes.indexOf(item.burgerType)];
    const totalPrice = pricePerItem * item.burgerCount;

    cartItems.set(key, {
      burgerId: item.burgerId,
      burgerName: item.burgerName,
      burgerPrice: pricePerItem,
      totalPrice: totalPrice,
      burgerImage:item.burgerImage,
      burgerDesc: item.burgerDesc,
      burgerType: item.burgerType,
      burgerCount: item.burgerCount,
    });
  } else {
    cartItems.delete(key);
  }
  updateFinalOrderSection();
  console.log(cartItems);
}

// function updateBurgerType(id, value) {
//   menuItems[id].type = value;
//   document.getElementById(`price${id}`).innerText = `$${menuItems[id].price[menuItems[id].availableTypes.indexOf(value)]}`;
// }

function updateFinalOrderSection() {
  const finalOrderSection = document.getElementById("finalOrderSection");
  finalOrderSection.innerHTML = ""; // Clear the section

  cartItems.forEach((item, key) => {
    finalOrderSection.innerHTML += `
      <div class="orderItem card mb-3">
        <div class="card-body">
          <h5 class="card-title">${item.burgerName} (${item.burgerType})</h5>
          <p class="card-text">Count: ${item.burgerCount}</p>
          <p class="card-text">Price per item: $${item.burgerPrice}</p>
          <p class="card-text">Total price: $${item.totalPrice}</p>
        </div>
      </div>
    `;
  });
}

async function submitOrder() {
  let totalPrice = 0;
  if(cartItems.size == 0){
    alert("Please add items in the cart to place the order");
    return;
  }
  // Calculate total price
  cartItems.forEach((item, key) => {
    totalPrice += item.totalPrice;
  });

  // Apply discount
  let discount = 0;
  if (totalPrice >= 500 && totalPrice < 1000) {
    discount = 0.05; // 5% discount
  } else if (totalPrice >= 1000) {
    discount = 0.1; // 10% discount
  }

  const discountedPrice = totalPrice * (1 - discount);
  const user  = JSON.parse(localStorage.getItem('User'));  

  // Create order
  const orderResponse = await fetch('https://localhost:7189/api/OrdersDatasApi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify({
      "orderDateTime": new Date().toISOString(),
      "userId": user.user.userId,
      "totalBillPrice": discountedPrice
    })
  });

  const orderData = await orderResponse.json();
  const orderId = orderData.orderId;
  console.log(cartItems);

  // Create each burger in the cartitems
    cartItems.forEach(async (item, key) => {
      const burgerResponse = await fetch('https://localhost:7189/api/BurgerOrderDatasApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          "burgerName": item.burgerName,
          "burgerPrice": item.burgerPrice,
          "burgerImage": item.burgerImage,
          "burgerType": item.burgerType,
          "burgerDesc": item.burgerDesc,
          "orderId":orderId,
          "burgerCount": item.burgerCount
        })
    });
  })

  // Show final price in an alert
  alert(
    `Total Price: $${totalPrice}\nDiscount: ${
      discount * 100
    }%\nFinal Price after Discount: $${discountedPrice}`
  );
  cartItems.clear();
}


function goToUserPage(){
  window.location.href = "./user.html";
}