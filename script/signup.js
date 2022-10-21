function createCookie(event) {
  const userCookie = {};
  const formData = new FormData(event.target);
  for (var [key, value] of formData.entries()) {
    userCookie[key] = value;
  }
  localStorage.setItem(userCookie.userName, JSON.stringify(userCookie));
  location.href = "login.html";
  return false;
}
