// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    // sendMessage: () => ipcRenderer.send('sendMessage'),
    // showPopup: () => ipcRenderer.send('showPopup'),
    // log: () => ipcRenderer.send('log'),
    // listenToLogs: (callback) => {
    //     ipcRenderer.on('logReply', (event, arg) => {
    //         callback(arg);
    //     })
    // }
    setColorOne: (color) => ipcRenderer.send("set-color-one", color),
    setColorTwo: (color) => ipcRenderer.send("set-color-two", color),
    setColorThree: (color) => ipcRenderer.send("set-color-three", color),
    setKeyboardEffect: (effect) => ipcRenderer.send("set-keyboard-effect", effect),
    setEffectSpeed: (speed) => ipcRenderer.send("set-effect-speed", speed),
    setReactivity: (reactivity) =>  ipcRenderer.send("set-reactivity", reactivity),
    setPopupLocation: (location) => ipcRenderer.send("set-popup-location", location),
    setPopupSize: (size) => ipcRenderer.send("set-popup-size", size),
    setPopupDuration: (duration) => ipcRenderer.send("set-popup-duration", duration),
    setPopupTextColor: (color) => ipcRenderer.send("set-popup-text-color", color),
    setPopupBackgroundColor: (color) => ipcRenderer.send("set-popup-background-color", color)
})
