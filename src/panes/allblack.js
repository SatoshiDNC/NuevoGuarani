	const transitionTo = function(view, option = '') {
		v = allblack;
		v.transitionOption = option;
		v.root = menudiv;
		v.state = 'begin';
		v.root.b = v; v.parent = v.root;
		v.root.relayout();
		v.target = view;
		v.setRenderFlag(true);
	};

	var allblack = v = new vp.View(null);
	v.name = Object.keys({allblack}).pop();
	v.renderFunc = function() {
		if (false) {
			if (this.counter)
				console.log('transition state:', this.state, this.counter);
			else
				console.log('transition state:', this.state);
		}
		gl.clearColor(0,0,0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		switch (this.state) {
		case 'begin':
			this.counter = 1; this.state = 't1';
			break;
		case 't1':
			this.counter = this.counter - 1;
			if (this.counter <= 0) this.state = 'go fullscreen';
			break;
		case 'go fullscreen':
			this.resized = false;
			if (this.transitionOption == 'max') fullscreen.enter();
			if (this.transitionOption == 'min') fullscreen.exit();
			this.counter = 100; this.state = 't2';
			break;
		case 't2':
			this.counter = this.counter - 1;
			if (this.resized) { this.resized = false; this.counter = 20; }
			if (this.counter <= 0) this.state = 'switch view';
			break;
		case 'switch view':
			this.root.b = this.target; this.target.parent = this.root
			this.root.relayout();
			if (this.target.switchedToFunc) this.target.switchedToFunc();
			this.state = 'done';
			break;
		default:
			return;
		}
		this.root.setRenderFlag(true);
	};
