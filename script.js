const fileInput = document.getElementById("fileInput");
const pickBtn = document.getElementById("pickBtn");
const dropZone = document.getElementById("dropZone");
const playlist = document.getElementById("playlist");
const player = document.getElementById("player");
const errorBox = document.getElementById("errorBox");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const tracks = [];
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
    playBtn(currentIndex - 1);
});
 
nextBtn.addEventListener("click", function () {
    if (currentIndex == -1) return;
    const listCount = document.querySelectorAll("#playlist li").length;

    if (currentIndex >= listCount - 1) {
        currentIndex = -1;
    }
    playBtn(currentIndex + 1);
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

        const button = document.createElement("button");
        button.textContent = "▶";
        button.className = "play";
        button.addEventListener("click", () => playBtn(index)); 

        li.appendChild(button);
        playlist.appendChild(li);
    });
};

function playBtn(index) {
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
    document.querySelectorAll("#playlist li").forEach(li => {
        li.classList.remove("selected");
    });

    const li = document.querySelector(`li[data-index="${index}"]`);
    if (li) li.classList.add("selected");
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
