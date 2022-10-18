const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require("fs");
const express = require("express");
const server1 = express()
const server2 = express()
const server3 = express()
const convert = require("xml-js")
const os = require('os');
// const ipc = require('node-ipc');


//OS variables
const isMac = os.platform() === "darwin";
const isWindows = os.platform() === "win32";
const isLinux = os.platform() === "linux";
//Important  variables
let commandArray; //array command events
let selectArray; // arrray of select  events
let popupX;
let popupY;
let popupLocation;
let popupScale;
let popupDuration;
let popupTextColor;
let popupBackgroundColor;

//Photoshop stuff
getActionArray("invokeCommand").then((arr) => {
  // console.log(arr.length);
  commandArray = arr;
})
getActionArray("select").then((arr) => {
  // console.log(arr.length);
  selectArray = arr;
})

// Electron stuff
let screenX;
let screenY;
if (require('electron-squirrel-startup')) {
  app.quit();
}
let mainW;
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 270,
    height: 350,
    resizable: false,
    icon: "src/app-icon.png",
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setAlwaysOnTop(false);
  if (isMac) {
    mainW = mainWindow;
  }
  mainWindow.removeMenu();
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.webContents.openDevTools();
  screenX = screen.getPrimaryDisplay().size.width;
  screenY = screen.getPrimaryDisplay().size.height;
  // console.log(screenX, screenY);
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//Server for plugin
server1.listen(3001)
server1.post("/", (req, res) => {
  let data = ""
  req.on("data", (info) => {
    data += info;
  })
  req.on("end", () => {
    let obj = JSON.parse(data)
    console.log(obj);
    invokeShortcut(obj)
    res.end();
  })
})


app.whenReady().then(() => {
  ipcMain.on("set-popup-location", (e, location) => {
    setPopupLocation(location);
  })
  ipcMain.on("set-popup-size", (e, size) => {
    popupScale = size;
    console.log(popupScale);
  })
  ipcMain.on("set-popup-duration", (e, duration) => {
    popupDuration = duration;
  })
  ipcMain.on("set-popup-text-color", (e, textColor) => {
    popupTextColor = textColor;
    // console.log(popupTextColor);
  })
  ipcMain.on("set-popup-background-color", (e, color) => {
    popupBackgroundColor = color;
    // console.log(popupBackgroundColor);
  })
})


function invokeShortcut(obj) {
  // console.log(obj);
  if (obj.event == '"select"') {
    let tool = JSON.parse(obj.descriptor)._target[0]._ref;
    let select = selectArray.find(elem => elem.name == tool)
    let shortcutKey = select ? select.shortcutKey : undefined;
    // console.log(shortcutKey);
    showPopup(obj.event, shortcutKey)
  } else if (obj.event == '"invokeCommand"') {
    let command = JSON.parse(obj.descriptor).commandID;
    let shortcutKeys = commandArray.find(elem => elem.command == command).shortcutKeys;
    // shortcutKeys.map(elem => {console.log(elem);})
    showPopup(obj.event, shortcutKeys)
  }
}


