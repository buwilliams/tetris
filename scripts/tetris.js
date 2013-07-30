function Tetris(canvasEl, fps, block_size, processAction) {

	var ctx = canvasEl.getContext('2d'),
			shapes = [],
			events = [],
			active_shape,
			engine,
			score = 0,
			lines = 0,
			level = 1,
			board_width = Math.floor(canvasEl.width / block_size),
			board_height = Math.floor(canvasEl.height / block_size),
			piece_speed = 1000,
			UP = 38,
			DOWN = 40,
			LEFT = 37,
			RIGHT = 39,
			LEVEL_UP = 10;

	function Engine() {

		var wait = convertFPStoMili(fps);
		var moveCounter = new WaitCounter(piece_speed);
		var gameTimer;

		function start() {
			gameTimer = setInterval(function() {
				gameLoop();
			}, wait);
		}

		function stop() {
			clearInterval(gameTimer);
		}

		function gameLoop() {
			processEvents();
			logic();
			printDebug();
			render();
		}

		function processEvents() {
			while(events.length !== 0) {
				var e = events.shift();
				if(e === "rotate") {
					active_shape.rotate();
				} else if(e === "left") {
					active_shape.moveLeft();
				} else if(e === "right") {
					active_shape.moveRight();
				} else if(e === "down") {
					active_shape.moveDown();
				}
				if(hit() || active_shape.checkBoundary(0, -2, board_width-1, board_height-1)) {
					active_shape.undo();
				}
			}
		}

		function logic() {
			moveShapes();
			processAllRows();
		}

		function render() {
			clear();
			background();
			each(shapes, function(s, i) {
				s.render();
			});
			active_shape.render();
		}

		function printDebug() {
			var html = '';
			html += 'A('+active_shape.info() + ')<br/>';
			each(shapes, function(s, i) {
				html += i+'('+s.info() + ')<br/>';
			});
			processAction(3, html);
		}

		function moveShapes() {
			moveCounter.setWait(piece_speed);
			moveCounter.inc(wait);
			if(!moveCounter.ready()) { return; }
			active_shape.moveDown();
			if(hit() && active_shape.y_at(-1)){
				// game over
				//console.log('game over!');
				processAction(5);
			}
			if(active_shape.checkBoundary(0, -2, board_width-1, board_height-1) || hit()) {
				active_shape.undo();
				shapes.push(active_shape);
				active_shape = new Shape(ctx, block_size);
				active_shape.initialize();
				addScore('shape');
			}
			moveCounter.reset();
		}

		function hit() {
			var hit_status = false;
			each(shapes, function(shape, i) {
				hit_status = (active_shape.compare(shape)) ? true : hit_status;
			});
			return hit_status;
		}

		function processAllRows() {
			var board_bottom = board_height - 1;
			for(var y=board_bottom; y>=0; y--) {
				// if we get a full row then that row will be deleted
				// and the appropreiate shapes moved down; for example:
				// row 1 becomes row 0 and we need to process row 0 again
				if(processRow(y)) { y++; }
			}
		}

		function processRow(y) {
			var found_shapes;
			if(isFullRow(y) == false) { return false; }
			console.log('complete row', y);
			addScore('row', 1);
			found_shapes = removeRow(y);
			moveShapesDown(y, found_shapes);
			removeEmptyShapes();
			return true;
		}

		function isFullRow(y) {
			var row_count = 0;

			each(shapes, function(shape) {
				row_count += shape.countRow(y);
			});

			if(row_count >= board_width) {
				return true;
			} else {
				return false;
			}
		}

		function removeRow(y) {
			var found_shapes = []
			each(shapes, function(shape, i) {
				// this function will not remove the row
				// unless it has it, so it safe to call
				// on shapes which do not have it
				if(shape.removeRow(y)) {
					found_shapes.push(i);
				}
			});
			return found_shapes;
		}

		function moveShapesDown(y, found_shapes) {
			// when removeRow is called the y position
			// is automatically changed, therefore, we
			// don't want to move the shapes down in that
			// case
			notEach(shapes, found_shapes, function(shape, i) {
				// need to determine if the shape has a Y value which
				// is less than Y, if so we can move it down
				if(shape.getBottom() < y) {
					shape.moveDown();
				}
			});
		}

		function removeEmptyShapes() {
			var clean_shapes = [], empty_shapes = [];
			each(shapes, function(shape, i) {
				if(shape.isEmpty() === false) {
					clean_shapes.push(shape);
				} else {
					empty_shapes.push(shape);
				}
			});
			if(empty_shapes.length > 0) {
				console.log('empty shape', empty_shapes);
			}
			shapes = clean_shapes;
		}

		function background() {
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, board_width*block_size, board_height*block_size);
		}

		function clear() {
			ctx.clearRect(0, 0, board_width*block_size, board_height*block_size);
		}

		function addScore(type, amount)
		{
			if(type === 'shape') {
				score += 10;
				processAction(1, score);
			} else if(type === 'row') {
				score += (10 * amount) * amount;
				lines += amount;
				processAction(2, lines);
			}

			var new_level = Math.floor(lines / LEVEL_UP) + 1;
			console.log('new level', new_level);
			if(new_level > level) {
				level = new_level;
				processAction(4, level);
				piece_speed = 1000 - (level * 60);
			}
		}

		return {
			stop: stop,
			start: start,
			render: render,
			gameLoop: gameLoop,
			removeRow: removeRow,
			printDebug: printDebug,
			clear: clear,
			processRow: processRow,
			isFullRow: isFullRow,
			moveShapesDown: moveShapesDown
		};

	}

	function keypress(e) {

		var evt = (e) ? e : window.event;
		var k = (evt.charCode) ?  evt.charCode : evt.keyCode;

		if(k === UP) {
			events.push("rotate");
		} else if(k === DOWN) {
			events.push("down");
		} else if(k === LEFT) {
			events.push("left");
		} else if(k === RIGHT) {
			events.push("right");
		}
	}

	this.addShape = function(bitmap, rotation, x, y) {
		var userShape = new Shape(ctx, block_size);
		userShape.initialize();
		userShape.override(bitmap, rotation, x, y);
		userShape.render();
		shapes.push(userShape);
		return userShape;
	}

	this.initialize = function() {

		document.onkeydown = function(e) { 
			keypress(e);
		}

		active_shape = new Shape(ctx, block_size);
		active_shape.initialize();

		this.test1();

    engine = new Engine();
		this.engine = engine;
    engine.start();

		this.start = engine.start;
		this.stop = engine.stop;

		this.shapes = shapes;
		this.active_shape = active_shape;

	}

	this.test1 = function() {
		this.addShape(4, 0, -1, 18);
		this.addShape(4, 0,  1, 18);
		this.addShape(4, 0,  3, 18);
		this.addShape(4, 0,  5, 18);
		this.addShape(4, 0,  7, 18);

		this.addShape(4, 0, -1, 16);
		this.addShape(4, 0,  1, 16);
		this.addShape(4, 0,  3, 16);
		this.addShape(4, 0,  5, 16);
		this.addShape(4, 0,  7, 16);

		this.addShape(4, 0, -1, 14);
		this.addShape(4, 0,  1, 14);
		this.addShape(4, 0,  3, 14);
		this.addShape(4, 0,  5, 14);
		this.addShape(4, 0,  7, 14);

		this.addShape(4, 0, -1, 12);
		this.addShape(4, 0,  1, 12);
		this.addShape(4, 0,  3, 12);
		this.addShape(4, 0,  5, 12);
		this.addShape(4, 0,  7, 12);

		this.addShape(4, 0, -1, 10);
		this.addShape(4, 0,  1, 10);
		this.addShape(4, 0,  3, 10);
		this.addShape(4, 0,  5, 10);
		this.addShape(4, 0,  7, 10);
	}

}
