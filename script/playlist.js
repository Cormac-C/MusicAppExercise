const tempSongs = {
  "id-1": {
    "title": "Song 1",
    "artist": "Artist 1"
  },
  "id-2": {
    "title": "Song 2",
    "artist": "Artist 1"
  }
}

class UsePlaylist {
  constructor() {
    this.reset();
  }

  reset() {
    const urlParams = new URLSearchParams(window.location.search);
    this.playlistID = urlParams.get('pID');

    const playlists = JSON.parse(localStorage.getItem("PLAYLISTS") ?? "[]");
    const playlist = playlists[this.playlistID];

    if (playlist) {
      this.playlist = playlist;
      this.render();
    } else {
      this.error();
    }
  }

  render() {
    $("#playlist-title").html(this.playlist.title);
    this.playlist.songs.forEach(id => {
      const song = tempSongs[id];
      $("#songs").append(this.songRender(song.title, song.artist));
    });
  }

  songRender(title, artist) {
    return (
      `<p>${title}: ${artist}</p>`
    );
  }

  error() {
    $("#playlist-title").html("Uh oh! Something went wrong :(");
  }
}

const ctrl = new UsePlaylist();
