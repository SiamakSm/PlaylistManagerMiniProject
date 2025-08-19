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


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

function addFile(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith("audio/")) {
            const exists = tracks.some(track => track.name === file.name);
            if (!exists) {
                const track = {
                    name: file.name,
                    src: URL.createObjectURL(file),
                    size: file.size
                };
                tracks.push(track);
            };
        } else {
            errorBox.innerHTML = `The file ${file.name} is a ${file.type}`;
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

        const playButton = document.createElement("playButton");
        playButton.textContent = "▶";
        playButton.className = "play";
        playButton.addEventListener("click", () => playMusic(index));

        const deleteButton = document.createElement("deleteButton");
        deleteButton.textContent = "✖";
        deleteButton.addEventListener("click", () => deleteMusic(track));

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
}

function deleteMusic(file) {
    const deletedIndex = tracks.findIndex(track => track.name === file.name);

    tracks = tracks.filter(track => track.name !== file.name);

    if (deletedIndex === currentIndex) {
        player.pause();
        player.src = "";
        currentIndex = -1;
    } else if (deletedIndex < currentIndex) {
        currentIndex--;
    };

    renderPlaylist(tracks);
    highlight(currentIndex);
}


function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

};
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
