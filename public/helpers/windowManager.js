const { BrowserWindow } = require("electron");

const createWindow = (title, width = 1000, height = 700) => {
  return new BrowserWindow({
    width,
    height,
    resizable: true,
    maximizable: false,
    title,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
};

module.exports = {
  createWindow,
};
