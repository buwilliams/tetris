function Tetris(canvasEl, fps, block_size) {

	var ctx = canvasEl.getContext('2d'),
			shapes = [],
			events = [],
			active_shape,
			engine,
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
			checkRows();
			cleanup();
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

		function checkRows() {
			var row_shapes = [],
					count_cols = 0,
					cur_row;

			// loop through the board rows
			for(var i=0; i<board_height; i++) {
				row_shapes = [];
				count_cols = 0;

				// find all shapes in the current row
				each(shapes, function(shape) {
					if(shape.hasRow(i)) {
						row_shapes.push(shape);
					}
				});

				// loop through the found shapes
				// and count the cols which have blocks
				each(row_shapes, function(shape) {
					cur_row = shape.getRow(i);
					//console.log(row_shapes, cur_row, i);
					each(cur_row, function(col) {
						if(col === 1) {
							count_cols++;
						}
					});
				});

				//console.log(count_cols);

				// if the current row has board_width blocks
				// in it then we know it's a full row
				if(count_cols != board_width) { continue; }

				// found a complete row!
				// update the shapes to remove their
				// completed row
				each(row_shapes, function(shape) {
					console.log(shape);
					shape.removeRow(i);
				});

			}
		}

		function cleanup() {
			for(var i=0; i<shapes.length; i++) {
				if(shapes[i].isEmpty()) {
					shapes.splice(i, 1);
				}
			}
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
