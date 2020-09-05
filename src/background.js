"use strict";
const net = require("net");
import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

import { PORT, PROCESS_NUMBER, VER_TIME } from "./constants";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1500,
    height: 750,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

let alive = new Array(PROCESS_NUMBER);
alive.fill(true);

function sendMessage(id, message) {
  var client = new net.Socket();
  client.connect(PORT + id, "127.0.0.1", function() {
    // console.log(`Connected to P(${id})`);
    client.write(message);
  });

  // client.on("data", function(data) {
  //   console.log("Received: " + data);
  //   client.destroy(); // kill client after server's response
  // });

  // client.on("close", function() {
  //   console.log("Connection closed");
  // });

  client.on("error", () => {
    console.log(`P(${id}) down`);
  });
}

function checkIfAlive(toId) {
  var client = new net.Socket();
  client.connect(PORT + toId, "127.0.0.1", function() {
    // console.log(`P(${toId}) is alive`);
    client.write("alive");
    if (!alive[toId]) {
      alive[toId] = true;
      notifyProcess(toId, 1);
    }
  });

  client.on("data", function(data) {
    let message = "" + data;
    let process = parseMessage(message);
    console.log(process);
    win.webContents.send("info", process);

    client.destroy(); // kill client after server's response
  });

  client.on("error", () => {
    console.log(`P(${toId}) down`);
    if (alive[toId]) {
      alive[toId] = false;
      notifyProcess(toId, 0);
      win.webContents.send("down", { id: toId });
    }
    return;
  });
}

function notifyProcess(id, up) {
  let message;
  if (up) {
    message = "up," + id;
  } else {
    message = "down," + id;
  }
  for (let i = 0; i < PROCESS_NUMBER; ++i) {
    if (alive[i]) {
      sendMessage(i, message);
    }
  }
}

setInterval(() => {
  for (let i = 0; i < PROCESS_NUMBER; ++i) {
    checkIfAlive(i);
  }
  // console.log(alive);
}, VER_TIME);

function parseMessage(message) {
  // console.log(message);
  let messArray = message.split(/:/);
  // console.log(messArray);
  let process = {
    id: null,
    clock: null,
    state: true,
    insideCritical: null,
    waiting: [],
    deferred: [],
  };

  for (let i = 0; i < messArray.length; i++) {
    const element = messArray[i].split(/,/);
    if (element.length == 2) {
      process[element[0]] = parseInt(element[1]);
    } else {
      for (let j = 1; j < element.length; j++) {
        const insideElement = element[j];
        process[element[0]].push(parseInt(insideElement) ? true : false);
      }
    }
  }
  return process;
}
