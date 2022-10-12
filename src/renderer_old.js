
// CONTAINERS
const mainMenuContainer = document.getElementsByClassName("mainMenuContainer")[0]
const personalizationContainer = document.getElementsByClassName("personalizationContainer")[0]
const settingsContainer = document.getElementsByClassName("settingsContainer")[0]
//TODO - statistics

//MAIN MENU
const personalizationMenuButton = document.getElementsByClassName("mainMenuButton")[0]
const settingsMenuButton = document.getElementsByClassName("mainMenuButton")[1]
const statisticsMenuButton = document.getElementsByClassName("mainMenuButton")[2]

//HOME BUTTON
const homeButton = document.getElementsByClassName("homeButton")[0];
render(0);

const logButton = document.getElementsByClassName("logButton")[0];
logButton.addEventListener("click", ()=>{
    window.electronAPI.log();
})
window.electronAPI.listenToLogs(console.log);

//LISTENERS
homeButton.addEventListener("click", ()=>{
    render(0)
})
personalizationMenuButton.addEventListener("click", ()=>{
    // console.log(1);
    render(1)
})
settingsMenuButton.addEventListener("click", ()=>{
    // console.log(1);
    render(2)
})
statisticsMenuButton.addEventListener("click", ()=>{
    // console.log(1);
    render(3)
})







//RENDERING
function render(menuNum) {
    switch (menuNum) {
        case 0:
            mainMenuContainer.style.display = "flex";
            personalizationContainer.style.display = "none";
            settingsContainer.style.display = "none";
            break;
        case 1:
            mainMenuContainer.style.display = "none";
            personalizationContainer.style.display = "flex";
            settingsContainer.style.display = "none";
            break;
        case 2:
            mainMenuContainer.style.display = "none";
            personalizationContainer.style.display = "none";
            settingsContainer.style.display = "flex";
            break;
    }
}



