function playlistRender(index, title, length) {
  return (
    `<p onClick="location.href = 'playlist.html?pID=${index}';"}>
      ${title} (${length} Songs)
    </p>`
  );
}

function renderPlaylists() {
  let playlists = JSON.parse(localStorage.getItem("PLAYLISTS") ?? "[]");
  $("#playlists").html("");
  if (playlists.length) {
    playlists.forEach(({title, songs}, i) => {
      $("#playlists").append(playlistRender(i, title, songs.length));
    });
  }
}

function init() {
  if (localStorage.getItem("currentUser")) {
    const user = localStorage.getItem("currentUser");
    const bar = document.getElementById("topBar");
    bar.innerHTML = [
      '<img src="',
      user.profilePic || "images/user.png",
      '" class=profilePic/>',
    ].join("");
  }

  renderPlaylists();
}

init();