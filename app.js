function Tetris(canvasEl) {

	var ctx = canvasEl.getContext('2d');
	var fps = 40;
	var shapes = [];

	// keys
	var UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;

	function Shape(ctx) {

		var x = 0, y = 0, w = 30, h = 30, move = 30;

		this.draw = function() {
			ctx.fillRect(x, y, w, h);
			return this;
		}

		this.moveTo = function(newX, newY) {
			x = newX;
			y = newY;
			return this;
		}

		this.moveBy = function(newX, newY) {
			x = x + newX;
			y = y + newY;
			return this;
		}

		this.moveUp = function() {
			y -= move;
		}

		this.moveDown = function() {
			y += move;
		}

		this.moveLeft = function() {
			x -= move;
		}

		this.moveRight = function() {
			x += move;
		}

	}

	function loop() {

		var wait = convertFPStoMili(fps);

		// Game loop
		setInterval(function() {

			var i, len = shapes.length;

			// 1stly, we need to clear the canvas
			ctx.clearRect(0, 0, 500, 500);

			// 2ndly, we need to draw all the shapes
			for(i=0; i<len; i++) {
				var s = shapes[i];
				//s.moveBy(5, 5);
				s.draw();
			}

		}, wait);

	}

	function convertFPStoMili(iFPS) {
		return Math.floor(1000/iFPS);
	}

	function keypress(e) {

		var evt = (e) ? e : window.event;
		var k = (evt.charCode) ?  evt.charCode : evt.keyCode;

		var s = shapes[0];

		if(k === UP) {
			s.moveUp();
		} else if(k === DOWN) {
			s.moveDown();
		} else if(k === LEFT) {
			s.moveLeft();
		} else if(k === RIGHT) {
			s.moveRight();
		}
	}

	this.initialize = function() {

		console.log(this);

		document.onkeydown = function(e) { 
			if(shapes.length == 0) { return; }
			keypress(e);
		}

		var shape = new Shape(ctx);
		shapes.push(shape);

		//shape = new Shape(ctx).moveTo(20, 20);
		//shapes.push(shape);

		loop();

	}

}

var tetris = new Tetris(document.getElementById('box'));
tetris.initialize();
