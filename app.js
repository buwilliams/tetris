function Tetris(canvasEl) {

	var ctx = canvasEl.getContext('2d');
	var fps = 40;
	var shapes = [];
	var width = canvasEl.width;
	var height = canvasEl.height;
  var engine;

	// keys
	var UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;

  function Engine() {

    var wait = convertFPStoMili(fps);
    var moveCounter = new WaitCounter(250);

    this.run = function() {
      setInterval(function() {
        events();
        logic();
        render();
      }, wait);
    }

    function events() {

    }

    function logic() {
      moveShapes();
      collision();
    }

    function collision() {
      var result = checkCollide();
      if(result) {
        alert('Gotcha!');
      }
    }

    function moveShapes() {
      moveCounter.inc(wait);
      if(moveCounter.ready()) {
        eachShape(function(s, i) {
          if(i !== 0) {
            var ran = getRandomInt(1, 5);
            if(ran == 1) {
              s.moveLeft();
            } else if(ran == 2) {
              s.moveRight();
            }
            s.moveDown();
          }
        });
        moveCounter.reset();
      }
    }

    function render() {
      clear();
      eachShape(function(s) {
        s.draw();
      });
    }

    function clear() {
      ctx.clearRect(0, 0, width, height);
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

		var x = 15, y = 15, w = 30, h = 30, move = 30;

		// Set the boundaries
		var leftOut = w * -1, rightOut = width, topOut = h * -1, bottomOut = height;
		var farLeft = 0, farRight = width - w, farTop = 0, farBottom = height - h;

		var color = "#000";

		this.draw = function() {
			ctx.fillStyle = color;
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
			var pre = y - move;
			if(pre <= topOut) {
				y = farBottom;
			} else {
				y = pre;
			}
			return this;
		}

		this.moveDown = function() {
			var pre = y + move;
			if(pre >= bottomOut) {
				y = farTop;
			} else {
				y = pre;
			}
			return this;
		}

		this.moveLeft = function() {
			var pre = x - move;
			if(pre <= leftOut) {
				x = farRight;
			} else {
				x = pre;
			}
			return this;
		}

		this.moveRight = function() {
			var pre = x + move;
			if(pre >= rightOut) {
				x = farLeft;
			} else {
				x = pre;
			}
			return this;
		}

		this.color = function(newColor) {
			color = newColor;
			return this;
		}

		this.position = function() {
			return { x: x, y: y, w: w, h: h }
		}

	}

	function between(num, start, end) {
		if(num >= start && num <= end) {
			return true;
		} else {
			return false;
		}
	}

	function checkCollide() {

		var i, len = shapes.length;

		var a = shapes[0].position();

		for(i=1; i<len; i++) {
			var s = shapes[i].position();

			var srtX = s.x, endX = s.x + s.w;
			var srtY = s.y, endY = s.y + s.h;

			var insideX = between(a.x, srtX, endX);
			var insideY = between(a.y, srtY, endY);

			// console.log(srtX, endX, srtY, endY, insideX, insideY, this);

			if(insideX && insideY) {
				return true;
			}

		}

		return false;
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

		var s = shapes[0];

		if(k === UP) {
			s.moveUp();
		} else if(k === DOWN) {
			s.moveDown();
		} else if(k === LEFT) {
			s.moveLeft();
		} else if(k === RIGHT) {
			s.moveRight();
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
			if(shapes.length == 0) { return; }
			keypress(e);
		}

		var shape = new Shape(ctx);
		shapes.push(shape);

		var ranX = getRandomInt(0, width);
		var ranY = getRandomInt(0, height);
		shape = new Shape(ctx).moveTo(ranX, ranY).color("blue");
		shapes.push(shape);

		var ranX = getRandomInt(0, width);
		var ranY = getRandomInt(0, height);
		shape = new Shape(ctx).moveTo(ranX, ranY).color("red");
		shapes.push(shape);

		var ranX = getRandomInt(0, width);
		var ranY = getRandomInt(0, height);
		shape = new Shape(ctx).moveTo(ranX, ranY).color("green");
		shapes.push(shape);

    engine = new Engine();
    engine.run();

	}

}

var tetris = new Tetris(document.getElementById('box'));
tetris.initialize();
