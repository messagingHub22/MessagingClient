const popupBox = document.querySelector("#popupBox");
const popupButton = document.querySelector("#popupButton");

popupButton.addEventListener("click", () => {
    setTimeout(() => {
        popupBox.style.visibility = 'visible';
    }, 150);
});

document.addEventListener("click", (e) => {
    const isClosest = e.target.closest("#popupBox");
    if (!isClosest) {
        popupBox.style.visibility = 'hidden';
    }
});