function showPopup(type, shortcut) {

  if (type == '"select"' && shortcut) {
    const htmlContent = `<!DOCTYPE html><html>
    <head>
        <style>
            html, body{
              padding: 0;
              margin: 0; 
              height: 100%;
              width: 100%;
            }
            p{
              height: 90%;
              width: 90%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: ${hexToRGB(popupTextColor)};
              border-radius: 5%;
            }
            body{
              background-color: ${hexToRGB(popupBackgroundColor)};
              color: white;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-weight: bold;
              display: flex;
              justify-content: space-around;
              align-items: center;
            }
        </style>
    </head>
    <body>
        <p>${shortcut}</p>
    </body>
    </html>`;
    let popupSide = Math.round(100 * (popupScale / 100));
    let popup = new BrowserWindow({
      frame: false,
      width: popupSide,
      height: popupSide,
      resizable: false,
      show: false
    });
    popup.setPosition(popupX - Math.round(popupSide / 2), popupY - Math.round(popupSide / 2));
    popup.removeMenu();
    popup.loadURL(`data:text/html;charset=utf-8,${htmlContent}`);
    popup.once('ready-to-show', () => {
      popup.show();
    })
    if (isMac) {
      mainW.minimize();
    }
    setTimeout(() => {
      popup.close();
      popup = undefined;
    }, popupDuration * 1000)
  } else if (type == '"invokeCommand"' && shortcut) {
    console.log(shortcut);
    let keysHTML = "";
    shortcut.map(elem => {
      let res;
      if (elem == "shiftKey")
        res = "Shift";
      else if (elem == "commandKey")
        res = "Ctrl";
      else if (elem == "optionKey")
        res = "Alt";
      else
        res = elem;
      keysHTML += `<div style="width: 5%" ></div><p>${res}</p>`
    });
    keysHTML += `<div style="width: 5%" >`;
    const htmlContent = `<!DOCTYPE html><html>
    <head>
        <style>
            html, body{
              padding: 0;
              margin: 0; 
              height: 100%;
              width: 100%;
            }
            p{
              height: 90%;
              width: 90%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: ${hexToRGB(popupTextColor)};
              border-radius: 5%;
            }
            body{
                background-color: ${hexToRGB(popupBackgroundColor)};
                color: white;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                font-weight: bold;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
        </style>
    </head>
    <body>
        ${keysHTML}
    </body>
    </html>`;
    let popupWidth = Math.round(shortcut.length * 100 * (popupScale / 100));
    let popupHeight = Math.round(100 * (popupScale / 100));
    const popup = new BrowserWindow({
      frame: false,
      width: popupWidth,
      height: popupHeight,
      resizable: false,
      show: false
    });
    let offset = 0;
    if (popupLocation.includes("Center")) {
      offset = popupWidth / 2;
    } else if (popupLocation.includes("Right")) {
      offset = popupWidth;
    }
    // console.log(offset);
    popup.setPosition(popupX - offset, popupY - Math.round(popupHeight / 2));
    popup.removeMenu();
    popup.loadURL(`data:text/html;charset=utf-8,${htmlContent}`);
    popup.once('ready-to-show', () => {
      popup.show();
    })
    // console.log(htmlContent);
    setTimeout(() => {
      popup.close();
      popup = undefined;
    }, popupDuration * 1000)
    // popup.webContents.openDevTools();
  }

}

