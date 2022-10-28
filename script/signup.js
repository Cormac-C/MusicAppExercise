function encodeImage(userCookie, file) {
  var reader = new FileReader();
  reader.onloadend = function () {
    userCookie["profilePic"] = reader.result;
    localStorage.setItem(userCookie.userName, JSON.stringify(userCookie));
    localStorage.setItem("currentUser", JSON.stringify(userCookie));
  };
  reader.readAsDataURL(file);
}

function createCookie(event) {
  const userCookie = {};
  const formData = new FormData(event.target);
  for (var [key, value] of formData.entries()) {
    if (key === "profilePic") {
      userCookie[key] = encodeImage(userCookie, value);
    } else {
      userCookie[key] = value;
    }
  }
  localStorage.setItem(userCookie.userName, JSON.stringify(userCookie));
  location.href = "login.html";
  return false;
}
