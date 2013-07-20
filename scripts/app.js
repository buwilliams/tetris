
function updateScore(newScore) {
	document.getElementById('score').innerHTML = newScore;
}

function updateLineCount(lineCount) {
	document.getElementById('lines').innerHTML = lineCount;
}

// Tetris(canvasEl, fps, block_size)
var tetris = new Tetris(document.getElementById('box'), 40, 30, updateScore, updateLineCount);
tetris.initialize();

window.onblur = function() {
	tetris.stop();
	document.getElementById('music').pause();
}

window.onfocus = function() {
	tetris.run();
	document.getElementById('music').play();
}
