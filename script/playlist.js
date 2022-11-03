class UsePlaylist {
  constructor() {
    this.reset();
  }

  reset() {
    const urlParams = new URLSearchParams(window.location.search);
    this.ID = urlParams.get("ID");
    this.type = urlParams.get("type") ?? "user-playlist";
    this.editing = false;
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
      case "user-playlist":
        this.editable = true;
        const playlists = JSON.parse(
          localStorage.getItem("USER-PLAYLISTS") ?? "[]"
        );
        this.playlist = playlists[this.ID];

        if (this.playlist === undefined) {
          this.ID = playlists.length;
          this.editing = true;
          this.playlist = {
            title: "New Playlist",
            cover: "album14.jpg",
            songs: [],
          };
        }
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
    if (this.editing) {
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
    this.edited = true;
    this.playlist.songs.splice(newPos, 0, songID);
    this.render();
  }

  edit() {
    if (this.editable) {
      this.editing = true;
      this.render();
    }
  }

  save() {
    if (this.editable) {
      let playlists = JSON.parse(
        localStorage.getItem("USER-PLAYLISTS") ?? "[]"
      );
      playlists.splice(this.ID, 1, this.playlist); // Replace playlist with a new one
      localStorage.setItem("USER-PLAYLISTS", JSON.stringify(playlists));
      this.editing = false;
      // If this playlist is new, refresh the page to update the URL
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("ID") === null) {
        location.href = `playlist.html?type=user-playlist&ID=${this.ID}`;
      }
      this.render();
    }
  }

  render() {
    $("#songs").html(""); // Reset song list
    const songs = this.playlist.songs;
    $("#play-playlist").click(function() {
      player.setQueue(songs, 0); // function runs in the global scope
    });
    this.playlist.songs.forEach((id, i) => {
      $("#songs").append(this.songRender(id, i));
    });
    if (this.editing) {
      $("#playlist-title-editable").val(this.playlist.title);
      $("#playlist-title-editable").show();
      $("#save-playlist").show();
      $("#edit-playlist").hide();
      $("#playlist-title").hide();
      $("#search").show();
    } else {
      if (this.editable) {
        $("#edit-playlist").show();
      } else {
        $("#edit-playlist").hide();
      }
      $("#playlist-title").html(this.playlist.title);
      $("#playlist-title").show();
      $("#playlist-title-editable").hide();
      $("#search").hide();
      $("#save-playlist").hide();
      $("#delete-playlist").hide();
      $(".delete-button").hide();
      $(".handle").hide();
      $("#save-playlist").hide();
      $("#search").hide();
    }
    if (this.editable) {
      $("#delete-playlist").show();
    } else {
      $("#delete-playlist").hide();
    }
  }

  songRender(id, index) {
    const { artist, title } = this.possibleSongs[id];
    return `
      <div id="${id}" class="song" onclick="player.setQueue([${this.playlist.songs}], ${index})">
        <span 
          class="handle material-symbols-rounded"
          ondragstart="ctrl.handleDragStart(event, ${index})"
          draggable="${this.editing}"
          onclick="event.stopPropagation()"
        >
          menu
        </span>
        <div class="info">
          <h3>${title}</h3>
          <p>${artist}</p>
        </div>
        <span class="actions">
          <span
          class="delete-button material-symbols-rounded"
            onclick="ctrl.deleteSong(${index}); event.stopPropagation()"
          >
            delete
          </span>
          <span
            class="material-symbols-rounded"
            onclick="player.addToQueue('${id}'); event.stopPropagation()"
          >
            queue_music
          </span>
          <img
            src="images/heart-${
              this.likedSongs.includes(id) ? "full" : "empty"
            }.svg"
            height="24px"
            onclick="ctrl.likeSong('${id}'); event.stopPropagation()"
            style="cursor: pointer"
          />
        </span>
      </div>
      `;
  }

  songSearch(query) {
    $("#suggested-songs").html("");
    if (query !== "") {
      this.query = query;
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
      if (songMatches.length === 0) {
        $("#suggested-songs").html("<h5>No songs were found :(</h5>")
      } 
    }
  }

  changeTitle(event) {
    if (this.editing) {
      this.playlist.title = event.target.value;
      this.render();
    }
  }

  addSong(id) {
    if (this.editing && !this.playlist.songs.includes(id)) {
      this.playlist.songs.push(id);
      this.songSearch(this.query);
      this.render();
    }
  }

  deleteSong(index) {
    if (this.editing && index < this.playlist.songs.length) {
      this.playlist.songs.splice(index, 1);
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
    this.render();
  }

  deletePlaylist() {
    if (confirm("Are you sure you wish to delete this playlist?")) {
      const playlists = JSON.parse(
        localStorage.getItem("USER-PLAYLISTS") ?? "[]"
      );
      playlists.splice(this.ID, 1); // TODO
      localStorage.setItem("USER-PLAYLISTS", JSON.stringify(playlists));
      location.href = "index.html";
    }
  }

  error(msg = "Uh oh! Something went wrong :(") {
    $("#playlist-title").html(msg);
  }
}

const ctrl = new UsePlaylist();
