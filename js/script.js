let currentSong = new Audio();
let nasheeds;
let currFolder;

function convertSecondsToTime(seconds) {
    seconds = isNaN(seconds) ? 0 : Math.floor(seconds);
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getNasheeds(folder) {
    currFolder = folder;
    try {
        const response = await fetch(`/${folder}/list.json`);
        nasheeds = await response.json();
        return nasheeds;
    } catch (error) {
        console.error('Error loading nasheeds:', error);
        return [];
    }
}

const playNasheed = (track, pause = false) => {
    currentSong.src = `/${currFolder}/${encodeURIComponent(track)}`;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};


async function main() {
    nasheeds = await getNasheeds("nasheeds/ncs");
    if (nasheeds.length > 0) {
        playNasheed(nasheeds[0], true);
    }

    let nasheedUl = document.querySelector(".nasheedList ul");
    nasheedUl.innerHTML = ""; // Clear existing content

    nasheeds.forEach(nasheed => {
        nasheedUl.innerHTML += `
            <li>
                <img class="music invert" src="img/music.svg" alt="">
                <div class="info">
                    <div>${nasheed.replace(/\.[^/.]+$/, "")}</div>
                    <div>Dawar</div>
                </div>
                <div class="playnow">
                    <div class="play-now">Play now</div>
                    <img class="playsvg invert" src="img/play.svg" alt="">
                </div>
            </li>`;
    });

    // Inside main() after generating list items:
function handleSongSelection(e) {
    e.preventDefault(); // Prevent default touch behavior
    const listItem = e.target.closest("li");
    if (!listItem) return;

    // Get index of clicked item
    const index = Array.from(nasheedUl.children).indexOf(listItem);
    if (index >= 0) {
        currentSong.pause();
        playNasheed(nasheeds[index]);
        // Mobile browsers require explicit user-triggered play()
        currentSong.play().catch(error => console.log("Playback failed:", error));
    }
}

// Add both event listeners
nasheedUl.addEventListener("click", handleSongSelection);
nasheedUl.addEventListener("touchstart", handleSongSelection); // Mobile-specific

    //Attach an event listener to prev, play & next

    play.addEventListener("click", ()=>{
        if (currentSong.paused) {
            currentSong.play()
             play.src = "img/pause.svg"
           
        } else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //Add event listener to update time 
    currentSong.addEventListener("timeupdate", () => {
        // Ensure currentTime and duration are valid numbers
        if (!isNaN(currentSong.currentTime) && !isNaN(currentSong.duration)) {
            // Format and display the time as "mm:ss / mm:ss"
            document.querySelector(".songtime").innerHTML = `${convertSecondsToTime(currentSong.currentTime)}/${convertSecondsToTime(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%"
        }
    });

    //add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // Get the width of the seekbar and the position of the click
        let percent = (e.offsetX / e.target.offsetWidth) * 100;
        
        // Move the circle to the clicked position
        document.querySelector(".circle").style.left = percent + "%";
    
        // Set the current song's time based on the percentage
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
    
    //add event listener to hamburger 

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

     //add event listener to close

     document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-110%"
    })

    // Add event listener to the previous button
previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("previous clicked");
    console.log(currentSong);

    // Extract the current song's filename
    let currentSongName = currentSong.src.split("/").pop(); // get the filename from the URL

    // Find the index of the current song in the nasheeds array
    let index = nasheeds.indexOf(currentSongName);

    // Play the previous song if the index is valid
    if (index > 0) {
        playNasheed(nasheeds[index - 1]);
    }
});

// Add event listener to the next button
next.addEventListener("click", () => {
    currentSong.pause();
    console.log("next clicked");
    console.log(currentSong);

    // Extract the current song's filename
    let currentSongName = currentSong.src.split("/").pop(); // get the filename from the URL

    // Find the index of the current song in the nasheeds array
    let index = nasheeds.indexOf(currentSongName);

    // Play the next song if the index is valid
    if (index < nasheeds.length - 1) {
        playNasheed(nasheeds[index + 1]);
    }
});

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("settng volume to",e.target.value ,"/100");
        currentSong.volume = parseInt(e.target.value)/100 ;
        
    })

}

main();
