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

class CreatePlaylist {
  constructor() {
    this.reset();
  }

  reset() {
    this.title = "";
    this.cover = "album14.jpg";
    this.songs = [];
    $("#song-search").val("");
    this.render();
  }

  render() {
    $("#songs").html("");
    this.songs.forEach(id => {
      const song = tempSongs[id];
      $("#songs").append(`<p>${song.title}: ${song.artist}</p>`);
    });
    $("#title").val(this.title);
    $("#save-button").attr("disabled", !this.canSave());
  }

  canSave() {
    return this.title !== "" && this.songs.length > 0;
  }

  save() {
    if (this.canSave()) {
      let playlists = JSON.parse(localStorage.getItem("PLAYLISTS") ?? "[]");
      playlists.push({
        title: this.title,
        cover: this.cover,
        songs: this.songs,
      });
      localStorage.setItem("PLAYLISTS", JSON.stringify(playlists));
      this.reset();
    }
  }

  addSong(id) {
    this.songs.push(id);
    this.render();
  }

  changetitle(event) {
    this.title = event.target.value;
    this.render();
  }

  search(event) {
    const query = event.target.value;
    if (query !== "") {
      // Find songs where the title matches that aren't in the playlist
      const songMatches = Object.entries(tempSongs).filter(
        ([id, {title}]) => title.includes(query) && !this.songs.includes(id)
        );
      // TODO: Find songs where the artist matches the query
      // Add the matches to the DOM
      $("#suggested-songs").html("");
      songMatches.forEach(([id, {title, artist}]) => {
        $("#suggested-songs").append(`<p onclick="ctrl.addSong('${id}');">${title}: ${artist}</p>`);
      });
    }
  }
}

const ctrl = new CreatePlaylist();