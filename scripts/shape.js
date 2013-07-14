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

		var c1 = hexLum(current_color, -0.1);
		var c2 = hexLum(current_color, -0.3);
		var c3 = hexLum(current_color, -0.3);
		var c4 = hexLum(current_color, -0.2);
		var lw = 3;

		ctx.beginPath();
		ctx.moveTo(xPos, yPos);
		ctx.lineTo(xPos, yPos+m);
		ctx.lineWidth = lw;
		ctx.strokeStyle = c1;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(xPos, yPos+m);
		ctx.lineTo(xPos+m, yPos+m);
		ctx.lineWidth = lw;
		ctx.strokeStyle = c2;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(xPos+m, yPos+m);
		ctx.lineTo(xPos+m, yPos);
		ctx.lineWidth = lw;
		ctx.strokeStyle = c3;
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(xPos+m, yPos);
		ctx.lineTo(xPos, yPos);
		ctx.lineWidth = lw;
		ctx.strokeStyle = c4;
		ctx.stroke();
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
