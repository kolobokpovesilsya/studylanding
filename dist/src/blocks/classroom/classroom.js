const playBtn = document.getElementById("classroom-play");
const video = document.querySelector(".classroom__video video");
function togglePlay(e) {
  if (video.paused) {
    video.play();
    playBtn.style.opacity = "0";
    setTimeout(() => {
      playBtn.style.display = "none";
    }, 300);
  } else {
    video.pause();
    playBtn.style.display = "block";
    playBtn.style.opacity = "1";
  }
}
function initClassroom() {
  playBtn.onclick = togglePlay;
  video.onclick = togglePlay;
  video.addEventListener("ended", () => {
    playBtn.style.display = "flex";
    playBtn.style.opacity = "1";
    video.currentTime = 0;
  });
}
export {
  initClassroom as i
};
