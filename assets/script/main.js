const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');
const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext('2d');
const faceDetector = new window.FaceDetector();
const optionsInputs = document.querySelectorAll('.controls input[type="range"]');
const options = {
	SIZE: 20,
	SCALE: 1.35
};
function handleOption(e) {
	const { value, name } = e.currentTarget;
	options[name] = parseFloat(value); //parse float zamienia string z inputa na liczbę
}
optionsInputs.forEach((input) => input.addEventListener('input', handleOption));

//function witch populate a user video

async function populateVideo() {
	const stream = await navigator.mediaDevices.getUserMedia({
		//aby dodac await trzeba stworzyc funkcje asynchroniczną dodajac slowo 'async' przed function
		video: { width: 900, height: 620 }
	});
	video.srcObject = stream; //zrodlo obrazyu - stream
	await video.play(); //poczekaj az strem sie zaladuje dopiero odtwarzaj

	//size the canvases to be the same size as video
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	faceCanvas.width = video.videoWidth;
	faceCanvas.height = video.videoHeight;
}

async function detect() {
	const faces = await faceDetector.detect(video);

	//ask the browser when teh next animation is and tell it to run detect function for me
	faces.forEach(drawFace);
	requestAnimationFrame(detect);
	faces.forEach(censor);
	//wywołanie funkcji w lepszy sposob pod wzgledem performanc, recoursion to wywołanie funckji w samej sobie co powoduje nieskonczone wywolanie tej funkcji
}

function drawFace(face) {
	const { width, height, top, left } = face.boundingBox; //wlasciwosc wbudowana w face dtector?
	ctx.clearRect(0, 0, canvas.width, canvas.height); // zeruje liczbe kwadratow
	ctx.strokeRect(left, top, width, height); // API for ractangle
	ctx.strokeStyle = '#ffc600';
	ctx.lineWidth = 2;
}

function censor({ boundingBox: face }) {
	faceCtx.imageSmoothingEnabled = false;
	faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
	// draw the small face
	faceCtx.drawImage(
		// 5 source args
		video, // where does the source come from?
		face.x, // where do we start the source pull from?
		face.y,
		face.width,
		face.height,
		// 4 draw args
		face.x, // where should we start drawing the x and y?
		face.y,
		options.SIZE,
		options.SIZE
	);
	// take that face back out and draw it back at normal size

	const width = face.width * options.SCALE;
	const height = face.height * options.SCALE;
	faceCtx.drawImage(
		faceCanvas, // source
		face.x, // where do we start the source pull from?
		face.y,
		options.SIZE,
		options.SIZE,
		// Drawing args
		face.x - (width - face.width) / 2,
		face.y - (height - face.height) / 2,
		width,
		height
	);
}

populateVideo().then(detect); //najpierw generuje sie video czekamy i jak sie zaladuje dopiero funckja detect
