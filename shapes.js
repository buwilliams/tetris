function Shapes(canvasEl) {

	var ctx = canvasEl.getContext('2d'),
			width = canvasEl.width,
			height = canvasEl.height,
			block_size = 30;


	function drawBlock(x, y) {
		ctx.fillRect(x*block_size, y*block_size, block_size, block_size);
	}

	function each(ary, fn) {
		var i, len = ary.length, item;
		for(i=0; i<len; i++) {
			item = ary[i];
			fn(item, i);
		}
	}

	var colors = ["aqua", "Gold", "Magenta", "LimeGreen", "red", "blue", "orange"];

	// http://tetris.wikia.com/wiki/Tetromino
	var shapes = [
		[[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
	];

	function drawShape(offsetX, offsetY, shape, index) {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = colors[index];
		each(shape, function(row, i) {
			each(row, function(col, n) {
				//console.log(i, n, shape[i][n]);
				if(col === 1) { 
					drawBlock(offsetX+n, offsetY+i);
				}
			});
		});
	}

	function draw(offsetX, offsetY, index) {
		drawShape(offsetX, offsetY, shapes[index], index);
	}
	
	return {
		draw: draw
	}

}

var s = new Shapes(document.getElementById('box'));
