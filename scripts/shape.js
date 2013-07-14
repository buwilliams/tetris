function Shape(ctx, block_size) {

	var x = 0,
			y = 0,
			move = 1,
			current_shape,
			current_color,
			history = [];

	// aqua        = #00FFCC
	// gold        = #FFD700
	// magenta     = #FF00FF
	// limegreen   = #32CD32
	// bloodorange = #CC1100
	// slateblue   = #007FFF
	// orange      = #FF6600
	


	var colors = ['#00FFCC', '#FFD700', '#FF00FF', '#32CD32', '#CC1100', '#007FFF', '#FF6600'];
	//var colors = ["aqua", "Gold", "Magenta", "LimeGreen", "red", "blue", "orange"];

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
	}

	function clone(shape) {
		var shape_clone = [];
		each(shape, function(item) {
			shape_clone.push(item);
		});
		return shape_clone;
	}

	function drawBlock(x, y, color) {
		var xPos = x*block_size, 
		    yPos = y*block_size,
				m = block_size;

		ctx.fillStyle = current_color;
		ctx.fillRect(xPos, yPos, m, m);

		var c1 = hexLum(current_color, 0.3);
		var c2 = hexLum(current_color, -0.4);
		var c3 = hexLum(current_color, -0.5);
		var c4 = hexLum(current_color, 2.0);

		add3dBorder(xPos, yPos, m, 5, c1, c2, c3, c4);
	}

	function add3dBorder(x, y, rect_size, border_width, c1, c2, c3, c4) {
		var i,
		    side = 1,
				color,
				strX,
				strY,
				endX,
				endY;

		for(i=0; i<border_width; i++) {
			for(side=1; side<5; side++) {
				if(side == 1) {
					color = c1;
					strX = x + i;
					strY = y + i;
					endX = x + i;
					endY = y + rect_size - i;
				} else if(side == 2) {
					color = c2;
					strX = x + i;
					strY = y + rect_size - i;
					endX = x + rect_size - i;
					endY = y + rect_size - i;
				} else if(side == 3) {
					color = c3;
					strX = x + rect_size - i;
					strY = y + i;
					endX = x + rect_size - i;
					endY = y + rect_size - i;
				} else if(side == 4) {
					color = c4;
					strX = x + i;
					strY = y + i;
					endX = x + rect_size - i;
					endY = y + i;
				}

				ctx.beginPath();
				ctx.moveTo(strX, strY);
				ctx.lineTo(endX, endY);
				ctx.strokeStyle = color;
				ctx.lineWidth = 1;
				ctx.stroke();
			}
		}
	}
	
	function loop(fn) {
		each(current_shape, function(row, i) {
			each(row, function(col, n) {
				fn(row, i, col, n);
			});
		});
	}

	this.draw = function() {
		// keep the history to a managable size
		if(history.length > 10) {
			history.shift();
		}
		each(current_shape, function(row, i) {
			each(row, function(col, n) {
				if(col === 1) { drawBlock(x+n, y+i); }
			});
		});
		return this;
	}

	this.moveUp = function() { --y; history.push("moveUp"); return this; }
	this.moveDown = function() { ++y; history.push("moveDown"); return this; }
	this.moveLeft = function() { --x; history.push("moveLeft"); return this; }
	this.moveRight = function() { ++x; history.push("moveRight"); return this; }

	this.rotate = function() {
		var new_shape = clone(empty_bitmap);
		loop(function(row, i, col, n) {
			new_shape[n][i] = col;
		});
		current_shape = new_shape;
		history.push("rotate");
		return this;
	}

	this.getAbsPos = function() {
		var pos = [];
		loop(function(row, i, col, n) {
			if(col === 1) {
				pos.push([n+x, i+y]);
			}
		});
		return pos;
	}

	this.compare = function(shape) {
		var collision = false,
				cordsA = this.getAbsPos(),
				cordsB = shape.getAbsPos();
		each(cordsA, function(a, i) {
			each(cordsB, function(b, n) {
				if(a[0] == b[0] && a[1] == b[1]) {
					collision = true;
				}
			});
		});
		return collision;
	}

	this.checkBoundary = function(minX, minY, maxX, maxY) {
		var outOfBounds = false;
		var pos = this.getAbsPos();
		each(pos, function(cords, i) {
			if(cords[0] < minX || cords[0] > maxX || cords[1] < minY || cords[1] > maxY) {
				outOfBounds = true;
			}
		});
		return outOfBounds;
	}

	this.removeX = function(xVal) {
	}

	this.undo = function() {
		if(history.length === 0) { return; }
		var action = history.pop();
		if(action === "moveUp") {
			this.moveDown();
		} else if(action === "moveDown") {
			this.moveUp();
		} else if(action === "moveLeft") {
			this.moveRight();
		} else if(action === "moveRight") {
			this.moveLeft();
		}

	}

}
