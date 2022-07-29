const { app, BrowserWindow, Menu, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");

const { createWindow } = require("./helpers/windowManager");
const { createBaseMenuTemplate } = require("./helpers/menu");

const isDev =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev";
const isMac = process.platform === "darwin";

let mainWindow;
let aboutWindow;

const createMenuTemplate = () => {
  const template = [
    ...createBaseMenuTemplate(isMac),
    {
      label: "About Us",
      click: () => {
        createAboutWindow();
      },
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  return menu;
};

const createMainWindow = () => {
  mainWindow = createWindow("My Electron App");

  Menu.setApplicationMenu(createMenuTemplate());

  if (isDev) {
    mainWindow.loadURL(process.env.REACT_APP_URL_ENV);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(`${path.join(__dirname, "../build/index.html")}`);
  }

  let waitTime = 30 * 1000; // 30 seconds
  if (!isDev) {
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, waitTime);
  }
};

const createAboutWindow = () => {
  aboutWindow = createWindow("About", 500, 300);

  if (isDev) {
    aboutWindow.loadURL(process.env.REACT_APP_URL_ENV + "#/about");
    aboutWindow.webContents.openDevTools();
  } else {
    aboutWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "../build/index.html"),
        protocol: "file",
        hash: "/about",
        slashes: true,
      })
    );
  }
};

app
  .whenReady()
  .then(() => {
    autoUpdater.checkForUpdates();
    createMainWindow();
  })
  .catch((err) => console.error(err));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Ok"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail: "A new version is being downloaded.",
  };
  dialog.showMessageBox(dialogOpts, (response) => {});
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "A new version has been downloaded. Restart the application to apply the updates.",
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});