async function getActionArray(event) {
  if (event == "invokeCommand") {
    let data = require("../des.json")[0].originalData[0].menuBarInfo
    let res = [];
    function findCommands(result, obj) {
      for (let nested in obj) {
        if (Array.isArray(obj[nested])) {
          obj[nested].forEach(elem => {
            findCommands(result, elem)
          })
        } else {
          if (obj.hasOwnProperty("command")) {
            result.push({ ...obj })
            if (result[result.length - 1].hasOwnProperty("submenu")) {
              delete result[result.length - 1].submenu;
            }
          }
          if (obj.hasOwnProperty("submenu")) {
            findCommands(result, obj.submenu)
          }
        }
      }
    }
    findCommands(res, data)
    const uniqueIds = [];
    let unique = res.filter(element => {
      const isDuplicate = uniqueIds.includes(element.command);

      if (!isDuplicate && (element.menuShortcut.commandKey || element.menuShortcut.controlKey || element.menuShortcut.optionKey || element.menuShortcut.shiftKey)) {
        uniqueIds.push(element.command);

        return true;
      }
      return false;
    });
    unique = unique.map(item => {
      let keys = []
      for (key in item.menuShortcut) {
        if (item.menuShortcut[key]) {
          if (key == 'keyChar') {
            keys.push(item.menuShortcut[key]);
          } else {
            keys.push(key);
          }
        }
      }
      return {
        command: item.command,
        title: item.title,
        name: item.name,
        shortcutKeys: keys
      }
    })
    // console.log(unique);
    return unique;
  } else if (event == "select") {
    let res;
    // let txt = await fs.promises.readFile("C:\\Program Files\\Adobe\\Adobe Photoshop 2022\\Locales\\en_US\\Support Files\\Shortcuts\\Win\\Default Keyboard Shortcuts.kys", "utf8")
    let txt = await fs.promises.readFile("/Applications/Adobe Photoshop 2022/Locales/en_US/Support Files/Shortcuts/Mac/Default Keyboard Shortcuts.kys", "utf8")

    let resJSON = convert.xml2json(txt, { compact: true, spaces: 4 });
    res = await JSON.parse(resJSON)["photoshop-keyboard-shortcuts"]
    res = res.tool.filter(item => item._text)
      .map(item => {
        let resItem;
        switch (item._attributes.name) {
          case "Rectangular Marquee Tool":
            resItem = {
              name: "marqueeRectTool",
              shortcutKey: item._text
            }
            break;
          case "Elliptical Marquee Tool":
            resItem = {
              name: "marqueeEllipTool",
              shortcutKey: item._text
            }
            break;
          case "Polygonal Lasso Tool":
            resItem = {
              name: "polySelTool",
              shortcutKey: item._text
            }
            break;
          case "Object Selection Tool":
            resItem = {
              name: "magicLassoTool",
              shortcutKey: item._text
            }
            break;
          case "3D Material Eyedropper Tool":
            resItem = {
              name: "3DMaterialSelectTool",
              shortcutKey: item._text
            }
            break;
          case "Note Tool":
            resItem = {
              name: "textAnnotTool",
              shortcutKey: item._text
            }
            break;
          case "Slice Select Tool":
            resItem = {
              name: "sliceSelectTool",
              shortcutKey: item._text
            }
            break;
          case "Healing Brush Tool":
            resItem = {
              name: "magicStampTool",
              shortcutKey: item._text
            }
            break;
          case "Patch Tool":
            resItem = {
              name: "patchSelection",
              shortcutKey: item._text
            }
            break;
          case "Content-Aware Move Tool":
            resItem = {
              name: "recomposeSelection",
              shortcutKey: item._text
            }
            break;
          case "Brush Tool":
            resItem = {
              name: "paintbrushTool",
              shortcutKey: item._text
            }
            break;
          case "Color Replacement Tool":
            resItem = {
              name: "colorReplacementBrushTool",
              shortcutKey: item._text
            }
            break;
          case "Mixer Brush Tool":
            resItem = {
              name: "wetBrushTool",
              shortcutKey: item._text
            }
            break;
          case "Art History Brush Tool":
            resItem = {
              name: "artBrushTool",
              shortcutKey: item._text
            }
            break;
          case "Paint Bucket Tool":
            resItem = {
              name: "bucketTool",
              shortcutKey: item._text
            }
            break;
          case "Burn Tool":
            resItem = {
              name: "burnInTool",
              shortcutKey: item._text
            }
            break;
          case "Sponge Tool":
            resItem = {
              name: "saturationTool",
              shortcutKey: item._text
            }
            break;
          case "Horizontal Type Tool":
            resItem = {
              name: "typeCreateOrEditTool",
              shortcutKey: item._text
            }
            break;
          case "Vertical Type Tool":
            resItem = {
              name: "typeVerticalCreateOrEditTool",
              shortcutKey: item._text
            }
            break;
          case "Horizontal Type Mask Tool":
            resItem = {
              name: "typeCreateMaskTool",
              shortcutKey: item._text
            }
            break;
          case "Vertical Type Mask Tool":
            resItem = {
              name: "typeVerticalCreateMaskTool",
              shortcutKey: item._text
            }
            break;
          case "Path Selection Tool":
            resItem = {
              name: "pathComponentSelectTool",
              shortcutKey: item._text
            }
            break;
          case "Direct Selection Tool":
            resItem = {
              name: "directSelectTool",
              shortcutKey: item._text
            }
            break;
          case "Rotate View Tool":
            resItem = {
              name: "rotateTool",
              shortcutKey: item._text
            }
            break;
          case "Frame Tool":
            resItem = {
              name: "framedGroupTool",
              shortcutKey: item._text
            }
            break;
          default:
            resItem = {
              name: camelize(item._attributes.name),
              shortcutKey: item._text
            }
            break;
        }
        return resItem;
      })
    res.push({
      name: "curvaturePenTool",
      shortcutKey: "P"
    })
    res.push({
      name: "triangleTool",
      shortcutKey: "U"
    })
    // res.push({
      // name: "framedGroupTool",
      // shortcutKey: "K"
    // })
    return res;
  }
}

//util
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}
function setPopupLocation(location) {
  popupLocation = location;
  switch (location) {
    case "topLeft":
      popupX = Math.round(0.15 * screenY);
      popupY = Math.round(0.15 * screenY);
      break;
    case "topCenter":
      popupX = Math.round(0.5 * screenX);
      popupY = Math.round(0.15 * screenY);
      break;
    case "topRight":
      popupX = Math.round(screenX - 0.15 * screenY);
      popupY = Math.round(0.15 * screenY);
      break;
    case "middleLeft":
      popupX = Math.round(0.15 * screenY);
      popupY = Math.round(0.5 * screenY);
      break;
    case "middleCenter":
      popupX = Math.round(0.5 * screenX);
      popupY = Math.round(0.5 * screenY);
      break;
    case "middleRight":
      popupX = Math.round(screenX - 0.15 * screenY);
      popupY = Math.round(0.5 * screenY);
      break;
    case "bottomLeft":
      popupX = Math.round(0.15 * screenY);
      popupY = Math.round(0.85 * screenY);
      break;
    case "bottomCenter":
      popupX = Math.round(0.5 * screenX);
      popupY = Math.round(0.85 * screenY);
      break;
    case "bottomRight":
      popupX = Math.round(screenX - 0.15 * screenY);
      popupY = Math.round(0.85 * screenY);
      break;
  }
  // console.log(popupX, popupY);
}

function hexToRGB(h) {
  let r = 0, g = 0, b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return "rgb(" + +r + "," + +g + "," + +b + ")";
}