const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams, "url");
const user = urlParams.get("user");
console.log(user, "user");
//Dummy data land
const users = [
  {
    name: "James",
    likedSongs: [0, 1, 2],
    mostplayed: [2, 3, 1],
    topArtists: ["Nas", "Dr. Dre"],
    followedUsers: [],
  },
  {
    name: "Samantha",
    likedSongs: [0, 3, 2],
    mostplayed: [4, 0, 3],
    topArtists: ["J. Cole", "Dr. Dre"],
    followedUsers: [],
  },
  {
    name: "Brad",
    likedSongs: [3, 4, 2],
    mostplayed: [3, 2, 1],
    topArtists: ["Nas", "Drake"],
    followedUsers: [],
  },
];
const userIndex = users.findIndex((u) => u.name === user);
console.log(userIndex, "userIndex");
let likedSongs =
  userIndex === -1
    ? JSON.parse(localStorage.getItem("USER-LIKED-SONGS") ?? "[]")
    : users[userIndex].likedSongs;
const mostplayed = userIndex === -1 ? [0, 3, 4] : users[userIndex].mostplayed;
const topArtists =
  userIndex === -1
    ? ["Drake", "J. Cole", "Kanye"]
    : users[userIndex].topArtists;
const followedUsers =
  userIndex === -1
    ? ["James", "Samantha", "Brad"]
    : users[userIndex].followedUsers;

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

function userRender(user) {
  return `
        <button class="artistLabel" onClick="location.href = 'profile.html?user=${user}';">
          <h5>${user}</h5>
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

function renderMostPlayedArtists() {
  $("#artists").html("");
  topArtists.forEach((artist) => {
    $("#artists").append(artistRender(artist));
  });
}

function songRender(id, index, liked) {
  const possibleSongs = JSON.parse(localStorage.getItem("songs") ?? "[]");
  const { artist, title } = possibleSongs[id];
  return `
      <div id="${id}" class="song" onclick="player.setQueue(['${id}'])">
        <div class="info">
          <h3>${title}</h3>
          <p>${artist}</p>
        </div>
        <span class="actions">
          <span
            class="material-symbols-rounded"
            onclick="player.addToQueue('${id}'); event.stopPropagation()"
          >
            queue_music
          </span>
          <img
            src="images/heart-${liked ? "full" : "empty"}.svg"
            height="24px"
            onclick="likeSong('${id}'); event.stopPropagation()"
            style="cursor: pointer"
          />
        </span>
      </div>
    `;
}

function renderLikedSongs() {
  $("#likedsongs").html("");
  likedSongs.forEach((id, i) => {
    $("#likedsongs").append(songRender(id, i, true));
  });
}

function renderMostPlayedSongs() {
  $("#topsongs").html("");
  mostplayed.forEach((id, i) => {
    const liked = likedSongs.includes(id + "");
    $("#topsongs").append(songRender(id, i, liked));
  });
}

function renderFollowedUsers() {
  $("#users").html("");
  followedUsers.forEach((user) => {
    $("#users").append(userRender(user));
  });
  if (followedUsers.length === 0) $("#userTitle").hide();
}

function likeSong(id) {
  if (likedSongs.includes(id)) {
    likedSongs = likedSongs.filter((song) => song != id);
  } else {
    likedSongs.push(id);
  }
  localStorage.setItem("USER-LIKED-SONGS", JSON.stringify(likedSongs));
  init();
}

function init() {
  renderPlaylists();
  renderMostPlayedArtists();
  renderLikedSongs();
  renderMostPlayedSongs();
  renderFollowedUsers();
}

init();
