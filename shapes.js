function Shapes(canvasEl) {

	var ctx = canvasEl.getContext('2d'),
			block_size = 20,
			width = canvasEl.width,
			height = canvasEl.height;

	ctx.clearRect(0, 0, width, height);
	//ctx.fillStyle = color;

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

	// http://tetris.wikia.com/wiki/Tetromino
	var l_shape = [[1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]];
	var s_shape = [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
	var o_shape = [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
	var t_shape = [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
	var i_shape = [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]];

	function drawShape(offsetX, offsetY, shape) {
		each(shape, function(row, i) {
			each(row, function(col, n) {
				if(col === 1) { 
					drawBlock(offsetX+i, offsetY+n);
				}
			});
		});
	}

	drawShape(1, 1,  l_shape);
	drawShape(1, 6,  s_shape);
	drawShape(1, 11, o_shape);
	drawShape(1, 17, t_shape);
	drawShape(1, 23, i_shape);

}

var s = new Shapes(document.getElementById('box'));
