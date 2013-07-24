function startGame() {
	

	function updateScore(newScore) {
		$el('score').html(newScore);
	}

	function updateLineCount(lineCount) {
		$el('lines').html(lineCount);
	}

	function updateInfo(html) {
		$el('info').html(html);
	}

	function resetGame() {
		location.reload();
		//tetris.resetGame();
	}

	function pauseGame(forcePause) {
		var el = $el('pause');
		if(el.html() == 'Pause Game' || forcePause === true) {
			$el('music').el.pause();
			tetris.stop();
			el.html('Continue');
		} else {
			$el('music').el.play();
			tetris.start();
			el.html('Pause Game');
		}
	}

	tetris = new Tetris(document.getElementById('box'), 40, 30, updateScore, updateLineCount, updateInfo);
	tetris.initialize();

	window.onblur = function() {
		pauseGame(true);
	}

	$el('reset').el.onclick = function(e) {
		e.preventDefault();
		resetGame();
	}

	$el('pause').el.onclick = function(e) {
		e.preventDefault();
		pauseGame();
	}

}

