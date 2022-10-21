class UsePlaylist {
  constructor() {
    this.reset();
  }

  reset() {
    const urlParams = new URLSearchParams(window.location.search);
    this.playlistID = urlParams.get('pID');
    this.possibleSongs = JSON.parse(localStorage.getItem("songs") ?? "[]");

    const playlists = JSON.parse(localStorage.getItem("USER-PLAYLISTS") ?? "[]");
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
      const song = this.possibleSongs[id];
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
