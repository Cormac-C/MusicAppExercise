function renderPlaylists() {
  let playlists = JSON.parse(localStorage.getItem("PLAYLISTS") ?? "[]");
  $("#playlists").html("");
  if (playlists.length) {
    playlists.forEach((playlist) => {
      $("#playlists").append(
        `<p>${playlist.title} (${playlist.songs.length} Songs)</p>`
      );
    });
  }
}

function init() {
  renderPlaylists();
}

console.log($("#playlists"));
init();

if (localStorage.getItem("currentUser")) {
  const user = localStorage.getItem("currentUser");
  const bar = document.getElementById("topBar");
  bar.innerHTML = [
    '<img src="',
    user.profilePic || "images/user.png",
    '" class=profilePic/>',
  ].join("");
}
