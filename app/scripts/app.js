function init_tetris() {
	
	var soundOn = true, sound_queue_running = false, sound_queue = [];

	function playMusic(sound) {
		var source;

		// don't play sounds if the user has
		// muted them!!!

		if(sound === 1) {
			source = 'music/track2.mp3';
		} else if(sound === 2) {
			source = 'music/track3.mp3';
		} else if(sound === 3) {
			source = 'music/track4.mp3';
		} else if(sound === 4) {
			source = 'music/track5.mp3';
		} else if(sound === 5) {
			source = 'music/track6.mp3';
		} else if(sound === 6) {
			source = 'music/track7.mp3';
		} else if(sound === 7) {
			source = 'music/track8.mp3';
		} else if(sound === 8) {
			source = 'music/track9.mp3';
		} else if(sound === 9) {
			source = 'music/track10.mp3';
		} else if(sound === 10) {
			source = 'music/track11.mp3';
		} else {
			return;
		}

		sound_queue.push(source);
		//soundQueue();

		var el = $el('music').el;
		el.src = source;

		// moved it here so that when they resume the music
		// we'll be on the right track
		if(soundOn === false) { return; }
		el.play();
	}

	function soundQueue() {
		// what to do here?
		// i need a loop which doesn't
		// block the process!
		var soundTimer = setInterval(processSoundQueue, 100);
	}

	function procesSoundQueue() {
		// reach the end of the qeueue
		if(sound_queue.length === 0) {
			return false;
		}
		
		var item = sound_queue.shift();
		var el = $el('music').el;
		el.src = item;

		// moved it here so that when they resume the music
		// we'll be on the right track
		if(soundOn === false) { return true; }
		el.play();
		return true;
	}

	function stopMusic() {
		var el = $el('music').el;
		el.pause();
	}

	function playSound(sound) {
		var source;

		// don't play sounds if the user has
		// muted them!!!
		if(soundOn === false) { return; }

		if(sound === 1) {
			source = 'music/sounds/goat-yeah.mp3';
		} else if(sound === 2) {
			source = 'music/sounds/next-level.mp3';
		} else if(sound === 3) {
			source = 'music/sounds/game-over.mp3';
		} else {
			return;
		}
		var el = $el('sounds').el;
		el.src = source;
		el.play();
	}

	function updateScore(newScore) {
		$el('score').html(newScore);
	}

	function updateLineCount(lineCount) {
		$el('lines').html(lineCount);
		playSound(1);
	}

	function updateInfo(html) {
		$el('info').html(html);
	}

	function updateLevel(level) {
		$el('level').html(level);
		playSound(2);
		stopMusic();
		playMusic(level);
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

	function startGame(options) {
		var canvas = $el('box').el;
		tetris = new Tetris(canvas, 40, 30, processAction);
		tetris.initialize();
		playMusic(3);
	}

	function endGame(options) {
		tetris.stop();
		stopMusic();
		playSound(3);
	}

	function processAction(action, options) {
		if(action === 0) {
			startGame(options);
		} else if(action === 1) {
			updateScore(options);
		} else if(action === 2) {
			updateLineCount(options);
		} else if(action === 3) {
			updateInfo(options);
		} else if(action === 4) {
			updateLevel(options);
		} else if(action === 5) {
			endGame(options);
		}
	}

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

	$el('yeah').el.onclick = function(e) {
		playSound(1);
	}

	$el('nextlevel').el.onclick = function(e) {
		playSound(2);
	}

	$el('gameover').el.onclick = function(e) {
		playSound(3);
	}

	$el('music').el.addEventListener('ended', function() {
		console.log('music ended!');
		this.currentTime = 0;
	}, false);

	processAction(0); // starts the game

}
