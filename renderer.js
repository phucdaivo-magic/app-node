let scss = null;
let js = null;
let out = null;

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
	await window.api.startWatch(scss, js, out);
	document.querySelector("[js-end]").classList.add("show");
	document.querySelector("[js-start]").classList.remove("show");
}

async function stop() {
	await window.api.stopWatch();
	document.querySelector("[js-start]").classList.add("show");
	document.querySelector("[js-end]").classList.remove("show");
}
