import { Animation, Sprite, Vector2, ctx } from './gamelib';

export class Airplane extends Animation {
	currentAngle: number;
	frameCount: number;
	imageWidth: number;
	imageHeight: number;
	burn: boolean;
	cachedOut: boolean;
	landing: Airplane | undefined;
	static fly: boolean;

	constructor(mainAirplane: boolean = true) {
		const imageWidth = 9240;
		const imageHeight = 560;
		const multiplier = 0.2;
		const frameCount = 7;
		const actualPosX = 0;
		const actualPosY = 0;
		super(
			['/images/airplanes/last.webp', '/images/airplanes/airplane_in_flame.webp'],
			{ x: actualPosX, y: actualPosY },
			{ width: imageWidth / frameCount, height: imageHeight, multiplier },
			{ x: 0, y: 0, width: imageWidth / frameCount, height: imageHeight },
			7,
			25,
			5,
			1,
		);
		this.currentAngle = 0;
		this.imageWidth = imageWidth;
		this.imageHeight = imageHeight;
		this.frameCount = frameCount;
		this.burn = false;
		this.cachedOut = false;
		this.setSize();

		if (mainAirplane) {
			this.landing = new Airplane(false);
			this.landing.burn = true;
		}
	}

	setSize(): void {
		// size
		const scale = window.innerWidth > 962 ? 2.5 : window.innerHeight > 492 ? 1.5 : 3;
		const proportion = this.size.height / this.size.width;
		this.size.width = window.innerWidth / scale;
		this.size.height = this.size.width * proportion;

		// position
		this.mapPosition.x = window.innerWidth / 10;
		const offset = (window.innerHeight <= 492 ? 175 : 275) + this.size.height;
		this.mapPosition.y = window.innerHeight - offset;
	}

	switchImages(burn: boolean): void {
		if (burn !== this.burn) {
			[this.images[0], this.images[1]] = [this.images[1], this.images[0]];
			this.image = this.images[0];
			this.burn = burn;
		}
	}

	angle(delta: number): void {
		if (this.currentAngle - 0.04 / delta > -0.1 && Airplane.fly && !this.burn) {
			this.currentAngle -= 0.04 / delta;
		}
		if (this.burn && this.currentAngle - 0.32 / delta < 0.5) {
			this.currentAngle += 0.32 / delta;
		}
	}

	toInitialPosition(): void {
		this.imagePart!.x = 0;
		this.currentAngle = 0;
		this.setSize();
		this.landing?.toInitialPosition();
	}

	burnFly(delta: number): void {
		this.mapPosition.x += 0.9 * delta;
		this.mapPosition.y += 0.4 * delta;
	}

	rotateAirplane(): void {
		if (this.burn) {
			const deviationX = this.mapPosition.x + this.size.width / 2;
			const deviationY = this.mapPosition.y + this.size.height / 2;
			this.rotate(
				this.currentAngle,
				() => {
					this.draw();
				},
				deviationX,
				deviationY,
			);
		} else {
			this.rotate(this.currentAngle, () => {
				this.draw();
			});
		}
	}

	drawDelta(delta: number): void {
		if (!ctx) return;
		if (this.cachedOut) {
			this.opacity = 0.5;
			this.landing?.drawDelta(delta);
		} else {
			this.opacity = 1;
		}
		if (Airplane.fly) {
			this.updateFrame(delta);
		}
		if (this.burn) {
			this.burnFly(delta);
		}
		this.angle(delta);
		ctx.globalAlpha = 0.5;
		this.rotateAirplane();
	}
}

export class GameMap extends Sprite {
	initialized: boolean;
	windowHeight: number;
	currentSize?: number;
	prevSize?: number;
	constructor() {
		const width = 8000;
		const height = 1175;
		super(
			'/images/background/bg_without_gradient.webp',
			{ x: 0, y: 0 },
			{ width, height },
			{ x: 0, y: 0, width, height },
		);
		this.initialized = false;
		this.mapPosition.y = -this.size.height + window.innerHeight;
		this.windowHeight = window.innerHeight;
		this.setSize();
	}

	setSize(): void {
		const diff = this.windowHeight - window.innerHeight;
		this.mapPosition.y -= diff;
		this.windowHeight = window.innerHeight;

		// size
		if (window.innerWidth < 550 || window.innerHeight < 493) {
			this.size.width = this.imagePart!.width / 2;
			this.size.height = this.imagePart!.height / 2;
			this.currentSize = 0.5;
		} else {
			this.size.width = this.imagePart!.width;
			this.size.height = this.imagePart!.height;
			this.currentSize = 1;
		}

		// position
		if (!this.prevSize) {
			this.prevSize = this.currentSize;
			if (this.currentSize === 0.5)
				this.mapPosition.y = -this.size.height + window.innerHeight - 110;
			if (this.windowHeight < 493) {
				this.mapPosition.y = -this.size.height + window.innerHeight - 20;
			}
		}
		if (this.currentSize !== this.prevSize) {
			this.prevSize = this.currentSize;
			this.mapPosition.x = 0;
			if (this.currentSize === 0.5)
				this.mapPosition.y = -this.size.height + window.innerHeight - 110;
			else {
				this.mapPosition.y = -this.size.height + window.innerHeight;
			}
			if (this.windowHeight < 493) {
				this.mapPosition.y = -this.size.height + window.innerHeight - 20;
			}
		}
	}

