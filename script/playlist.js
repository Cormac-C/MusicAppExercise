class UsePlaylist {
  constructor() {
    this.reset();
  }

  reset() {
    const urlParams = new URLSearchParams(window.location.search);
    this.ID = urlParams.get("ID");
    this.type = urlParams.get("type") ?? "user-playlist";
    this.editable = false;
    this.possibleSongs = JSON.parse(localStorage.getItem("songs") ?? "[]");
    this.likedSongs = JSON.parse(
      localStorage.getItem("USER-LIKED-SONGS") ?? "[]"
    );

    switch (this.type) {
      case "album":
        this.playlist = this.getAlbum(urlParams.get("artist"));
        break;
      case "liked":
        this.playlist = {
          title: "Liked Songs",
          cover: "",
          songs: this.likedSongs,
        };
        break;
      case "new-playlist":
        const newPlaylists = JSON.parse(
          localStorage.getItem("USER-PLAYLISTS") ?? "[]"
        );
        newPlaylists.push({
          title: "New Playlist",
          cover: "album14.jpg",
          songs: [],
        });
        localStorage.setItem("USER-PLAYLISTS", JSON.stringify(newPlaylists));
        location.href = `playlist.html?type=user-playlist&ID=${
          newPlaylists.length - 1
        }`;
        break;
      case "user-playlist":
        this.editable = true;
        const playlists = JSON.parse(
          localStorage.getItem("USER-PLAYLISTS") ?? "[]"
        );
        this.playlist = playlists[this.ID];
        break;
      default:
        this.error("Unknown action type");
        return;
    }

    if (this.playlist) {
      this.render();
    } else {
      this.error("Playlist not found :(");
    }
  }

  getAlbum(artist) {
    const album = this.ID;
    if (!artist || !album) return {};
    return {
      title: `${album} by ${artist}`,
      cover: this.cover,
      songs: this.possibleSongs.reduce((playlist, song, i) => {
        if (song.artist === artist && song.album === album) {
          playlist.push(i);
        }
        return playlist;
      }, []),
    };
  }

  handleDragStart(ev, index) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("old-position", index);
    ev.dataTransfer.dropEffect = "move";
  }

  handleDrag(ev) {
    if (this.editable) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
    }
  }

  handleDragEnd(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const oldPos = ev.dataTransfer.getData("old-position");
    const newPos = $(ev.path[1]).index();
    const songID = this.playlist.songs.splice(oldPos, 1)[0];
    this.playlist.songs.splice(newPos, 0, songID);
    this.save();
    this.render();
  }

  save() {
    if (this.type === "user-playlist") {
      let playlists = JSON.parse(
        localStorage.getItem("USER-PLAYLISTS") ?? "[]"
      );
      playlists.splice(this.ID, 1, this.playlist); // Replace playlist with a new one
      localStorage.setItem("USER-PLAYLISTS", JSON.stringify(playlists));
    }
  }

  render() {
    $("#songs").html(""); // Reset song list
    $("#playlist-title").val(this.playlist.title);
    $("#play-playlist").attr("onclick", `player.setQueue([${this.playlist.songs}])`);
    this.playlist.songs.forEach((id, i) => {
      $("#songs").append(this.songRender(id, i));
    });
    if (!this.editable) {
      $("#playlist-title").replaceWith(`<h2>${this.playlist.title}</h2>`);
      $("#search").hide();
      $("#delete-playlist").hide();
      $(".actions").hide();
      $(".handle").hide();
    }
  }

  songRender(id, index) {
    const { artist, title } = this.possibleSongs[id];
    return `
      <div id="${id}" class="song" onclick="player.setQueue(ctrl.getSongList(${index}))">
        <span 
          class="handle material-symbols-rounded"
          ondragstart="ctrl.handleDragStart(event, ${index})"
          draggable="${this.editable}"
          onclick="event.stopPropagation()"
        >
          menu
        </span>
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
        <div class="actions">
          <span 
            class="material-symbols-rounded"
            onclick="ctrl.deleteSong(${index}); event.stopPropagation()"
          >
            delete
          </span>
        </div>
      </div>
      `;
  }

  songSearch(event) {
    $("#suggested-songs").html("");
    const query = event.target.value;
    if (query !== "") {
      // Find songs where the title matches that aren't in the playlist
      const songMatches = Object.entries(this.possibleSongs).filter(
        ([id, { title }]) =>
          title.toLowerCase().includes(query.toLowerCase()) &&
          !this.playlist.songs.includes(id)
      );
      // TODO: Find songs where the artist matches the query
      // Add the matches to the DOM
      songMatches.forEach(([id, { title, artist }]) => {
        $("#suggested-songs").append(
          `<p onclick="ctrl.addSong('${id}');">${title}: ${artist}</p>`
        );
      });
    }
  }

  changeTitle(event) {
    if (this.editable) {
      this.playlist.title = event.target.value;
      this.save();
    }
  }

  addSong(id) {
    if (this.editable && !this.playlist.songs.includes(id)) {
      this.playlist.songs.push(id);
      this.save();
      this.render();
    }
  }

  // Get all songs in the playlist
  getSongList(index=0) {
    return this.playlist.songs.slice(index);
  }

  deleteSong(index) {
    if (this.editable && index < this.playlist.songs.length) {
      this.playlist.songs.splice(index, 1);
      this.save();
      this.render();
    }
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

  deletePlaylist() {
    if (this.editable & confirm("Are you sure you wish to delete this playlist?")) {
      const playlists = JSON.parse(
        localStorage.getItem("USER-PLAYLISTS") ?? "[]"
      );
      playlists.splice(this.ID, 1);
      localStorage.setItem("USER-PLAYLISTS", JSON.stringify(playlists));
      location.href = "index.html";
    }
  }

  error(msg = "Uh oh! Something went wrong :(") {
    $("#playlist-title").html(msg);
  }
}

const ctrl = new UsePlaylist();
