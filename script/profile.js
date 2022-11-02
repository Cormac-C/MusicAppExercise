function playlistRender(playlist, index) {
  return `
      <button class="imageLabel" onClick="location.href = 'playlist.html?ID=${index}';">
        <img class="playButton" src="images/playButton.png" alt="Icon" />
        <img src="images/${playlist.cover}" alt="Icon" />
        <h5>${playlist.title}</h5>
        <p>${playlist.songs.length} Songs</p>
      </button>
      `;
}

function artistRender(artist) {
  return `
      <button class="artistLabel" onClick="location.href = 'artist.html?artist=${artist}';">
        <h5>${artist}</h5>
      </button>
      `;
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

function songRender(id, index, liked) {
  const possibleSongs = JSON.parse(localStorage.getItem("songs") ?? "[]");
  const { artist, title } = possibleSongs[id];
  return `
      <div id="${id}" class="song">
        <div class="info">
          <h3>${title}</h3>
          <p>${artist}</p>
        </div>
        <img
          src="images/heart-${liked ? "full" : "empty"}.svg"
          height="24px"
          onclick="ctrl.likeSong('${id}')"
          style="cursor: pointer"
        />
        <span
          class="material-symbols-rounded"
          onclick="player.setSong('${id}')"
        >
          play_circle
        </span>
      </div>
    `;
}

function renderLikedSongs() {
  const likedSongs = JSON.parse(
    localStorage.getItem("USER-LIKED-SONGS") ?? "[]"
  );
  $("#likedsongs").html("");
  likedSongs.forEach((id, i) => {
    $("#likedsongs").append(songRender(id, i, true));
  });
}

function renderMostPlayedSongs() {
  const likedSongs = JSON.parse(
    localStorage.getItem("USER-LIKED-SONGS") ?? "[]"
  );
  const mostplayed = [0, 3, 4]; //Currently dummy data, idk if we have to actually implement
  $("#topsongs").html("");
  mostplayed.forEach((id, i) => {
    const liked = likedSongs.includes(id + "");
    $("#topsongs").append(songRender(id, i, liked));
  });
}

function init() {
  renderPlaylists();
  renderArtists();
  renderLikedSongs();
  renderMostPlayedSongs();
}

init();
