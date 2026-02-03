let scss = null;
let js = null;
let out = null;
let folder = null;

async function pickFolder() {
	folder = await window.api.pickFolder();
	document.getElementById("folder").innerText = `Folder: ${folder ?? "chưa chọn"}`;
}

async function pickScss() {
	scss = await window.api.pickScss();
	document.getElementById("scss").innerText = `SCSS: ${scss ?? "chưa chọn"}`;
}

async function pickJs() {
	js = await window.api.pickJs();
	document.getElementById("js").innerText = `JS: ${js ?? "chưa chọn"}`;
}

async function pickOut() {
	out = await window.api.pickOutput();
	document.getElementById("out").innerText = `Output: ${out ?? "chưa chọn"}`;

}

async function start() {
	if (!(scss || js) && out) {
		alert("Chọn đủ SCSS, JS và Output");
		return;
	}
	await window.api.startWatch(scss, js, out, folder);
	document.querySelector("[js-start]").classList.add("active");
	document.querySelector("[js-start] svg").classList.add("active");
	document.querySelector("[js-end]").classList.add("active");
}

async function stop() {
	await window.api.stopWatch();
	document.querySelector("[js-start]").classList.remove("active");
	document.querySelector("[js-start] svg").classList.remove("active");
	document.querySelector("[js-end]").classList.remove("active");
}
