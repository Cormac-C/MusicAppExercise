class Artist {
  constructor() {
    this.reset();
  }

  reset() {
    const urlParams = new URLSearchParams(window.location.search);
    this.artist = urlParams.get('artist');
    this.possibleSongs = JSON.parse(localStorage.getItem("songs") ?? "[]");

    if (this.possibleSongs) {
      this.albums = this.possibleSongs.reduce((albums, song) => {
        if (song.artist === this.artist) {
          if (!Object.keys(albums).includes(song.album)) {
            albums[song.album] = [];
          }
          albums[song.album].push(song);
        }
        return albums;
      }, {});
      this.render();
    } else {
      this.error();
    }
  }

  render() {
    $("#artist-name").html(this.artist);
    Object.entries(this.albums).forEach(([title, songs]) => {
      $("#albums").append(this.albumRender(title, songs));
    });
  }

  songRender(title, artist) {
    return (
      `<p>${title}: ${artist}</p>`
    );
  }

  albumRender(title, songs) {
    return (
      `
      <button class="imageLabel" onClick="location.href = 'playlist.html?type=album&ID=${title}&artist=${this.artist}';">
        <img class="playButton" src="images/playButton.png" alt="Icon" />
        <img src="images/album13.jpg" alt="Icon" />
        <h5>${title}</h5>
        <p>${songs.length} Songs</p>
      </button>
      `
    );
  }

  error() {
    $("#playlist-title").html("Uh oh! Something went wrong :(");
  }
}

const ctrl = new Artist();
