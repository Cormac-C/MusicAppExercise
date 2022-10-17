function renderPlaylists() {
  let playlists = JSON.parse(localStorage.getItem("PLAYLISTS") ?? "[]");
  $("#playlists").html("");
  if (playlists.length) {
    playlists.forEach(playlist => {
      $("#playlists").append(`<p>${playlist.title} (${playlist.songs.length} Songs)</p>`);
    });
  }
}

function init() {
  renderPlaylists();
}

console.log($("#playlists"));
init();