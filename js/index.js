function $(ele) {
  return document.getElementById(ele);
}

function checkToken() {
  var getToken = localStorage.getItem("User");
}

async function createUser(phoneNum) {
  fetch("https://localhost:7189/api/UserDatasApi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // userId: 0,
      number: phoneNum,
      role:"Customer",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((user) => {
      // Handle user data here
      console.log(user);
      // alert("Welcome to Burger Mania!!!");
      localStorage.setItem("User", JSON.stringify(user));
      window.location.href = "./home.html";
    })
    .catch(async (error) => {
      console.log("An error occurred: ", error.message);
    });
//   console.log("User created successfully:");
}

$("loginSubmit").addEventListener("submit", async (e) => {
  e.preventDefault();
  var phoneNum = $("phone").value;
  fetch(
    "https://localhost:7189/api/UserDatasApi/GetUserByMobileNo/" +
      phoneNum
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((user) => {
      // Handle user data here
      console.log(user);
      // alert("Welcome Back!!!\nWe were waiting for you.");
      localStorage.setItem("User", JSON.stringify(user));
      window.location.href = "./home.html";
    })
    .catch(async (error) => {
      if (error.message.includes("404")) {
        console.log("User not found, creating a new user...");
        // Call a function to create a new user
        await createUser(phoneNum);
      } else {
        console.log("An error occurred: ", error.message);
      }
    });
});
