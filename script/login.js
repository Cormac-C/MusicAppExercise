function checkLogin(event) {
  console.log("checking cookie");
  const loginInfo = {};
  const formData = new FormData(event.target);
  for (var [key, value] of formData.entries()) {
    loginInfo[key] = value;
  }
  const matchUser = localStorage.getItem(loginInfo.userName);
  if (matchUser !== null) {
    try {
      const parsed = JSON.parse(matchUser);
      if (parsed.password === loginInfo.password) {
        console.log("Password matches");
        localStorage.setItem("currentUser", matchUser);
        location.href = "index.html";
      } else {
        window.alert("Incorrect Password");
        event.target.reset();
      }
    } catch (error) {
      console.log(error, "e");
    }
  } else {
    window.alert("No User Found with this Name");
    event.target.reset();
  }

  return false;
}
