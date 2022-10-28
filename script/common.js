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
    const user = localStorage.getItem("currentUser");
    $("#topBar > button").hide();
    $("#topBar").append(
      [
        '<img id="pic" src="',
        user.profilePic || "images/user.png",
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
    // $("#footer > #sign-up-message").hide();
  } else {
    $("#header-search").hide();
  }
} catch (error) {
  console.log(error);
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
    ])
  );
}

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
        title.includes(this.query)
      );
      // Add the matches to the DOM
      songMatches.forEach(([id, { title, artist }]) => {
        $("#header-search-suggestions").append(
          `
            <p>
              ${title}: ${artist}
              <img
                src="images/heart-${
                  this.likedSongs.includes(id) ? "full" : "empty"
                }.svg"
                height="24px"
                onclick="search.likeSong('${id}')"
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
    this.reset();
  }
  
  reset() {
    this.paused = true;
    const songID = localStorage.getItem("CURRENT-SONG");
    if (songID) {
      this.setSong(songID);
    }
  }

  setSong(id) {
    this.currentSong = id;
    localStorage.setItem("CURRENT-SONG", id);
    this.play(this.songs[id]);
  }

  play(song) {
    this.paused = false;
    $("#footer").html(
      `
      <audio controls autoplay>
        <source src="images/${song.file}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      `
    )
  }
}

const search = new SearchController();
const player = new PlayerController();