function checkCookie(event) {
  const loginInfo = {};
  const formData = new FormData(event.target);
  console.log(formData.entries());
  for (var [key, value] of formData.entries()) {
    loginInfo[key] = value;
  }
  const matchUser = localStorage.getItem(loginInfo.userName);
  if (matchUser) {
    matchUser = JSON.parse(matchUser);
    console.log("Matched userName", matchUser);
    if (matchUser.password === loginInfo.password) {
      console.log("Password matches");
    } else {
      console.log("Wrong Password");
    }
  } else {
    console.log("No user");
  }

  return false;
}
