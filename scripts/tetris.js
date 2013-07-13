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
					if(collide()) {
						active_shape.moveRight();
					}
				} else if(e === "right") {
					active_shape.moveRight();
					if(collide()) {
						active_shape.moveLeft();
					}
				} else if(e === "down") {
					active_shape.moveDown();
					if(collide()) {
						active_shape.moveUp();
					}
				}
			}
    }

    function logic() {
      moveShapes();
    }

    function moveShapes() {
      moveCounter.inc(wait);
      if(moveCounter.ready()) {
				active_shape.moveDown();
				if(collide()) {
					active_shape.moveUp();
				}
				if(active_shape.bottom() >= board_height) {
					active_shape.moveUp();
					shapes.push(active_shape);
					active_shape = new Shape(ctx, block_size);
					active_shape.initialize();
				}
        moveCounter.reset();
      }
    }

    function render() {
      clear();
			background();
      eachShape(function(s) {
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

	function collide() {
		var result = false;
		each(shapes, function(item, i) {
			result = (collideAB(active_shape, item)) ? true : result;
			if(result) {
				console.log('collision found', active_shape, item);
			}
		});
		return result;
	}

	function collideAB(shapeA, shapeB) {
		var result = false;
		shapeA.loop_blocks(function(row, i, col, n) {
			var cur_x = shapeA.x_abs(),
					cur_y = shapeA.y_abs();
			result = (shapeB.find_abs(cur_x, cur_y)) ? true : result;
		});
		return result;
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

	}

}
