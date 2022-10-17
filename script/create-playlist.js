const newPlaylist = {
  title: "Best 2000's Party Music",
  cover: "album14.jpg",
  songs: []
};

const tempSongs = {
  "id-1": {
    "title": "Song 1",
    "artist": "Artist 1"
  },
  "id-2": {
    "title": "Song 2",
    "artist": "Artist 1"
  }
};

function renderPlaylist() {
  $("#songs").html("");
  newPlaylist.songs.forEach(id => {
    const song = tempSongs[id];
    $("#songs").append(`<p>${song.title}: ${song.artist}</p>`);
  });
}

function savePlaylist() {
  let playlists = JSON.parse(localStorage.getItem("PLAYLISTS") ?? "[]");
  playlists.push(newPlaylist);
  console.log(playlists);
  localStorage.setItem("PLAYLISTS", JSON.stringify(playlists));
}

function changeTitle(event) {
  newPlaylist.title = event.target.value;
}

function addSong(id) {
  console.log(id)
  newPlaylist.songs.push(id);
  console.log(newPlaylist.songs)
  renderPlaylist();
}

function searchSong(event) {
  const query = event.target.value;
  if (query !== "") {
    // Find songs where the title matches that aren't in the playlist
    const songMatches = Object.entries(tempSongs).filter(
      ([id, {title}]) => title.includes(query) && !newPlaylist.songs.includes(id)
      );
    // TODO: Find songs where the artist matches the query
    // Add the matches to the DOM
    $("#suggested-songs").html("");
    songMatches.forEach(([id, {title, artist}]) => {
      $("#suggested-songs").append(`<p onclick="addSong('${id}');">${title}: ${artist}</p>`);
    });
  }
}

function init() {
  renderPlaylist();
}

init();