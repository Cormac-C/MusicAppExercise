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

const tempPlaylists = [
  {
    "title": "Spanish House",
    "cover": "album1.jpg",
    "songs": ["id-1", "id-2"]
  },{
    "title": "La Merce",
    "cover": "album2.jpg",
    "songs": []
  },{
    "title": "EDM",
    "cover": "album3.jpg",
    "songs": []
  },{
    "title": "Relaxing Vibes to Chill to",
    "cover": "album4.jpg",
    "songs": []
  },{
    "title": "Classic Rock",
    "cover": "album5.jpg",
    "songs": []
  },{
    "title": "2010's Party Swing",
    "cover": "album6.jpg",
    "songs": []
  },{
    "title": "For the Road",
    "cover": "album7.jpg",
    "songs": []
  },{
    "title": "Feel Good",
    "cover": "album8.jpg",
    "songs": []
  },{
    "title": "Are we Real Friends Yet?",
    "cover": "album9.jpg",
    "songs": []
  },{
    "title": "A Trip of Nostalgia",
    "cover": "album10.jpg",
    "songs": []
  },{
    "title": "Top Tracks of 2020",
    "cover": "album11.jpg",
    "songs": []
  },{
    "title": "Spanish Classics to Impress your Mother",
    "cover": "album12.jpg",
    "songs": []
  },{
    "title": "Cutest Tracks of the Decade",
    "cover": "album13.jpg",
    "songs": []
  },{
    "title": "Best 2000's Party Music",
    "cover": "album14.jpg",
    "songs": []
  },{
    "title": "Electronic Dance 🔥🔥",
    "cover": "album15.jpg",
    "songs": []    
  }
];

// * Set page details
function setPageDetails(playlist) {
  $("#playlist-title").html(playlist.title);
  playlist.songs.forEach(id => {
    const song = tempSongs[id];
    $("#songs").append(`<p>${song.title}: ${song.artist}</p>`);
  });
}

function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const playlistID = urlParams.get('pID');

  if (tempPlaylists[playlistID]) {
    setPageDetails(tempPlaylists[playlistID]);
  }
}

init();
