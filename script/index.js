function playlistRender(playlist, index) {
  return (
    `
    <button class="imageLabel" onClick="location.href = 'playlist.html?ID=${index}';">
      <img class="playButton" src="images/playButton.png" alt="Icon" />
      <img src="images/${playlist.cover}" alt="Icon" />
      <h5>${playlist.title}</h5>
      <p>${playlist.songs.length} Songs</p>
    </button>
    `
  );
}

function artistRender(artist) {
  return (
    `
    <button class="imageLabel" onClick="location.href = 'artist.html?artist=${artist}';">
      <h5>${artist}</h5>
    </button>
    `
  );
}

function renderPlaylists() {
  const playlists = JSON.parse(localStorage.getItem("USER-PLAYLISTS") ?? "[]");
  $("#playlists").html("");
  if (playlists.length) {
    playlists.forEach((playlist, i) => {
      $("#playlists").append(playlistRender(playlist, i));
    });
  }
}

function renderArtists() {
  const songs = JSON.parse(localStorage.getItem("songs") ?? "[]");
  const artists = songs.reduce((artists, song) => {
    if (!artists.has(song.artist)) {
      artists.add(song.artist);
    }
    return artists;
  }, new Set());

  $("#artists").html("");
  if (artists.size) {
    artists.forEach((artist) => {
      $("#artists").append(artistRender(artist));
    });
  }
}

function init() {
  renderPlaylists();
  renderArtists();
}

init();