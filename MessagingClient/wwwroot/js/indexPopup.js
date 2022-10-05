const popupQuerySelector = "#myPopup";
const popupEl = document.querySelector(popupQuerySelector);
const popupBttn = document.querySelector("#button");
popupBttn.addEventListener("click", () => {
    setTimeout(() => {
        if (!popupEl.classList.contains("show")) {
            popupEl.classList.add("show");
        }
    }, 250);
});

document.addEventListener("click", (e) => {
    const isClosest = e.target.closest(popupQuerySelector);
    if (!isClosest && popupEl.classList.contains("show")) {
        popupEl.classList.remove("show");
    }
});