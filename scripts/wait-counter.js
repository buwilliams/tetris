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
