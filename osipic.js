console.log(Cropper);



const imageInput = document.getElementById("imageInput");
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("resetButton");
const generateButton = document.getElementById("generateButton");
const canvas = document.getElementById("resultCanvas");
const ctx = canvas.getContext("2d");
const saveButton = document.getElementById("saveButton");

const cropModal =
    document.getElementById("cropModal");
const cropImage =
    document.getElementById("cropImage");
const cropButton =
    document.getElementById("cropButton");
let cropper;

const CELL_SIZE = 200;

canvas.width = CELL_SIZE * 3;
canvas.height = CELL_SIZE * 3;

let images = [];
let generated = false;

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    if (images.length >= 9) {
        alert("画像は9枚までです");
        return;
    }

    const imageUrl = URL.createObjectURL(file);
    cropImage.src = imageUrl;
    cropModal.style.display = "block";

    imageInput.value = "";
});

function updatePreview() {

    cells.forEach(cell => {
        cell.innerHTML = "";
    });

    images.forEach((imageUrl, index) => {
        const img = document.createElement("img");
        img.src = imageUrl;
        cells[index].appendChild(img);
    });
}

generateButton.addEventListener("click", function () {

    // 背景を白で塗る
    ctx.fillStyle = "white";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    images.forEach((imageUrl, index) => {

        const img = new Image();

        img.onload = function () {
            const x =
                (index % 3) * CELL_SIZE;
            const y =
                Math.floor(index / 3) * CELL_SIZE;
            ctx.drawImage(
                img,
                x,
                y,
                CELL_SIZE,
                CELL_SIZE
            );
        };

        img.src = imageUrl;
    });

    generated = true;

});

saveButton.addEventListener("click", function () {

    if (!generated) {
        alert("先に実行ボタンを押してください");
        return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "oshi-pic.png";
    link.click();
});

resetButton.addEventListener("click", function () {

    images = [];
    generated = false;

    cells.forEach(cell => {
        cell.innerHTML = "";
    });

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
});

cropImage.onload = function() {

    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(
        cropImage,
        {
            aspectRatio: 1,
            viewMode: 1
        }
    );
};

cropButton.addEventListener(
    "click",
    function() {

        const canvas =
            cropper.getCroppedCanvas({
                width: 500,
                height: 500
            });

        const croppedImageUrl =
            canvas.toDataURL("image/png");

        images.push(croppedImageUrl);

        updatePreview();

        cropper.destroy();

        cropModal.style.display = "none";
    }
);