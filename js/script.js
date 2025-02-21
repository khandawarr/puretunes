let currentSong = new Audio();
let nasheeds;
let currFolder;

// Function to convert seconds to mm:ss format
function convertSecondsToTime(seconds) {
    // Ensure seconds is a valid number, and use Math.floor to remove fractions
    seconds = isNaN(seconds) ? 0 : Math.floor(seconds);

    let minutes = Math.floor(seconds / 60);  // Get minutes
    let remainingSeconds = seconds % 60;    // Get remaining seconds

    // Format the minutes and seconds with leading zeros if necessary using padStart
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}


async function getNasheeds(Folder) {
    currFolder = Folder
    let a = await fetch(`http://127.0.0.1:5500/${Folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let nasheeds = [];

    // Loop through all the <a> tags and extract valid audio file paths
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        let href = element.href;

        // Check if the file is an audio file and ends with .mp3 or .mpeg
        if (href.endsWith(".mp3") || href.endsWith(".mpeg")) {
            // Remove unnecessary parts of the file name (e.g., ' - Copy.mpeg' or extra spaces)
            let cleanHref = href.split(`/${Folder}/`)[1];  // Remove the base path part
            cleanHref = cleanHref.replace(/ - Copy\.mpeg/g, "");  // Remove " - Copy.mpeg"
            cleanHref = cleanHref.replace(/ /g, "%20"); // Replace spaces with %20 for URL encoding

            nasheeds.push(cleanHref);  // Add cleaned href to the array
        }
    }
    return nasheeds;
}


const playNasheed = (track, pause=false) => {
    // let audio = new Audio("/nasheeds/" + sanitizedTrack);
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function main() {
    nasheeds = await getNasheeds("nasheeds/ncs")
    playNasheed(nasheeds[0], true)

    
    // Show all the nasheeds
    let nasheedUl = document.querySelector(".nasheedList").getElementsByTagName("ul")[0];

    for (const nasheed of nasheeds) {

        // Insert sanitized track into the list
        nasheedUl.innerHTML = nasheedUl.innerHTML + `
            <li>
                <img class="music invert" src="img/music.svg" alt="">
                <div class="info">
                    <div> ${nasheed.replaceAll("%20", " ")}</div> <!-- Display the name with spaces -->
                    <div> Dawar </div>
                </div>
                <div class="playnow">
                    <div class="play-now">Play now</div>
                    <img class="playsvg invert" src="img/play.svg" alt="">
                </div>
            </li>
        `;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".nasheedList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let trackName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            console.log("Now playing:", trackName);

            // Play the sanitized version of the track
            playNasheed(trackName);
        });
    });

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
