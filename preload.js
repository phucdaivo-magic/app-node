const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    pickScss: () => ipcRenderer.invoke('pick-scss'),
    pickJs: () => ipcRenderer.invoke('pick-js'),
    pickOutput: () => ipcRenderer.invoke('pick-output'),
    startWatch: (scss, js, out) =>
        ipcRenderer.invoke('start-watch', scss, js, out),
    stopWatch: () => ipcRenderer.invoke('stop-watch')
})
