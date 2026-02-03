const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const chokidar = require("chokidar");
const express = require("express");
const esbuild = require("esbuild");

let watcher = null;
let server = null;

const PORT = 3000;

function createWindow() {
	const win = new BrowserWindow({
		width: 650,
		height: 450,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});
	win.loadFile("index.html");
}

/* ========= BUILD SCSS ========= */
function buildScss(src, outDir) {
	return new Promise((resolve) => {
		if (src) {
			const result = sass.compile(src);
			fs.writeFileSync(path.join(outDir, "style.css"), result.css);
			console.log("SCSS built");
			resolve();
		} else {
			resolve();
		}
	});
}

/* ========= BUILD JS (ESBUILD) ========= */
async function buildJs(entry, outDir) {
	if (entry) {
		await esbuild.build({
			entryPoints: [entry],
			bundle: true,
			sourcemap: true,
			outfile: path.join(outDir, "bundle.js"),
			target: "es2017",
		});
		console.log("JS built");
	} else {
		return Promise.resolve();
	}
}

/* ========= SERVER ========= */
function startServer(outDir) {
	if (server) return;

	const appServer = express();
	appServer.use(express.static(outDir));
	appServer.get("/__ping", (_, res) => res.send("ok"));

	server = appServer.listen(PORT, "0.0.0.0", () => {
		console.log(`Server running http://localhost:${PORT}`);
	});
}

/* ========= WATCH ========= */
ipcMain.handle("start-watch", async (_, scss, js, outDir, folder) => {
	if (watcher) watcher.close();
	const watchPaths = [scss, js];

	if (folder) {
		watchPaths.push([folder, '/**/*']);
	}

	fs.mkdirSync(outDir, { recursive: true });

	await Promise.all([
		buildScss(scss, outDir),
		buildJs(js, outDir)
	]);

	startServer(outDir);

	watcher = chokidar.watch(watchPaths.filter(Boolean), {
		ignoreInitial: true,
	});

	watcher.on("change", async (file) => {
		try {
			if (file.split('.').pop() === 'scss') {
				await buildScss(scss, outDir);
			}
			if (file.split('.').pop() === 'js') {
				await buildJs(js, outDir);
			}
			console.log("Changed:", file);
		} catch (e) {
			console.error(e.message);
		}
	});

	return true;
});

ipcMain.handle("stop-watch", () => {
	if (watcher) watcher.close();
	watcher = null;
	return true;
});

/* ========= PICK FILE ========= */
ipcMain.handle("pick-scss", async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		filters: [{ name: "SCSS", extensions: ["scss"] }],
		properties: ["openFile"],
	});
	return canceled ? null : filePaths[0];
});

ipcMain.handle("pick-js", async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		filters: [{ name: "JS", extensions: ["js"] }],
		properties: ["openFile"],
	});
	return canceled ? null : filePaths[0];
});

ipcMain.handle("pick-output", async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});
	return canceled ? null : filePaths[0];
});

ipcMain.handle("pick-folder", async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});
	return canceled ? null : filePaths[0];
});

app.whenReady().then(createWindow);
