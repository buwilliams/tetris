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

function convertFPStoMili(iFPS) {
	return Math.floor(1000/iFPS);
}

function between(num, start, end) {
	if(num >= start && num <= end) {
		return true;
	} else {
		return false;
	}
}
