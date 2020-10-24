const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const startTime = document.getElementById('start-time');
const endTime = document.getElementById('end-time');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playBtn = document.getElementById('play');
const musicImg = document.querySelector('img');
const songTitle = document.getElementById('song-title');
const artist = document.getElementById('artist');

// create an array that contains the content of the info we need to change
const songs = [
    {
        fileName: 'jacinto-1',
        title: 'Electric Chill Machine',
        artist: 'Jacinto Design'
    },
    {
        fileName: 'jacinto-2',
        title: 'Seven Nation Army (Remix)',
        artist: 'Jacinto Design'
    },
    {
        fileName: 'jacinto-3',
        title: 'Goodnight, Disco Queen',
        artist: 'Jacinto Design'
    },
    {
        fileName: 'jacinto-4',
        title: 'Front Row (Remix)',
        artist: 'Metric/Jacinto Design'
    }
]

// set the default to false, so the music won't play until click the playBtn
let musicIsPlaying = false;

// when music is playing, the musicIsPlaying is true
function playMusic() {
    musicIsPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play(); 
}

// when music is not playing, the musicIsPlaying is false
function pauseMusic() {
    musicIsPlaying = false;
    playBtn.classList.replace('fa-pause','fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

// when musicisPlaying is true, when you click the playBtn, it will pauseMusic, vice versa
playBtn.addEventListener('click', ()=> 
    (musicIsPlaying ? pauseMusic() : playMusic())  
);


// first, set default songIndex to 0, and pass this to changeSongs function
let songIndex = 0;


// to play next song, we need to increase the songs index, and then changeSongs, and then play the song
// because we only have 4 songs at this moment, so when the songIndex is 4, it doesn't exit, and should be back to the first song, which the songIndex is 0
// so we use if statement to limit that
function playNextSong() {
    songIndex++;
    if( songIndex > songs.length -1){
        songIndex = 0
    }
    changeSongs(songs[songIndex]);
    playMusic();
}

function playPrevSong() {
    songIndex--;
    if(songIndex < 0){
        songIndex = songs.length -1;
    }
    changeSongs(songs[songIndex]);
    playMusic();
}

// create a function to change the music, musicImage, title and artist
function changeSongs(song) {
    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    musicImg.src = `img/${song.fileName}.jpg`;
    music.src = `music/${song.fileName}.mp3`;
}

nextBtn.addEventListener('click', playNextSong);
prevBtn.addEventListener('click', playPrevSong);


// remember to load the function by giving the index of the array for this function to load
changeSongs(songs[songIndex]);


// updateProgressBar: 
// step 1: update the progress width
// 1) when music is playing, console.log the music playing event, we get bunch of event property, and the useful information is 
// event - srcElement - currentTime and duration, and it's time to do some math
// 2) when we get the currentTime and duration of the audio, we use math to get progressPercentage and then give progress.width the number of the percentage by adding % at the end
// 3) then it will change the progress.width, the progress bar will keep showing up by the percentage
// step 2: update the endtime for each song
// 1) according to event.srcElement.duration, when it divide 60, it will get how many minutes of this song, and Math.floor(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor) is a way to 四捨五入
// 2) then we calculate the left seconds（121 % 60 = 1, 1為除不盡的數字), and give it 0 above use if statement
// 3) when we get the minutes and seconds, we combine that together to show up like 2: 06
// 4) BUT there will be a NaN problem, so we use if statement to avoid that, only show up the number when we have the endTime value, which means (if endTime is not a number, don't show up)
// step 3: same process for startTime
function updateProgressBar(event) {
    if(musicIsPlaying){
    // step 1
        const { currentTime, duration } = event.srcElement;
        const progressPercentage = (currentTime / duration) * 100;
        progress.style.width = `${progressPercentage}%`;
        // step 2
        const endTimeMinutes = Math.floor(duration / 60);
        let endTimeSeconds = Math.floor(duration % 60);
        if(endTimeSeconds < 10) {
            endTimeSeconds = `0${endTimeSeconds}`;
        }
        // delay switching duration element to avoid NaN problem
        if(endTimeSeconds) {
            endTime.textContent = `${endTimeMinutes}:${endTimeSeconds}`;
        }
        // step 3
        const startTimeMinutes = Math.floor(currentTime / 60);
        let startTimeSeconds = Math.floor(currentTime % 60);
        if(startTimeSeconds < 10) {
            startTimeSeconds = `0${startTimeSeconds}`;
        }
        // delay switching currentTime element to avoid NaN problem
        if(startTimeSeconds) {
            startTime.textContent = `${startTimeMinutes}:${startTimeSeconds}`;
        }
    }
}

// use 'timeupdate' event from audio to update the progress bar: https://www.w3schools.com/tags/ref_av_dom.asp
music.addEventListener('timeupdate', updateProgressBar);


// step 2: write changeStartTime function
// this = event.srcElement
// const totalProgressWidth = event.srcElement.clientWidth;
// calculate the progress percentage(currentProgressWidth / totalProgressWidth)
// pull duration from music, get the duration of the music
// progress percentage * duration(2:06) = current time of the music
// use audio method: currentTime to control the startTime to change to the current time of the music

function changeStartTime(event) {
    const totalProgressWidth = this.clientWidth;
    const currentProgressWidth = event.offsetX;
    const { duration } = music;
    music.currentTime = duration * (currentProgressWidth / totalProgressWidth);
}

// when click on the process bar, the startTime will change
// step 1: add eventListener to the progress-container
progressContainer.addEventListener('click', changeStartTime);
// ended is an event of audio, so when this song is ended, it will trigger the playNextSong function
music.addEventListener('ended', playNextSong);



