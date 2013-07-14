function getRandomArbitary (min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function each(ary, fn) {
	var i, len = ary.length;
	for(i=0; i<len; i++) {
		fn(ary[i], i);
	}
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
	// ColorLuminance
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

