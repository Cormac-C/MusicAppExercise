// * SHOULD RUN ON ALL PAGES

let logout = () => {
  localStorage.removeItem("currentUser");
  location.reload();
};

let toggleDropdown = () => {
  $("#logout").toggle();
  $("#profile").toggle();
  $("#account").toggle();
};

// TODO: Figure out error
try {
  if (localStorage.getItem("currentUser")) {
    const user = localStorage.getItem("currentUser");
    $("#topBar").html(
      [
        '<img id="pic" src="',
        user.profilePic || "images/user.png",
        '" class=profilePic/>',
        "<button id='account'>",
        "Account",
        "<button id='profile'>",
        "Profile",
        "<button id='logout'>",
        "Logout",
      ].join("")
    );
    $("#pic").click(toggleDropdown);
    $("#logout").click(logout);
    $("#logout").hide();
    $("#profile").hide();
    $("#account").hide();
    $("#footer").hide();
  }
} catch (error) {
  console.log(error);
}

if (!localStorage.getItem("songs")) {
  localStorage.setItem(
    "songs",
    JSON.stringify([
      {
        title: "Superstition",
        artist: "Stevie Wonder",
        album: "Talking Book",
      },
      {
        title: "Sir Duke",
        artist: "Stevie Wonder",
        album: "Songs in the Key of Life",
      },
      {
        title: "Signed, Sealed, Delivered (I'm Yours)",
        artist: "Stevie Wonder",
        album: "Signed, Sealed, Delivered",
      },
    ])
  );
}
