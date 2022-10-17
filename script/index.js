

function renderPlaylists() {
  console.log("Hello!");
  let playlists = JSON.parse(localStorage.getItem("PLAYLISTS") ?? "[]");
  $("#playlists").html("");
  if (playlists.length) {
    playlists.forEach(playlist => {
      console.log(playlist);
      $("#playlists").append(`<p>${playlist.title} (${playlist.songs.length} Songs)</p>`);
    });
  }
}

function init() {
  renderPlaylists();
}

init();