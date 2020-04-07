const video = document.querySelector('.webcam');

const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');

const faceCanvas = document.querySelector('.face');
const faceCtx = canvas.getContext('2d');

const faceDetector = new window.FaceDetector();

// console.log(video, canvas, faceCanvas, faceDetector);

//function witch populate a user video

async function populateVideo() {
	const stream = await navigator.mediaDevices.getUserMedia({
		//aby dodac await trzeba stworzyc funkcje asynchroniczną dodajac slowo 'async' przed function
		video: { width: 1280, height: 720 }
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
	requestAnimationFrame(detect); //wywołanie funkcji w lepszy sposob pod wzgledem performanc, recoursion to wywołanie funckji w samej sobie co powoduje nieskonczone wywolanie tej funkcji
}

function drawFace(face) {
	const { width, height, top, left } = face.boundingBox; //wlasciwosc wbudowana w face dtector?
	ctx.clearRect(0, 0, canvas.width, canvas.height); // zeruje liczbe kwadratow
	ctx.strokeRect(left, top, width, height); // API for ractangle
	ctx.strokeStyle = '#ffc600';
	ctx.lineWidth = 2;
}

function censor({ boundingBox: face }) {
	// destrukturyzacja boundingBox i zmiana nazwy na "face"
}

populateVideo().then(detect); //najpierw generuje sie video czekamy i jak sie zaladuje dopiero funckja detect
