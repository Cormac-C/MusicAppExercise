class Artist {
  constructor() {
    this.reset();
  }

  reset() {
    const urlParams = new URLSearchParams(window.location.search);
    this.artist = urlParams.get("artist");
    this.possibleSongs = JSON.parse(localStorage.getItem("songs") ?? "[]");
    this.likedSongs = JSON.parse(
      localStorage.getItem("USER-LIKED-SONGS") ?? "[]"
    );

    if (this.possibleSongs) {
      this.albums = this.getAlbums();
      this.songs = 
      this.render();
    } else {
      this.error();
    }
  }

  getAlbums() {
    return this.possibleSongs.reduce((albums, song) => {
      if (song.artist === this.artist) {
        if (!Object.keys(albums).includes(song.album)) {
          albums[song.album] = [];
        }
        albums[song.album].push(song);
      }
      return albums;
    }, {});
  }

  getSongList(index=0) {
    return Object.entries(this.possibleSongs).map(
      ([id, song]) => song.artist === this.artist ? id : null
    ).filter((id) => id !== null).slice(index);
  }

  render() {
    $("#albums").html("");
    $("#songs").html("");
    $("#artist-name").html(this.artist);
    Object.entries(this.albums).forEach(([title, songs]) => {
      $("#albums").append(this.albumRender(title, songs));
    });
    this.getSongList().forEach((id, index) => {
      $("#songs").append(this.songRender(id, index));
    });
  }

  songRender(id, index) {
    const { artist, title } = this.possibleSongs[id];
    return `
      <div id="${id}" class="song" onclick="player.setQueue(ctrl.getSongList(${index}))">
        <div class="info">
          <h3>${title}</h3>
          <p>${artist}</p>
        </div>
        <img
          src="images/heart-${
            this.likedSongs.includes(id) ? "full" : "empty"
          }.svg"
          height="24px"
          onclick="ctrl.likeSong('${id}'); event.stopPropagation()"
          style="cursor: pointer"
        />
      </div>
      `;
  }

  albumRender(title, songs) {
    return `
      <button class="imageLabel" onClick="location.href = 'playlist.html?type=album&ID=${title}&artist=${this.artist}';">
        <img class="playButton" src="images/playButton.png" alt="Icon" />
        <img src="images/album13.jpg" alt="Icon" />
        <h5>${title}</h5>
        <p>${songs.length} Songs</p>
      </button>
      `;
  }

  likeSong(id) {
    if (this.likedSongs.includes(id)) {
      this.likedSongs = this.likedSongs.filter((song) => song != id);
    } else {
      this.likedSongs.push(id);
    }
    localStorage.setItem("USER-LIKED-SONGS", JSON.stringify(this.likedSongs));
    this.reset(); // Overkill, but easy
  }

  error() {
    $("#playlist-title").html("Uh oh! Something went wrong :(");
  }
}

const ctrl = new Artist();
