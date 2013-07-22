function Shape(ctx, block_size) {

	var x = 0,
			y = -2,
			move = 1,
			current_bitmap,
			current_shape,
			current_pos,
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
	// http://tetris.wikia.com/wiki/SRS
	var empty_bitmap = [
		[[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
	];

	var i_bitmap = [
		[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
		[[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
		[[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
	];
	
	var j_bitmap = [
		[[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 1, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
		[[0, 1, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]]
	];

	var l_bitmap = [
		[[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
		[[1, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
	];

	var o_bitmap = [
		[[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
	];

	var s_bitmap = [
		[[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]],
		[[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
	];

	var t_bitmap = [
		[[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
	];

	var z_bitmap = [
		[[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
		[[0, 1, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]]
	];

	this.initialize = function() {
		// Grab a new shape
		var random_int = getRandomInt(1, 7);

		//console.log('random number for shape', random_int);

		if(random_int == 1) {
			current_bitmap = clone(i_bitmap);
		} else if(random_int == 2) {
			current_bitmap = clone(j_bitmap);
		} else if(random_int == 3) {
			current_bitmap = clone(l_bitmap);
		} else if(random_int == 4) {
			current_bitmap = clone(o_bitmap);
		} else if(random_int == 5) {
			current_bitmap = clone(s_bitmap);
		} else if(random_int == 6) {
			current_bitmap = clone(t_bitmap);
		} else if(random_int == 7) {
			current_bitmap = clone(z_bitmap);
		}

		current_color = colors[random_int-1];
		current_rotation = 0;
		current_shape = current_bitmap[current_rotation];
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
		current_rotation = (current_rotation == 3) ? 0 : current_rotation + 1;
		current_shape = current_bitmap[current_rotation];
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

	this.getBottom = function() {
		var pos = this.getAbsPos(),
				bottom = null;
		each(pos, function(cords, i) {
			if(bottom == null) {
				bottom = cords[1];
			} else if (bottom < cords[1]) {
				bottom = cords[1];
			}
		});
		return bottom;
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

	this.getRow = function(yVal) {
		if(!this.hasRow(yVal)) {
			return;
		} else {
			return current_shape[yVal - y];
		}
	}

	this.hasRow = function(yVal) {
		var pos = this.getAbsPos(),
				result = false;
		each(pos, function(coord) {
			if(coord[1] == yVal) {
				result = true;
			}
		});
		return result;
	}

	this.countRow = function(yVal) {
		var pos = this.getAbsPos(),
				result = 0;
		each(pos, function(coord) {
			if(coord[1] == yVal) {
				result++;
			}
		});
		return result;
	}

	this.removeRow = function(yVal) {
		if(!this.hasRow(yVal)) {
			return;
		}

		var rowindex = yVal - y;
		console.log('deleting row', 'yVal:', yVal, 'y:', y, 'rowindex:', rowindex);
		current_shape.splice(rowindex, 1);
		y++; // automatically move the shape down since we removed a row
	}

	this.isEmpty = function() {
		if(current_shape.length === 0 ) {
			return true;
		}
		if(this.getAbsPos().length === 0) {
			return true;
		}
		return false;
	}

	this.y_at = function(yVal) {
		if(y == yVal) {
			return true;
		}
		return false;
	}

}
