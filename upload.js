import { songs } from "./songs.js";

const uploadSong = document.querySelector(".uploadSongs > button");
const uploadDiv = document.querySelector(".uploadDetails");
const closeIcon = document.querySelector(".fa-xmark");
const inputs = document.querySelectorAll(".uploadDetails li input");
const songForm = document.querySelector(".uploadDetails form");
const successMessage = document.querySelector(".successMessage")

let songObject = {
  songName: "",
  artistName: "",
  duration: "",
  albumCover: "",
  songSrc: "",
};

uploadSong.addEventListener("click", () => {
  uploadDiv.style.display = "block";
  setTimeout(() => {
    uploadDiv.classList.add("selected");
  });
});

closeIcon.addEventListener("click", closeForm)

function closeForm() {
  setTimeout(() => {
    uploadDiv.style.display = "none";
  }, 800);
  uploadDiv.classList.remove("selected");
}

songForm.addEventListener("submit", (e) => {
  e.preventDefault();

  songs.push(uploadNewSong());
});

function uploadNewSong() {
  let { songName, artistName, duration } = { songObject };
  inputs.forEach((input, index) => {
    switch (index) {
      case 0:
        songName = input.value;
        break;
      case 1:
        artistName = input.value;
        break;
      case 2:
        duration = input.value;
        break;
      case 3:
        const file = input.files[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = function (event) {
            const imageURL = event.target.result;
            songObject.albumCover = `${imageURL}`;
          };
          reader.readAsDataURL(file);
        }
        break;
      case 4:
         const songFile = input.files[0];

         if (songFile) {
           const reader = new FileReader();
 
           reader.onload = function (event) {
             const songURL = event.target.result;
             songObject.songSrc = `${songURL}`;
           };
           reader.readAsDataURL(songFile);
         }
    }
     input.value = ""
     successMessage.classList.add("success")
     setTimeout(() => {
      successMessage.classList.remove("success")
     }, 4000)
     setTimeout(() => {
      closeForm()
     }, 2000)
  });

  songObject = {
    songName,
    artistName,
    duration
  };

  return songObject;
}