import { songs } from "./songs.js";

const songTitle = document.querySelector(".info h3");
const artistTitle = document.querySelector(".info p");
const currentTime = document.querySelector(".currentTime")
const songDuration = document.querySelector(".duration");
const discImage = document.querySelector(".disc");
const progressBar = document.querySelector(".progress");
const controls = document.querySelectorAll(".controls > i");

const newSong = new Audio;
newSong.volume = "0.05"

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
      currentSong = songs.length - 1
   }else if(currentSong > 0) {
      currentSong--
   }
   showInfo(currentSong)

   if (songPlaying) {
      newSong.play()
   }
}

function nextSong() {
   if (currentSong === songs.length - 1) {
      currentSong = 0
   }else if(currentSong < songs.length - 1) {
      currentSong++
   }
   showInfo(currentSong)

   if (songPlaying) {
      newSong.play()
   }
}

function playPauseSong() {
   if (!songPlaying) {
      songPlaying = true
      discImage.classList.add("playing")
      controls[1].classList.remove("fa-play")
      controls[1].classList.toggle("fa-pause", songPlaying)
      newSong.play()
      updateSongTime()
   }else {
      songPlaying = false
      newSong.pause()
      controls[1].classList.add("fa-play")
      discImage.classList.remove("playing")
   }
   console.log(newSong.duration);
   console.log(newSong.currentTime);
}

const barWidth = progressBar.parentElement.scrollWidth
let progressWidth;

function updateSongTime() {
   newSong.addEventListener('timeupdate', () => {
      newSong.addEventListener("ended", () => {
         if (newSong.currentTime === newSong.duration) {
            if (currentSong === songs.length - 1) {
               currentSong = -1
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

const volumeBar = document.querySelector(".volume-controls input");
const volumeButton = document.querySelector(".volume-controls .fa-volume-high");

volumeButton.addEventListener("click", () => {
   newSong.volume = 0
   volumeButton.classList.toggle("fa-volume-xmark")
   initializeVolume()
})

function unMute() {
   if (newSong.volume > 0.02) {
      volumeButton.classList.remove("fa-volume-xmark")
   }
}

volumeBar.addEventListener("click", () => {
   unMute()
})

volumeBar.addEventListener("input", () => {
   if (newSong.volume == 0.02) {
      volumeButton.classList.add("fa-volume-xmark")
   }
   unMute()
   newSong.volume = volumeBar.value / 100
   initializeVolume()
})

function initializeVolume() {
   const widthBar = newSong.volume * 100
   volumeBar.value = widthBar
   volumeBar.style.background = `linear-gradient(to right, #10A351 ${widthBar}%, #ffffffa9 0%)`;
}
initializeVolume()