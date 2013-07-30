function startGame() {
	
	var soundOn = true;

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
	}

	function pauseGame(forcePause) {
		var el = $el('pause');
		if(el.html() == 'Pause Game' || forcePause === true) {
			muteSound();
			tetris.stop();
			el.html('Continue');
		} else {
			tetris.start();
			el.html('Pause Game');
			if(soundOn) {
				unmuteSound();
			}
		}
	}

	function toggleSound() {
		soundOn = !soundOn;
		if(soundOn) {
			unmuteSound();
		} else {
			muteSound();
		}
	}

	function muteSound() {
		var el = $el('mute'), music = $el('music').el;
		music.pause();
		el.html('Unmute Sound');
	}

	function unmuteSound() {
		var el = $el('mute'), music = $el('music').el;
		music.play();
		el.html('Mute Sound');
	}

	tetris = new Tetris(document.getElementById('box'), 40, 30, updateScore, updateLineCount, updateInfo);
	tetris.initialize();

	$el('reset').el.onclick = function(e) {
		e.preventDefault();
		resetGame();
	}

	$el('mute').el.onclick = function(e) {
		e.preventDefault();
		toggleSound();
	}

	$el('pause').el.onclick = function(e) {
		e.preventDefault();
		pauseGame();
	}

}

