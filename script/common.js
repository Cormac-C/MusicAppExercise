// * SHOULD RUN ON ALL PAGES

let logout = () => {
  localStorage.removeItem("currentUser");
  location.reload();
};

// TODO: Figure out error
try {
  if (localStorage.getItem("currentUser")) {
    const user = localStorage.getItem("currentUser");
    $("#topBar").html([
      '<img src="',
        user.profilePic || "images/user.png",
        '" class=profilePic/>',
        "<button id='logout'>",
        "Logout",
      ].join("")
    );
    $("#logout").click(logout);
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
