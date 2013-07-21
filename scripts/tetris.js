function Tetris(canvasEl, fps, block_size, scoreFn, lineFn) {

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

    this.run = function() {
      gameTimer = setInterval(function() {
        processEvents();
        logic();
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
			fullRows();
			//cleanup();
    }

    function moveShapes() {
      moveCounter.inc(wait);
      if(!moveCounter.ready()) { return; }
			active_shape.moveDown();
			if(active_shape.checkBoundary(0, 0, board_width-1, board_height-1) || hit()) {
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

		function fullRows() {
			var row_shapes = [],
					count_cols = 0,
					cur_row,
					move_down = [];

			// loop through the board rows
			for(var y=board_height; y>=0; y--) {

				row_shapes = [];
				count_cols = 0;

				// find all shapes in the current row
				each(shapes, function(shape) {
					if(shape.hasRow(y)) {
						row_shapes.push(shape);
					}
				});

				// loop through the found shapes
				// and count the cols which have blocks
				each(row_shapes, function(shape) {
					cur_row = shape.getRow(y);
					each(cur_row, function(col) {
						if(col === 1) {
							count_cols++;
						}
					});
				});

				// if the current row has board_width blocks
				// in it then we know it's a full row
				if(count_cols < board_width) { continue; }

				console.log('count cols', count_cols, 'complete row', y);
				console.log('row shapes', row_shapes);

				// found a complete row!
				// update the shapes to remove their
				// completed row
				each(row_shapes, function(shape) {
					shape.removeRow(y);
				});

				move_down.push(y);
			}

			// update the score
			if(move_down.length > 0) {
				addScore('row', move_down.length);
			}

			// remove shapes which doesn't exist any longer
			cleanup();

			each(move_down, function(y) {
				// move the shapes down one row
				each(shapes, function(shape) {
					if(shape.getBottom() <= y) {
						shape.moveDown();
					}
				});
			});

		}

		function cleanup() {
			var remove_shapes = [];
			each(shapes, function(shape, i) {
				if(shape.isEmpty()) {
					remove_shapes.push(i);
					console.log('empty shape', i, shape);
					//shapes.splice(i, 1);
				}
			});

			each(remove_shapes, function(i) {
				shapes.splice(i, 1);
			});

		}

    function render() {
      clear();
			background();
      each(shapes, function(s) {
        s.draw();
      });
			active_shape.draw();
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
				points = (10 * amount) * amount;
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
    engine.run();

		this.run = engine.run;
		this.stop = engine.stop;

		this.shapes = shapes;
		this.active_shape = active_shape;

	}


}
