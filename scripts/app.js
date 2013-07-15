// Tetris(canvasEl, fps, block_size)
var tetris = new Tetris(document.getElementById('box'), 40, 30);
tetris.initialize();

window.onblur = function() {
	tetris.stop();
	document.getElementById('music').pause();
}

window.onfocus = function() {
	tetris.run();
	document.getElementById('music').play();
}
