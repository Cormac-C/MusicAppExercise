class UsePlaylist {
  constructor() {
    this.reset();
  }

  reset() {
    const urlParams = new URLSearchParams(window.location.search);
    this.ID = urlParams.get('ID');
    this.type = urlParams.get('type') ?? "user-playlist";
    this.editable = false;
    this.possibleSongs = JSON.parse(localStorage.getItem("songs") ?? "[]");

    switch (this.type) {
      case "album":
        this.playlist = this.getAlbum(urlParams.get('artist'));
        break;
      case "new-playlist":
        const newPlaylists = JSON.parse(localStorage.getItem("USER-PLAYLISTS") ?? "[]");
        newPlaylists.push({
          title: "New Playlist",
          cover: "album14.jpg",
          songs: [],
        });
        localStorage.setItem("USER-PLAYLISTS", JSON.stringify(newPlaylists));
        location.href = `playlist.html?type=user-playlist&ID=${newPlaylists.length - 1}`;
        break;
      case "user-playlist":
        this.editable = true;
        const playlists = JSON.parse(localStorage.getItem("USER-PLAYLISTS") ?? "[]");
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
    const songID = this.playlist.songs.splice(oldPos, 1);
    this.playlist.songs.splice(newPos, 0, songID);
    this.save();
    this.render();
  }

  save() {
    let playlists = JSON.parse(localStorage.getItem("USER-PLAYLISTS") ?? "[]");
    playlists.splice(this.ID, 1, this.playlist); // Replace playlist with a new one
    localStorage.setItem("USER-PLAYLISTS", JSON.stringify(playlists));
  }

  render() {
    $("#songs").html(""); // Reset song list
    $("#playlist-title").val(this.playlist.title);
    this.playlist.songs.forEach((id, i) => {
      const song = this.possibleSongs[id];
      $("#songs").append(this.songRender(song.title, song.artist, id, i));
    });
    if (!this.editable) {
      $("#playlist-title").replaceWith(`<h2>${this.playlist.title}</h2>`);
      $("#search").hide();
    }
  }

  songRender(title, artist, id, index) {
    return (
      `
      <div
        id="${id}"
        ondragstart="ctrl.handleDragStart(event, ${index})"
        draggable="${this.editable}"
        ${this.editable ? 'style="cursor: grab"' : null}
        class="song"
      >
        <p>${title}</p>
        <p>${artist}</p>
      </div>
      `
    );
  }

  songSearch(event) {
    const query = event.target.value;
    if (query !== "") {
      // Find songs where the title matches that aren't in the playlist
      const songMatches = Object.entries(this.possibleSongs).filter(
        ([id, {title}]) => title.includes(query) && !this.playlist.songs.includes(id)
      );
      // TODO: Find songs where the artist matches the query
      // Add the matches to the DOM
      $("#suggested-songs").html("");
      songMatches.forEach(([id, {title, artist}]) => {
        $("#suggested-songs").append(`<p onclick="ctrl.addSong('${id}');">${title}: ${artist}</p>`);
      });
    }
  }

  changetitle(event) {
    if (this.editable) {
      this.playlist.title = event.target.value;
      this.save();
    }
  }

  addSong(id) {
    if (this.editable) {
      this.playlist.songs.push(id);
      this.save();
      this.render();
    }
  }

  error(msg="Uh oh! Something went wrong :(") {
    $("#playlist-title").html(msg);
  }
}

const ctrl = new UsePlaylist();
