const stats = document.querySelector(".stats");
const clearBtn = document.querySelector(".clear");
const startBtn = document.querySelector(".start");
const svg = document.querySelector("svg");
const path = document.querySelector("svg path");

const FPS = 60;
const TIME_OF_DRAWING = 1000/FPS;


window.localStorage.clear();
window.sessionStorage.setItem("screen-id", Date.now());
const id = sessionStorage.getItem("screen-id");

function getScreenId() {
	const screenId = `screen-id-${id}`;
	return screenId;
}

function getScreens() {
	return Object.entries(window.localStorage)
		.filter(([key]) => key.startsWith("screen-"))
		.map(([key, value]) => [key, JSON.parse(value)]);
}

const screenId = getScreenId();

function getScreenById() {
	const currentScreen = window.localStorage.getItem(screenId);
	return JSON.parse(currentScreen);
}

function setScreenDetails() {
	const windowDetails = {
		screenX: window.screenX,
		screenY: window.screenY,
		screenWidth: window.screen.availWidth,
		screenHeight: window.screen.availHeight,
		width: window.outerWidth,
		height: window.innerHeight,
		updated: Date.now(),
	};
	window.localStorage.setItem(screenId, JSON.stringify(windowDetails));
}

function displayStats() {
	if (!stats) return;
	const currentScreen = getScreenById();
	currentScreen.screenId = screenId;
	stats.innerHTML = JSON.stringify(currentScreen, null, " ");
}

function clear() {
	console.log(timers);
	timers.forEach((timer) => window.clearInterval(timer));
    window.localStorage.removeItem(screenId);
    window.location.reload();
}

function makeSVG() {
	const move = [];

	svg?.setAttribute("viewBox", `0 0 ${window.screen.availWidth} ${window.screen.availHeight}`);
	svg?.setAttribute("width", `${window.screen.availWidth}px`);
	svg?.setAttribute("height", `${window.screen.availHeight}px`);
	svg?.setAttribute("style", `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
	const screens = getScreens();
	for (let i = 0; i < screens.length; i++) {
	    const screen = screens[i][1];
		const x = screen.screenX + screen.width / 2;
		const y = screen.screenY + screen.height / 2;
	    if(i === 0) {
            move.push(`M ${x} ${y}`);
	    }else {
	        move.push(`L ${x} ${y}`);
	    }
	}
	move.push("Z");
	console.log(move);
	path?.setAttribute("d", move.join(" "));
}

const timers = [];
function go() {
	timers.push(setInterval(setScreenDetails, TIME_OF_DRAWING));
	timers.push(setInterval(displayStats, TIME_OF_DRAWING));
	timers.push(setInterval(makeSVG, TIME_OF_DRAWING));
}

clearBtn?.addEventListener("click", clear);

startBtn?.addEventListener("click", go);