	toInitialPosition(): void {
		this.mapPosition.x = 0;
		if (this.currentSize === 0.5) this.mapPosition.y = -this.size.height + window.innerHeight - 110;
		else {
			this.mapPosition.y = -this.size.height + window.innerHeight;
		}
		if (this.windowHeight < 493) {
			this.mapPosition.y = -this.size.height + window.innerHeight - 20;
		}
	}

	start(delta: number): void {
		if (!Airplane.fly || this.mapPosition.y > this.size.height) return;

		if (this.mapPosition.x < -500) {
			this.mapPosition.y += 0.3 * delta;
		}
		const mult = this.mapPosition.x < -100 ? 0.9 : 0.6;
		this.mapPosition.x -= mult * delta;
	}

	drawDelta(delta: number): void {
		super.draw();
		this.start(delta);
	}
}

export class SpaceItem extends Sprite {
	random: number;
	random2: number;
	visiable: { from: number; to: number };
	speed: number;
	constructor(
		img: string,
		size: { width: number; height: number; multiplier?: number },
		visiable: { from: number; to: number },
		speed: number,
	) {
		const random = Math.random();
		const randomPosition = random * window.innerWidth * 2;
		const posX = random * window.innerWidth * 2 + randomPosition * 2;
		const posY = -400;
		super(img, { x: posX, y: posY }, size);
		this.random = random;
		this.random2 = Math.random();
		this.visiable = visiable;
		this.speed = speed;
	}

	move(delta: number, airplanePosition: number, mapSize?: number) {
		if (!Airplane.fly) return;

		if (
			this.mapPosition.y > -this.size.height ||
			(airplanePosition > this.visiable.from * (mapSize || 1) &&
				airplanePosition < this.visiable.to * (mapSize || 1))
		) {
			const randSpeed = this.random / 80 + 0.1;
			this.mapPosition.x -= delta * randSpeed * this.speed;
			this.mapPosition.y += ((delta * randSpeed) / 2) * this.speed;
		}
	}

	toInitialPosition() {
		this.mapPosition.x = window.innerWidth + this.random2 * window.innerWidth;
		this.mapPosition.y = -this.size.height - this.random * window.innerHeight * 2;
	}

	drawDelta(delta: number, airplanePosition: number, mapSize?: number) {
		this.move(delta, airplanePosition, mapSize);
		super.draw();
	}
}

export class Star {
	mapPosition: Vector2;
	speed: number;
	size: number;
	showPosition: number;

	constructor() {
		this.mapPosition = new Vector2(0, 0);
		this.speed = Math.random() * 2 + 0.5;
		this.size = Math.random() * 2 + 1;
		this.toInitialPosition();
		this.showPosition = 1000;
	}

	toInitialPosition() {
		this.mapPosition.x = Math.random() * window.innerWidth * 2.5;
		this.mapPosition.y = Math.random() * -window.innerHeight - 10;
	}

	update(airplanePosition: number) {
		if (!Airplane.fly) return;

		if (airplanePosition > this.showPosition) {
			this.mapPosition.x -= 2 * this.speed;
			this.mapPosition.y += this.speed;
			if (this.mapPosition.y > window.innerHeight) this.toInitialPosition();
		} else {
			this.toInitialPosition();
		}
	}

	draw(ctx: CanvasRenderingContext2D, airplanePosition: number) {
		ctx.globalAlpha =
			(airplanePosition - this.showPosition) / (this.showPosition * 2 - this.showPosition);
		ctx.beginPath();
		ctx.arc(this.mapPosition.x, this.mapPosition.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = 'white';
		ctx.fill();
	}
}

export class Sky {
	colorStart: string;
	colorEnd: string;
	offset: number;

	constructor() {
		this.colorStart = '#77abdf';
		this.colorEnd = '#779adf';
		this.offset = 8000;
	}

	update(delta: number) {
		if (!Airplane.fly) return;
		this.offset -= 0.2 * delta;
	}

	draw(delta: number) {
		this.update(delta);
		ctx.globalAlpha = 1;
		const gradient = ctx.createLinearGradient(0, 8000 - this.offset, 0, 0 - this.offset);
		gradient.addColorStop(0, '#77abdf');
		gradient.addColorStop(0.11, '#779adf');
		gradient.addColorStop(0.35, '#34244c');
		gradient.addColorStop(0.45, '#000000');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
	}

	toInitialPosition() {
		this.offset = 8000;
	}
}
