const fileInput = document.getElementById("fileInput");
const pickBtn = document.getElementById("pickBtn");
const dropZone = document.getElementById("dropZone");
const playlist = document.getElementById("playlist");
const player = document.getElementById("player");
const errorBox = document.getElementById("errorBox");
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


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

function addFile(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith("audio/")) {
            //console.log(file.name);
            const track = {
                name: file.name,
                src: URL.createObjectURL(file),
                size: file.size
            };
            tracks.push(track);
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
        li.textContent = track.name;
        li.dataset.index = index;

        const button = document.createElement("button");
        button.textContent = "▶";
        button.className = "play";
        button.addEventListener("click", () => playBtnClicked(track, index));

        li.appendChild(button);
        playlist.appendChild(li);

    });
};

function playBtnClicked(track, index) {
    if (currentIndex === index && !player.paused) {
        player.pause();
    } else {
        if (currentIndex !== index) {
            player.src = track.src;
            currentIndex = index;
        };
        player.play();
    };
};

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

dropZone.addEventListener("dragenter", function (e) {
    e.preventDefault();
    e.stopPropagation();
    //console.log("dragenter");

});
dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    //console.log("dragover");


});
dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    //console.log("drop");

    let dropedFiles = e.dataTransfer.files;
    //console.log(dropedFiles);
    addFile(dropedFiles);

});
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
