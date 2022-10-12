const appearanceSelector = document.getElementsByClassName("appearanceSelector")[0];
const settingsSelector = document.getElementsByClassName("settingsSelector")[0];

const appearanceContainer = document.getElementsByClassName("appearanceContainer")[0];
const settingsContainer = document.getElementsByClassName("settingsContainer")[0];


appearanceSelector.style.backgroundColor = "#464646"
appearanceSelector.addEventListener("click", () => {
    appearanceSelector.style.backgroundColor = "#464646"
    settingsSelector.style.removeProperty("background-color")
    appearanceContainer.style.display =  "flex";
    settingsContainer.style.display =  "none";
});

settingsSelector.addEventListener("click", () => {
    settingsSelector.style.backgroundColor = "#464646"
    appearanceSelector.style.removeProperty("background-color")
    settingsContainer.style.display =  "flex";
    appearanceContainer.style.display =  "none";
});

const popupLocationSelector = document.getElementById("locationSelect");
const popupSizeInput = document.getElementById("sizeInput");
const popupDurationInput = document.getElementById("durationInput");
const popupTextColorInput = document.getElementById("textColorInput");
const popupBackgroundColorInput = document.getElementById("backgroundColorInput");
window.electronAPI.setPopupLocation(popupLocationSelector.value);
window.electronAPI.setPopupSize(popupSizeInput.value);
window.electronAPI.setPopupDuration(popupDurationInput.value);
window.electronAPI.setPopupTextColor(popupTextColorInput.value);
window.electronAPI.setPopupBackgroundColor(popupBackgroundColorInput.value);


popupLocationSelector.addEventListener("change", (e) => {
    console.log(e.target.value);
    window.electronAPI.setPopupLocation(e.target.value);
})

popupSizeInput.addEventListener("change", (e) => {
    console.log(e.target.value);
    window.electronAPI.setPopupSize(e.target.value);
})

popupDurationInput.addEventListener("change", (e) => {
    console.log(e.target.value);
    window.electronAPI.setPopupDuration(e.target.value);
})

popupTextColorInput.addEventListener("change", (e) => {
    console.log(e.target.value);
    window.electronAPI.setPopupTextColor(e.target.value);
})

popupBackgroundColorInput.addEventListener("change", (e) => {
    console.log(e.target.value);
    window.electronAPI.setPopupBackgroundColor(e.target.value);
})