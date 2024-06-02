import { songs } from "./songs.js";

const songTitle = document.querySelector(".info h3");
const artistTitle = document.querySelector(".info p");
const currentTime = document.querySelector(".currentTime")
const songDuration = document.querySelector(".duration");
const discImage = document.querySelector(".disc");
const progressBar = document.querySelector(".progress");
const controls = document.querySelectorAll(".controls i");

const newSong = new Audio;

let currentSong = 0
let songPlaying = false

function showInfo(songIndex = 0) {
   const [{ songName, artistName, duration, albumCover, songSrc }] = [songs[songIndex]]
   
   songTitle.textContent = songName
   artistTitle.textContent = artistName
   currentTime.textContent = "0:00"
   songDuration.textContent = duration
   discImage.style.background = `url(${albumCover}) no-repeat`
   discImage.style.backgroundSize = "cover"
   newSong.src = songSrc
   newSong.volume = "0.15"
}
showInfo()

controls.forEach((button, index) => {
   button.addEventListener("click", () => {
      switch (index) {
         case 0:
            prevSong()
            break;
         case 1:
            playPauseSong()
            break;
         case 2:
            nextSong()
      }
   })
})

function prevSong() {
   if (currentSong === 0) {
      return
   }else if(currentSong > 0) {
      currentSong--
      showInfo(currentSong)
   }

   if (songPlaying) {
      newSong.play()
   }
}

function nextSong() {
   if (currentSong === songs.length - 1) {
      return
   }else if(currentSong < songs.length - 1) {
      currentSong++
      showInfo(currentSong)
   }

   if (songPlaying) {
      newSong.play()
   }
}

function playPauseSong() {
   if (controls[1].classList.contains("fa-pause")) {
      songPlaying = false
      discImage.classList.remove("playing")
      controls[1].classList.add("fa-play")
      controls[1].classList.remove("fa-pause")
      newSong.pause()
      return
   }
   
   if (!songPlaying) {
      songPlaying = true
      discImage.classList.add("playing")
      newSong.play()
      controls[1].classList.remove("fa-play")
      controls[1].classList.add("fa-pause")
      updateSongTime()
   }
}

const barWidth = progressBar.parentElement.scrollWidth
let progressWidth;

function updateSongTime() {
   newSong.addEventListener('timeupdate', () => {
      newSong.addEventListener("ended", () => {
         if (newSong.currentTime === newSong.duration) {
            if (currentSong === songs.length - 1) {
               currentSong = -1
               console.log(currentSong);
               return
            }
            currentSong++
            showInfo(currentSong)
            newSong.play()
            return
         }
      })

      const pixelRate = barWidth / newSong.duration
      progressWidth = Math.floor(newSong.currentTime * pixelRate)
      progressBar.style.width = `${progressWidth}px`
   
      let minutes = Math.floor(newSong.currentTime / 60);
      let seconds = Math.floor(newSong.currentTime % 60);
   
      currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
   });
}

progressBar.parentElement.addEventListener("click", (e) => {
   const progressRect = progressBar.getBoundingClientRect()
   const mouseX = e.clientX
   const result = mouseX - progressRect.left
   const progressBarWidth = progressBar.parentElement.scrollWidth
   const progressPercentage = (result / progressBarWidth) * 100;
   const newTime = (progressPercentage / 100) * newSong.duration;

   progressWidth = result
   progressBar.style.width = `${progressPercentage}%`
   newSong.currentTime = newTime
   updateSongTime()
})