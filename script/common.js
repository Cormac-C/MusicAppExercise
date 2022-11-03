// * SHOULD RUN ON ALL PAGES

let goToAccount = () => {
  location.href = "account.html";
};

let goToProfile = () => {
  location.href = "profile.html";
};

let logout = () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("currentUser");
    location.href = "index.html";
  }
};

let toggleDropdown = () => {
  $("#logout").toggle();
  $("#profile").toggle();
  $("#account").toggle();
};

// TODO: Figure out error
try {
  if (localStorage.getItem("currentUser")) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const picture =
      user.profilePic && typeof user.profilePic === "string"
        ? user.profilePic
        : "images/user.png";
    $("#topBar > button").hide();
    $("#topBar").append(
      [
        '<img id="pic" src="',
        picture,
        '" class=profilePic/>',
        "<button id='account'>",
        "Account",
        "<button id='profile'>",
        "Profile",
        "<button id='logout'>",
        "Logout",
      ].join("")
    );
    $("#pic").click(toggleDropdown);
    $("#logout").click(logout);
    $("#account").click(goToAccount);
    $("#profile").click(goToProfile);
    $("#logout").hide();
    $("#profile").hide();
    $("#account").hide();
    $("#sign-up-message").hide();
  } else {
    $("#header-search").hide();
    $("#your-playlists").hide();
  }
} catch (error) {
  console.log(error);
}

if (localStorage.getItem("USER-PLAYLISTS")) {
  $("#no-playlists").hide();
}

if (!localStorage.getItem("songs")) {
  localStorage.setItem(
    "songs",
    JSON.stringify([
      {
        title: "What's the Difference",
        artist: "Dr. Dre",
        album: "2001",
        file: "What's the Difference.mp3",
      },
      {
        title: "Mob Ties",
        artist: "Drake",
        album: "Scorpion",
        file: "Mob Ties.mp3",
      },
      {
        title: "G.O.M.D.",
        artist: "J. Cole",
        album: "2014 Forest Hill Drive",
        file: "GOMD.mp3",
      },
      {
        title: "Ether",
        artist: "Nas",
        album: "Stillmatic",
        file: "Ether.mp3",
      },
      {
        title: "POWER",
        artist: "Kanye",
        album: "My Beautiful Dark Twisted Fantasy",
        file: "POWER.mp3",
      },
      {
        title: "Black Skinhead (Instrumental)",
        artist: "Kanye",
        album: "Yeezus",
        file: "Black Skinhead (Instrumental).mp3",
      },
    ])
  );
}

const upcomingReleases = [
  {
    artist: "Bruce Springsteen",
    title: "Only the Strong Survive",
    releaseDate: new Date("2022-11-11"),
  },
  {
    artist: "BROCKHAMPTON",
    title: "The Family",
    releaseDate: new Date("2022-11-18"),
  },
  {
    artist: "Nickelback",
    title: "Get Rollin'",
    releaseDate: new Date("2022-11-18"),
  },
  {
    artist: "Stormzy",
    title: "This Is What I Mean",
    releaseDate: new Date("2022-11-25"),
  },
];

function renderReleases(releases) {
  $("#releases").html("");
  releases.forEach((release) => {
    $("#releases").append(releaseRender(release));
  });
  setInterval(
    function (releases) {
      $("#releases").html("");
      releases.forEach((release) => {
        $("#releases").append(releaseRender(release));
      });
    },
    60000,
    releases
  );
}

function releaseRender(release) {
  var timeDifference = (release.releaseDate - new Date()) / 1000,
    ss = Math.floor(timeDifference % 60)
      .toString()
      .padStart(2, "0"),
    ms = Math.floor((timeDifference / 60) % 60)
      .toString()
      .padStart(2, "0"),
    hs = Math.floor((timeDifference / 3600) % 24)
      .toString()
      .padStart(2, "0"),
    ds = Math.floor(timeDifference / 86400).toString();
  const text = `${ds} Days, ${hs} Hours, ${ms} Minutes Until Release`;
  return `
    <p>
      <strong>${release.title}</strong>
      <br/>
      ${release.artist}
      <br/>
      ${text}
    <\p>
  `;
}

renderReleases(upcomingReleases);

