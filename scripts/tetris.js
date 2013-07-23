function Tetris(canvasEl, fps, block_size, scoreFn, lineFn, updateInfoFn) {

	var ctx = canvasEl.getContext('2d'),
			shapes = [],
			events = [],
			active_shape,
			engine,
			points = 0,
			lines = 0;
			board_width = Math.floor(canvasEl.width / block_size),
			board_height = Math.floor(canvasEl.height / block_size),
			piece_speed = 1000,
			UP = 38,
			DOWN = 40,
			LEFT = 37,
			RIGHT = 39;

  function Engine() {

    var wait = convertFPStoMili(fps);
    var moveCounter = new WaitCounter(piece_speed);
		var gameTimer;

    this.start = function() {
      gameTimer = setInterval(function() {
        processEvents();
        logic();
				printDebug();
        render();
      }, wait);
    }

		this.stop = function() {
			clearInterval(gameTimer);
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
				if(hit() || active_shape.checkBoundary(0, 0, board_width-1, board_height-1)) {
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
        s.draw();
      });
			active_shape.draw();
    }

		function printDebug() {
			var html = '';
			html += 'A('+active_shape.info() + ')<br/>';
      each(shapes, function(s, i) {
				html += i+'('+s.info() + ')<br/>';
      });
			updateInfoFn(html);
		}

    function moveShapes() {
      moveCounter.inc(wait);
      if(!moveCounter.ready()) { return; }
			active_shape.moveDown();
			if(hit() && active_shape.y_at(-1)){
				// game over
				alert('game over!');
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
			for(var y=board_height; y>=0; y--) {
				// if we get a full row then that row will be deleted
				// and the appropreiate shapes moved down; for example:
				// row 1 becomes row 0 and we need to process row 0 again
				if(processRow(y)) { y++; }
			}
		}

		function processRow(y) {
			var found_shapes;
			if(isFullRow(y) == false) { return false; }
			console.log('found completed row', y);
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
				shape.removeRow(y);
				found_shapes.push(i);
			});
			return found_shapes;
		}

		function moveShapesDown(y, found_shapes) {
			// when removeRow is called the y position
			// is automatically changed, therefore, we
			// don't want to move the shapes down in that
			// case
			var alreadyMoved;
			each(shapes, function(shape, i) {
				if(shape.hasRow(y) == false) { return false; }

				alreadyMoved = false;
				each(found_shapes, function(n) {
					if(i != n) { return false; }
					alreadyMoved = true;
					return true;
				});
				if(alreadyMoved == false) {
					shape.moveDown();
				}
			});
		}

		function removeEmptyShapes() {
			var clean_shapes = [];
			each(shapes, function(shape, i) {
				if(!shape.isEmpty()) {
					clean_shapes.push(shape);
				} else {
					console.log('cleaning shape', i, shape);
				}
			});
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
				points += 10;
			} else if(type === 'row') {
				points += (10 * amount) * amount;
				lines += amount;
			}
			scoreFn(points);
			lineFn(lines);
		}

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

	this.initialize = function() {

		document.onkeydown = function(e) { 
			keypress(e);
		}

		active_shape = new Shape(ctx, block_size);
		active_shape.initialize();

    engine = new Engine();
    engine.start();

		this.start = engine.start;
		this.stop = engine.stop;

		this.shapes = shapes;
		this.active_shape = active_shape;

	}

}
