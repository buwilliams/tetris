function Shape(ctx, block_size, board_width, board_height) {

	var x = 0,
			y = 0,
			move = 1,
			current_shape,
			current_color;

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
	}

	function clone(shape) {
		var shape_clone = [];
		each(shape, function(item) {
			shape_clone.push(item);
		});
		return shape_clone;
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
				if(col === 1) { drawBlock(x+n, y+i); }
			});
		});
		return this;
	}

	this.moveUp = function() { --y; return this; }
	this.moveDown = function() { ++y; return this; }
	this.moveLeft = function() { --x; return this; }
	this.moveRight = function() { ++x; return this; }

	this.rotate = function() {
		var new_shape = clone(empty_bitmap);
		loop(function(row, i, col, n) {
			new_shape[n][i] = col;
		});
		current_shape = new_shape;
		return this;
	}

	this.getAbsPos = function() {
		var pos = [];
		loop(function(row, i, col, n) {
			if(col === 1) {
				pos.push([i+x, n+y]);
			}
		});
		return pos;
	}

	this.compare = function(shape) {
		var collision = false;
		var cordsA = this.getAbsPos();
		var cordsB = shape.getAbsPos();
		each(cordsA, function(a, i) {
			each(cordsB, function(b, n) {
				if(a[0] == b[0] && a[1] == b[1]) {
					collision = true;
				}
			});
		});
		return collision;
	}

}
