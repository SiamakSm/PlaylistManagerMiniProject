const fileInput = document.getElementById("fileInput");
const pickBtn = document.getElementById("pickBtn");
const dropZone = document.getElementById("dropZone");
const playlist = document.getElementById("playlist");
const player = document.getElementById("player");
const errorBox = document.getElementById("errorBox");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const volumeControl = document.getElementById("volumeControl");
const timeBox = document.getElementById("timeBox");
const progressBar = document.getElementById("progressBar");
const inputSearch = document.getElementById("inputSearch");
const searchBtn = document.getElementById("searchBtn");

let tracks = [];
let currentIndex = -1;

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

errorBox.textContent = "";

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


pickBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    addFile(e.target.files);
});

prevBtn.addEventListener("click", function () {
    if (currentIndex == -1) return;
    const listCount = document.querySelectorAll("#playlist li").length;

    if (currentIndex == 0) {
        currentIndex = listCount;
    }
    playMusic(currentIndex - 1);
});
 
nextBtn.addEventListener("click", function () {
    if (currentIndex == -1) return;

    if (currentIndex >= tracks.length - 1) {
        currentIndex = -1;
    };
    playMusic(currentIndex + 1);
});

player.addEventListener("ended", () => {
    nextBtn.click();
});

volumeControl.addEventListener("input", () => {
    player.volume = volumeControl.value;
});

player.addEventListener("timeupdate", () => {
    const current = player.currentTime;
    const duration = player.duration;

    if (!isNaN(duration)) {
        timeBox.textContent = formatTime(current) + " / " + formatTime(duration);
        progressBar.value = (current / duration) * 100;
    };
});

progressBar.addEventListener("input", function () {
    const duration = player.duration;
    if (!isNaN(duration)) {
        player.currentTime = (progressBar.value * duration) / 100;
    };
});

searchBtn.addEventListener("click", () => {
    const query = inputSearch.value.trim();
    api(query, 1);

});
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

function addFile(files) {
    Array.from(files).forEach(file => {
        try {
            if (!file.type.startsWith("audio/")) {
                throw new Error(`The file ${file.name} is a ${file.type}.`);
            };

            const exists = tracks.some(track => track.name === file.name);
            if (!exists) {
                const track = {
                    name: file.name,
                    src: URL.createObjectURL(file),
                    size: file.size
                };
                tracks.push(track);
            };

        } catch (err) {
            errorBox.innerHTML += `<br>${err.message}</br>`;
        };
    });

    renderPlaylist(tracks);
}

function renderPlaylist(tracks) {
    playlist.innerHTML = "";
    tracks.forEach((track, index) => {

        const li = document.createElement("li");
        li.textContent = ` ` + track.name;
        li.dataset.index = index;


        const playButton = document.createElement("button");
        playButton.textContent = "▶";
        playButton.className = "play";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "✖";
        deleteButton.className = "delete";

        const starButton = document.createElement("span");
        starButton.textContent = "☆";
        starButton.className = "favorite";

        const infoButton = document.createElement("button");
        infoButton.textContent = "ℹ";
        infoButton.className = "info";


        li.appendChild(infoButton);
        li.appendChild(starButton);
        li.appendChild(deleteButton);
        li.appendChild(playButton);
        playlist.appendChild(li);
    });
};

function playMusic(index) {
    if (currentIndex === index && !player.paused) {
        player.pause();
    } else {
        if (currentIndex !== index) {
            player.src = tracks[index].src;
            currentIndex = index;
        };
        player.play();
    };
    highlight(index);
}; 

function highlight(index) {
    if (index === -1) return;

    document.querySelectorAll("#playlist li").forEach(li => {
        li.classList.remove("selected");
    });

    const li = document.querySelector(`li[data-index="${index}"]`);
    if (li) li.classList.add("selected");
};

function deleteMusic(file) {
    const deletedIndex = tracks.findIndex(track => track.name === file.name);

    tracks = tracks.filter(track => track.name !== file.name);

    if (deletedIndex === currentIndex) {
        player.pause();
        player.src = "";
        currentIndex = -1;
        errorBox.innerHTML = ""; 
    } else if (deletedIndex < currentIndex) {
        currentIndex--;
    };

    renderPlaylist(tracks);
    highlight(currentIndex);
};

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

};

function showInfos(texte, size = "less than 7") {
    errorBox.innerHTML = `${texte} ${this.name}, Size: ${size} MegaBytes.`;
};

function addApiTrack(track) {
    const newTrack = {
        name: `${track.title} - ${track.artist.name}`,
        src: track.preview,
        size: "Not Defined"
    };
    tracks.push(newTrack);
    renderPlaylist(tracks);
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
dropZone.addEventListener("dragenter", function (e) {
    e.preventDefault();
    e.stopPropagation();
});
dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
});
dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();

    let dropedFiles = e.dataTransfer.files;
    addFile(dropedFiles);

});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

playlist.addEventListener("click", (event) => {
    if (event.target.classList.contains("favorite")) {
        event.target.textContent = event.target.textContent === "☆" ? "⭐" : "☆";
    };

    if (event.target.textContent === ("✖")) {
        alert(`${event.target.closest("li").textContent} is deleted.`);
    };

    if (event.target.classList.contains("play")) {
        const index = parseInt(event.target.closest("li").dataset.index);
        playMusic(index);
    };

    if (event.target.classList.contains("delete")) {
        const index = parseInt(event.target.closest("li").dataset.index);
        deleteMusic(tracks[index]);
    };

    if (event.target.textContent === ("ℹ")) {
        const index = parseInt(event.target.closest("li").dataset.index);
        const size = tracks[index].size;
        if (size > 7000000) {
            showInfos.apply(tracks[index], ["Now Playing:", (tracks[index].size / 1000000).toFixed(2)]);
        } else {
            showInfos.call(tracks[index], "Now Playing:");
        };
    };
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

async function api(query, n) {
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(query)}&limit=${n}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
            "x-rapidapi-key": "8ebe86b2c0mshe3d9c33bec9d169p183fcejsnb1d4b746f339"
        }
    });

    const data = await res.json();
    data.data.forEach(track => {
        console.log(track);
        addApiTrack(track);
    });
}













/*
Numéro de réseau : 50107
Fréquence d'installation : 258000
*/