$(document).ready(function () {
  try {
    if (localStorage.getItem("currentUser")) {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      $("#name").val(user.name);
      $("#surname").val(user.surname);
      $("#email").val(user.email);
      $("#dob").val(user.dob);
    }
  } catch (error) {
    console.log(error);
  }
});

function encodeImage(userCookie, file) {
  var reader = new FileReader();
  reader.onloadend = function () {
    userCookie["profilePic"] = reader.result.length > 5 ? reader.result : "";
    localStorage.setItem(userCookie.userName, JSON.stringify(userCookie));
    localStorage.setItem("currentUser", JSON.stringify(userCookie));
  };
  reader.readAsDataURL(file);
}

function updateCookies(event) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userCookie = user;
  const formData = new FormData(event.target);
  for (var [key, value] of formData.entries()) {
    if (key === "profilePic") {
      userCookie[key] = encodeImage(userCookie, value);
    } else {
      userCookie[key] = value;
    }
  }
  localStorage.setItem(userCookie.userName, JSON.stringify(userCookie));
  localStorage.setItem("currentUser", JSON.stringify(userCookie));
  location.href = "index.html";
  return false;
}
