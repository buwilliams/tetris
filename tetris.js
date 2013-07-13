function Tetris(canvasEl, fps, block_size) {

	var ctx = canvasEl.getContext('2d'),
			shapes = [],
			active_shape,
			engine,
			board_width = Math.floor(canvasEl.width / block_size),
			board_height = Math.floor(canvasEl.height / block_size);

	// keys
	var UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;

  function Engine() {

    var wait = convertFPStoMili(fps);
    var moveCounter = new WaitCounter(1000);
		var gameTimer;

    this.run = function() {
      gameTimer = setInterval(function() {
        events();
        logic();
        render();
      }, wait);
    }

		this.stop = function() {
			clearInterval(gameTimer);
		}

    function events() {
    }

    function logic() {
      moveShapes();
    }

    function moveShapes() {
      moveCounter.inc(wait);
      if(moveCounter.ready()) {
				active_shape.moveDown();
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

  function WaitCounter(waitTime) {
    var expired = false;
    var counter = 0;

    this.reset = function() {
      counter = 0;
    }

    this.inc = function(mili) {
      counter += mili;
    }

    this.ready = function() {
      if(counter >= waitTime) {
        return true;
      } else {
        return false;
      }
    }
  }

	function Shape(ctx) {

		var x = 0,
		    y = 0,
				move = 1,
				current_shape,
				current_color,
				current_size;

		var colors = ["aqua", "Gold", "Magenta", "LimeGreen", "red", "blue", "orange"];

		// Shape definitions, see: http://tetris.wikia.com/wiki/Tetromino
		var empty_bitmap = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		var shapes_bitmap = [
			[[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
			[[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
			[[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
			[[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
			[[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
			[[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
			[[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
		];

		this.initialize = function() {
			// Grab a new shape
			var random_int = getRandomInt(1, 7) - 1;
			current_shape = clone(shapes_bitmap[random_int]);
			current_color = colors[random_int];
			current_size = getSize();
			y = 0 - current_size.height;
			x = Math.floor((board_width / 2) - (current_size.width / 2));
		}

		function clone(shape) {
			var shape_clone = [];
			each(shape, function(item) {
				shape_clone.push(item);
			});
			return shape_clone;
		}

		function getSize() {
			var out = { width: 0, height: 0 };
			each(current_shape, function(row, i) {
				each(row, function(col, n) {
					if(col === 1) { 
						out.height = i;
						out.width = (n > out.width) ? n : out.width;
					}
				});
			});
			return out;
		}

		function drawBlock(x, y, color) {
			ctx.fillStyle = current_color;
			ctx.fillRect(x*block_size, y*block_size, block_size, block_size);
		}
		
		function loop(fn) {
			each(current_shape, function(row, i) {
				each(row, function(col, n) {
					fn(row, i, col, n);
				});
			});
		}

		this.draw = function() {
			each(current_shape, function(row, i) {
				each(row, function(col, n) {
					if(col === 1) { 
						drawBlock(x+n, y+i);
					}
				});
			});
			return this;
		}

		this.moveDown = function() {
			++y;
			return this;
		}

		this.moveLeft = function() {
			--x;
			return this;
		}

		this.moveRight = function() {
			++x;
			return this;
		}

		this.rotate = function() {
			var new_shape = clone(empty_bitmap);
			loop(function(row, i, col, n) {
				new_shape[n][i] = col;
			});
			current_shape = new_shape;
			return this;
		}

		this.shape = current_shape;
		this.x = x;
		this.y = y;

		this.x_abs = function(row, col) {
			return x + col;
		}

		this.y_abs = function(row, col) {
			return y + row;
		}

		this.loop_blocks = function(fn) {
			loop(function(row, i, col, n) {
				if(col === 1) {
					fn(row, i, col, n);
				}
			});
		}

		this.find_abs = function(x, y) {
			var result = false;
			this.loop_blocks(function(row, i, col, n) {
				var cur_x = this.x_abs();
				var cur_y = this.y_abs();
				if(cur_x === x && cur_y === y) {
					result = true;
				}
			});
			return result;
		}

		this.collide = function(shape) {
			var result = false;
			this.loop_blocks(function(row, i, col, n) {
				var cur_x = this.x_abs();
				var cur_y = this.y_abs();
				result = (shape.find_abs(cur_x, cur_y)) ? true : result;
			});
			return result;
		}

	}

	function between(num, start, end) {
		if(num >= start && num <= end) {
			return true;
		} else {
			return false;
		}
	}

  function eachShape(fn) {
    each(shapes, fn);
  }

  function each(ary, fn) {
    var i, len = ary.length;
    for(i=0; i<len; i++) {
      fn(ary[i], i);
    }
  }

	function convertFPStoMili(iFPS) {
		return Math.floor(1000/iFPS);
	}

	function keypress(e) {

		var evt = (e) ? e : window.event;
		var k = (evt.charCode) ?  evt.charCode : evt.keyCode;

		if(k === UP) {
			active_shape.rotate();
		} else if(k === DOWN) {
			active_shape.moveDown();
		} else if(k === LEFT) {
			active_shape.moveLeft();
		} else if(k === RIGHT) {
			active_shape.moveRight();
		} else {
			return;
		}
	}

	function getRandomArbitary (min, max) {
		return Math.random() * (max - min) + min;
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.initialize = function() {

		document.onkeydown = function(e) { 
			keypress(e);
		}

		active_shape = new Shape(ctx);
		active_shape.initialize();

    engine = new Engine();
    engine.run();

	}

}
