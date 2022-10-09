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
      } else {
        console.log("Wrong Password");
      }
    } catch (error) {
      console.log(error, "e");
    }
  } else {
    console.log("No user");
  }

  return false;
}
