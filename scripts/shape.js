function Shape(ctx, block_size) {

	var x = 3, // three blocks from the right
			y = -2, // two blocks above visible
			move = 1,
			current_bitmap,
			current_shape,
			current_pos,
			current_color,
			history = [],
			MAX_HISTORY = 10;

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
		var random_int = getRandomInt(1, 7);
		setupShape(random_int);
	}

	function setupShape(bitmap) {
		current_bitmap = getBitmap(bitmap);
		current_color = getColor(bitmap);
		current_rotation = 0;
		current_shape = current_bitmap[current_rotation];
	}

	function getColor(bitmap) {
		return colors[bitmap-1];
	}

	function getBitmap(bitmap) {
		var outBitmap;
		if(bitmap == 1) {
			outBitmap = clone(i_bitmap);
		} else if(bitmap == 2) {
			outBitmap = clone(j_bitmap);
		} else if(bitmap == 3) {
			outBitmap = clone(l_bitmap);
		} else if(bitmap == 4) {
			outBitmap = clone(o_bitmap);
		} else if(bitmap == 5) {
			outBitmap = clone(s_bitmap);
		} else if(bitmap == 6) {
			outBitmap = clone(t_bitmap);
		} else if(bitmap == 7) {
			outBitmap = clone(z_bitmap);
		}
		return outBitmap;
	}

	function clone(shape) {
		var shape_clone = [];
		each(shape, function(item) {
			shape_clone.push(item);
		});
		return shape_clone;
	}

	function renderBlock(x, y, color) {
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
		each(current_shape, function(row, shape_y) {
			each(row, function(col, shape_x) {
				fn(row, shape_y, col, shape_x);
			});
		});
	}

	this.render = function() {
		// keep the history to a managable size
		if(history.length > MAX_HISTORY) {
			history.shift();
		}

		loop(function(row, shape_y, col, shape_x) {
			if(col === 1) { renderBlock(x+shape_x, y+shape_y); }
		});

		return this;
	}

	this.moveUp = function() { --y; history.push("moveUp"); return this; }
	this.moveDown = function() { ++y; history.push("moveDown"); return this; }
	this.moveLeft = function() { --x; history.push("moveLeft"); return this; }
	this.moveRight = function() { ++x; history.push("moveRight"); return this; }

	this.rotate = function() {
		history.push("rotate");
		current_rotation = (current_rotation == 3) ? 0 : current_rotation + 1;
		current_shape = current_bitmap[current_rotation];
		return this;
	}

	this.unrotate = function() {
		this.rotate();
		this.rotate();
		this.rotate();
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

	this.getShapeY = function(abs_y) {
		var local_y = -1;
		loop(function(row, i, col, n) {
			if(col === 1) {
				var cur_x = n+x;
				var cur_y = i+y;
				if(abs_y == cur_y) {
					local_y = i;
				}
			}
		});
		return local_y;
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
				return true;
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
		} else if(action === "rotate") {
			this.unrotate();
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
				return true; // quick way to exit the for loop
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
		var row_index = this.getShapeY(yVal);
		if(row_index === -1) { return false; }
		console.log('row index', row_index);
		current_shape.splice(row_index, 1);
		y += 1; 
		return true;
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

	this.info = function() {
		return 'Len: '+current_shape.length+' X: '+x+' Y: '+y;
	}

	this.hit = function() {
		current_color = '#ff69b4'; // pink
	}

	this.override = function(bitmap, rotation, new_x, new_y) {
		setupShape(bitmap);
		current_shape = current_bitmap[rotation];
		x = new_x;
		y = new_y;
	}

	this.getShape = function() {
		return current_shape;
	}

}
