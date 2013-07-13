function Shape(ctx, block_size, board_width, board_height) {

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
		updateShape();
	}

	function updateShape() {
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

	this.moveUp = function() {
		--y;
		updateShape();
		return this;
	}

	this.moveDown = function() {
		++y;
		updateShape();
		return this;
	}

	this.moveLeft = function() {
		--x;
		updateShape();
		return this;
	}

	this.moveRight = function() {
		++x;
		updateShape();
		return this;
	}

	this.rotate = function() {
		var new_shape = clone(empty_bitmap);
		loop(function(row, i, col, n) {
			new_shape[n][i] = col;
		});
		current_shape = new_shape;
		updateShape();
		return this;
	}

	this.shape = current_shape;
	this.x = x;
	this.y = y;

	this.left = function() {
		return this.right() - current_size.width;
	}

	this.right = function() {
		var cur_x = 0;
		this.loop_blocks(function(row, i, col, n) {
			cur_x = (n > cur_x) ? n : cur_x;
		});
		return x + cur_x;
	}

	this.top = function() {
		return this.bottom() - current_size.height;
	}

	this.bottom = function() {
		var cur_y = 0;
		this.loop_blocks(function(row, i, col, n) {
			cur_y = (i > cur_y) ? i : cur_y;
		});
		return y + cur_y;
	}

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
		var _this = this;
		this.loop_blocks(function(row, i, col, n) {
			var cur_x = _this.x_abs();
			var cur_y = _this.y_abs();
			if(cur_x === x && cur_y === y) {
				result = true;
			}
		});
		return result;
	}
}
