function $el(id) {
	var obj = {};
	obj.el = document.getElementById(id);
	obj.html = function(newHtml) {
		if(typeof(newHtml) === 'undefined') {
			return this.el.innerHTML;
		} else {
			this.el.innerHTML = newHtml;
		}
	};
    obj.hide = function() {
        this.el.style.display = 'none';
    };
    obj.show = function() {
        this.el.style.display = '';
    };
	return obj;
}

function getRandomArbitary (min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function each(ary, fn) {
	var i, len = ary.length, result;
	for(i=0; i<len; i++) {
		result = fn(ary[i], i);
		if(result === true) { break; }
	}
}

function notEach(ary, exceptionsIndex, fn) {
	each(ary, function(item, i) {
		var found = false, result;
		each(exceptionsIndex, function(exItem) {
			if(i === exItem) { found = true; }
			return true; // drop out of each more quickly
		});
		if(!found) {
			return fn(item, i);
		}
	});
}

function convertFPStoMili(fps) {
	return Math.floor(1000/fps);
}

function between(num, start, end) {
	if(num >= start && num <= end) {
		return true;
	} else {
		return false;
	}
}

function hexLum(hex, lum) {
	hex = hex.replace('#', '');

	var hexR = hex.substring(0, 2);
	var hexG = hex.substring(2, 4);
	var hexB = hex.substring(4, 6);

	var intR = parseInt(hexR, 16);
	var intG = parseInt(hexG, 16);
	var intB = parseInt(hexB, 16);

	function makeLum(val) {
		val = val + Math.floor(val*lum);
		val = (val > 255) ? 255 : val;
		val = (val < 0) ? 0 : val;
		return val;
	}

	intR = makeLum(intR);
	intG = makeLum(intG);
	intB = makeLum(intB);

	hexR = intR.toString(16);
	hexG = intG.toString(16);
	hexB = intB.toString(16);

	hexR = (hexR.length == 1) ? hexR + hexR : hexR;
	hexG = (hexG.length == 1) ? hexG + hexG : hexG;
	hexB = (hexB.length == 1) ? hexB + hexB : hexB;

	return '#'+hexR+hexG+hexB;
}
