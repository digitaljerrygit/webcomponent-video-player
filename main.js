customElements.define(
  "video-card",
  class extends HTMLElement {
    constructor() {
      super();
      let template = document.getElementById("video-card");
      let templateContent = template.content;

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(templateContent.cloneNode(true));

      this.addEventListener("click", (e) => {
        console.log(e.target.closest("video-card"));
        const vidURL = `https://player.vimeo.com/video/${
          e.target.closest("video-card").dataset.id
        }`;
        document
          .querySelector("#video-player iframe")
          .setAttribute("src", vidURL);
      });
    }
  }
);

class VideoManager {
  constructor() {
    this.listeners = [];
    this.getPlaylist();
  }

  getPlaylist() {
    fetch("https://vimeo.com/api/v2/channel/animation/videos.json")
      .then((data) => data.json())
      .then((data) => {
        this.list = data;
        this.updateListeners(data);
      });
  }

  addListener(func) {
    this.listeners.push(func);
  }

  removeListener(func) {
    this.listeners = this.listeners.filter((listener) => listener !== func);
  }

  updateListeners(data) {
    this.listeners.forEach((listener) => listener(data));
  }
}

function renderPlaylist(data) {
  data.forEach((video) => {
    const { title, thumbnail_medium, id } = video;
    const playlist = document.querySelector("#video-playlist");
    const videoCard = document.createElement("video-card");
    const thumbnail = document.createElement("img");
    const videoTitle = document.createElement("span");

    videoCard.setAttribute("data-id", id);
    thumbnail.setAttribute("src", thumbnail_medium);
    thumbnail.setAttribute("slot", "thumbnail");
    videoTitle.setAttribute("slot", "movie-title");
    videoTitle.textContent = title;

    playlist.appendChild(videoCard);
    videoCard.appendChild(thumbnail);
    videoCard.appendChild(videoTitle);
  });
}

const videoManager = new VideoManager();
videoManager.addListener(renderPlaylist);
videoManager.addListener(renderPlayer);

function renderPlayer(data) {
  const vidURL = `https://player.vimeo.com/video/${data[0].id}`;
  document.querySelector("#video-player iframe").setAttribute("src", vidURL);
}
