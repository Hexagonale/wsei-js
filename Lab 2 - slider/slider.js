class SliderController {
	constructor(initialImage = 0) {
		this._onResize = this._onResize.bind(this);
		this._onKeydown = this._onKeydown.bind(this);
		this._onPrev = this._onPrev.bind(this);
		this._onNext = this._onNext.bind(this);

		this.currentImage = initialImage;
	}

	currentImage = 0;
	imagesCount = 0;

	init() {
		window.addEventListener('resize', this._onResize);
		window.addEventListener('keydown', this._onKeydown);

		document.getElementById('slider-prev').addEventListener('click', this._onPrev);
		document.getElementById('slider-next').addEventListener('click', this._onNext);

		this._onResize();

		this.imagesCount = document.getElementById('slider-images').childElementCount;
		for (let i = 0; i < this.imagesCount; i++) {
			const dot = document.createElement('div');
			dot.classList.add('slider-dot');

			if (i == this.currentImage) {
				dot.classList.add('selected');
			}

			dot.addEventListener('click', () => this.slideTo(i));
			document.getElementById('slider-dots').appendChild(dot);
		}
	}

	dispose() {
		window.removeEventListener('resize', this._onResize);
		window.removeEventListener('keydown', this._onKeydown);

		document.getElementById('slider-prev').addEventListener('click', this._onPrev);
		document.getElementById('slider-next').addEventListener('click', this._onNext);
	}

	slideTo(i) {
		while (i < 0) {
			i += this.imagesCount;
		}

		this.currentImage = i % this.imagesCount;

		this._updateOffset();

		const dots = document.getElementById('slider-dots').childNodes;
		for (const dot of dots) {
			dot.classList.toggle('selected', dot == dots[this.currentImage]);
		}
	}

	_onResize() {
		this._updateOffset();
	}

	_onKeydown(e) {
		switch (e.key) {
			case 'ArrowLeft':
				return this._onPrev();

			case 'ArrowRight':
				return this._onNext();
		}
	}

	_onPrev() {
		this.slideTo(this.currentImage - 1);
	}

	_onNext() {
		this.slideTo(this.currentImage + 1);
	}

	_getWantedOffset() {
		const sliderWidth = document.getElementById('slider').offsetWidth;

		return sliderWidth * -this.currentImage;
	}

	_updateOffset() {
		const wantedOffset = this._getWantedOffset();

		document.getElementById('slider-images').style.transform = `translateX(${wantedOffset}px)`;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const slider = new SliderController();

	slider.init();
});