class SearchController {
  constructor() {
    this.songs = JSON.parse(localStorage.getItem("songs"));
    this.likedSongs = JSON.parse(
      localStorage.getItem("USER-LIKED-SONGS") ?? "[]"
    );
    this.query = "";
  }

  find(query) {
    $("#header-search-suggestions").html("");
    this.query = query;
    if (this.query !== "") {
      // Find songs where the title matches that aren't in the playlist
      const songMatches = Object.entries(this.songs).filter(([id, { title }]) =>
        title.toLowerCase().includes(this.query.toLowerCase())
      );
      // Add the matches to the DOM
      songMatches.forEach(([id, { title, artist }]) => {
        $("#header-search-suggestions").append(
          `
            <p onclick="player.setSong('${id}')">
              ${title}: ${artist}
              <img
                src="images/heart-${
                  this.likedSongs.includes(id) ? "full" : "empty"
                }.svg"
                height="24px"
                onclick="search.likeSong('${id}'); event.stopPropagation();"
                style="cursor: pointer"
              />
            </p>
          `
        );
      });
    }
  }

  likeSong(id) {
    if (this.likedSongs.includes(id)) {
      this.likedSongs = this.likedSongs.filter((song) => song != id);
    } else {
      this.likedSongs.push(id);
    }
    localStorage.setItem("USER-LIKED-SONGS", JSON.stringify(this.likedSongs));
    this.find(this.query); // Refresh search results to rerender the heart icon
  }
}

class PlayerController {
  constructor() {
    this.songs = JSON.parse(localStorage.getItem("songs"));
    this.queue = [];
    this.songIndex = undefined;
    this.playing = false;
    $("audio").on("ended", () => this.playNextSong());
    this.renderController();
  }

  setQueue(ids, newIndex = 0) {
    this.queue = ids;
    this.songIndex = newIndex;
    this.togglePlayStatus(true);
    this.updateAudio();
  }

  setSong(id) {
    this.setQueue([id]);
  }

  addToQueue(id) {
    this.queue.push(id);
    this.renderController();
  }

  playNextSong() {
    if (this.songIndex < this.queue.length - 1) {
      this.songIndex += 1;
    }
    this.togglePlayStatus(true);
    this.updateAudio();
  }

  playPreviousSong() {
    if (this.songIndex > 0) {
      this.songIndex -= 1;
    }
    this.togglePlayStatus(true);
    this.updateAudio();
  }

  togglePlayStatus(status = undefined) {
    if (this.queue.length) {
      this.playing = status ?? !this.playing;
    }
    if (this.playing) {
      $("audio").trigger("play");
    } else {
      $("audio").trigger("pause");
    }
    this.renderController();
  }

  volumeDown() {
    const V = $('audio').prop("volume");
    $('audio').prop("volume", Math.min(Math.max(0, V - 0.1), 1));
    this.renderController();
  }

  volumeUp() {
    const V = $('audio').prop("volume");
    $('audio').prop("volume", Math.min(Math.max(0, V + 0.1), 1));
    this.renderController();
  }

  renderController() {
    $("#controls").hide("");
    if (this.queue.length) {
      $("#footer").html(`
        <div id="controls">
          <span class="material-symbols-rounded" onclick="player.playPreviousSong()">
            skip_previous
          </span>
          <span class="material-symbols-rounded" onclick="player.togglePlayStatus()">
            ${this.playing ? "pause" : "play_arrow"}
          </span>
          <span class="material-symbols-rounded" onclick="player.playNextSong()">
            skip_next
          </span>
          <div style="width: 1rem"></div>
          <span class="material-symbols-rounded" onclick="player.volumeDown()">
            volume_down
          </span>
          <span class="material-symbols-rounded" onclick="player.volumeUp()">
            volume_up
          </span>
          <p style="margin: 0 0 0 .5rem">
            ${Math.round($("audio").prop("volume")*100)}/100
          </p>
        </div>
      `);
    }
  }

  updateAudio() {
    if (this.queue.length) {
      const id = this.queue[this.songIndex];
      const song = this.songs[id];
      $("audio").replaceWith(`
        <audio autoplay>
          <source src="images/${song.file}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      `);
    }
  }
}

const search = new SearchController();
const player = new PlayerController();
