// * SHOULD RUN ON ALL PAGES

// TODO: Figure out error
try {
  if (localStorage.getItem("currentUser")) {
    const user = localStorage.getItem("currentUser");
    const bar = document.getElementById("topBar");
    bar.innerHTML = [
      '<img src="',
      user.profilePic || "images/user.png",
      '" class=profilePic/>',
    ].join("");
  }
} catch (error) {
  console.log(error)
}

if (!localStorage.getItem("songs")) {
  localStorage.setItem("songs", JSON.stringify([
    {
      "title": "Superstition",
      "artist": "Stevie Wonder",
      "album": "Talking Book"
    },
    {
      "title": "Sir Duke",
      "artist": "Stevie Wonder",
      "album": "Songs in the Key of Life"
    },
    {
      "title": "Signed, Sealed, Delivered (I'm Yours)",
      "artist": "Stevie Wonder",
      "album": "Signed, Sealed, Delivered"
    },
  ]));
}