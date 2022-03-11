let good = 0;
let streak = 0;
let count = 0;
let record = 0;
if(window.localStorage.getItem("record")){
  record = window.localStorage.getItem("record");
}

const initPage = (id, anime, animes) => {
  const app = document.querySelector("#app");
  app.style.display = "none";
  app.innerHTML=`
      <div class="score">
        <p>${good}/${count} bonne réponse</p>
        <p>${streak} bonne réponse à la suite</p>
        <p>Record ${record}</p>
      </div>
      <div data-video="${id}" data-autoplay="${count?1:0}" id="youtube-audio"></div>
      <div class="button">
          ${animes
            .map((value) => {
              return `<button class="btn  btn-primary" data-value="${value}"><p>${value}</p></button>`;
            })
            .join(" ")}
      </div>
      <button class="btn btn-danger" id="next">
        Suivant
      </button>
    `;
  const buttons = document.querySelectorAll(".button button");
  buttons.forEach((button) =>
    button.addEventListener("click", (e) => handleClick(e, anime))
  );
  const next = document.querySelector("#next");
  next.addEventListener("click", () => {
    onYouTubeIframeAPIReady();
  });

};

function onYouTubeIframeAPIReady() {
  init();
  const baliseAudio = document.getElementById("youtube-audio");

  const playPauseButton = document.createElement("img");
  playPauseButton.setAttribute("id", "youtube-icon");
  playPauseButton.style.cssText = "cursor:pointer;cursor:hand;";
  baliseAudio.appendChild(playPauseButton);

  const a = document.createElement("div");
  a.setAttribute("id", "youtube-player");
  baliseAudio.appendChild(a);

  const switchPlayerState = (playerState) => {
    const a = playerState ? "stop.png" : "play.png";
    playPauseButton.setAttribute("src", "./images/media-" + a);
  };

  baliseAudio.addEventListener("click", () => {
    player.getPlayerState() === YT.PlayerState.PLAYING ||
    player.getPlayerState() === YT.PlayerState.BUFFERING
      ? (player.pauseVideo(), switchPlayerState(!1))
      : (player.playVideo(), switchPlayerState(!0));
  });

  const player = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    videoId: baliseAudio.dataset.video,
    playerVars: {
      autoplay: baliseAudio.dataset.autoplay,
      loop: 0,
    },
    events: {
      onReady: (baliseAudio) => {
        player.setPlaybackQuality("small");
        document.querySelector("#app").style.display = "flex";
        switchPlayerState(player.getPlayerState() !== YT.PlayerState.CUED);
        if(player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState() === YT.PlayerState.BUFFERING){
          player.playVideo();
        }
      },
      onStateChange: (baliseAudio) => {
        baliseAudio.data === YT.PlayerState.ENDED && switchPlayerState(!1);
      },
    },
  });
}
const init = () => {
  const anime = getRandomItem(data);
  const animes = shuffleArray(getFourAnime(anime, data));
  const openingNumber = getRandomItem(data[anime]);
  const url = data[anime][openingNumber];
  const idVideo = getIdVideo(url);
  initPage(idVideo, anime, animes);
};

const getRandomItem = (data) => {
  const keys = Object.keys(data);
  const item = keys[Math.floor(Math.random() * keys.length)];
  return item;
};

const getFourAnime = (goodAnime, data) => {
  const animes = [goodAnime];
  while (animes.length < 4) {
    const anime = getRandomItem(data);
    if (!animes.includes(anime)) {
      animes.push(anime);
    }
  }
  return animes;
};

const getIdVideo = (url) => {
  const pattern = "https://www.youtube.com/watch?v=";
  return url.substring(pattern.length);
};

const handleClick = (e, anime) => {
  e.preventDefault();
  e.stopPropagation();
  let target;
  if(e.target.localName == "p"){
    target = e.target.parentNode;
  }else if(e.target.localName == "button"){
    target = e.target;
  }else{
    return;
  }
  const name = target.dataset.value;
  count += 1;
  if (anime === name) {
    good += 1;
    streak += 1;
    if (streak > record) {
      record = streak;
      window.localStorage.setItem("record",streak);
    }
  } else {
    streak = 0;
  }
  onYouTubeIframeAPIReady();
};

const shuffleArray = (unshuffled) => {
  return unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};


const scriptYT = document.createElement('script');
scriptYT.src = "https://www.youtube.com/player_api";
const firstScriptTag = document.querySelectorAll('script')[0];
firstScriptTag.parentNode.insertBefore(scriptYT, firstScriptTag);  


