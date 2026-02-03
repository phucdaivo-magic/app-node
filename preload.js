const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    pickFolder: () => ipcRenderer.invoke('pick-folder'),
    pickScss: () => ipcRenderer.invoke('pick-scss'),
    pickJs: () => ipcRenderer.invoke('pick-js'),
    pickOutput: () => ipcRenderer.invoke('pick-output'),
    startWatch: (scss, js, out, folder) =>
        ipcRenderer.invoke('start-watch', scss, js, out, folder),
    stopWatch: () => ipcRenderer.invoke('stop-watch')
})
