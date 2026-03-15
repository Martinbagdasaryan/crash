export let ctx: CanvasRenderingContext2D;

export const init = (canvas: HTMLCanvasElement | null) => {
	if (canvas === null) return;
	ctx = canvas.getContext('2d')!;
	// ctx.imageSmoothingEnabled = true;
	// ctx.imageSmoothingQuality = 'high';
	return ctx;
};

// -----------------------------------------------------------------------------

export class GameSettings {
	static scale = 1;
	static pause = false;
}

// -----------------------------------------------------------------------------

export class Vector2 {
	x: number;
	y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class Size {
	private _width: number;
	private _height: number;

	constructor(width = 0, height = 0, multiplier = 1) {
		this._width = width * multiplier;
		this._height = height * multiplier;
	}

	get width() {
		return this._width;
	}

	set width(value: number) {
		this._width = +(value / GameSettings.scale).toFixed(2);
	}

	get height() {
		return this._height;
	}

	set height(value: number) {
		this._height = +(value / GameSettings.scale).toFixed(2);
	}

	set(width: number, height: number) {
		this._width = width;
		this._height = height;
	}

	scale(multiplier: number) {
		this._width *= multiplier;
		this._height *= multiplier;
	}
}

// -----------------------------------------------------------------------------
export class Sprite {
	image: HTMLImageElement;
	mapPosition: Vector2;
	size: Size;
	imagePart?: { x: number; y: number; width: number; height: number };
	opacity: number;
	constructor(
		path: string,
		mapPosition: { x: number; y: number },
		size?: { width: number; height: number; multiplier?: number },
		imagePart?: { x: number; y: number; width: number; height: number },
	) {
		this.image = new Image();
		this.image.src = path;
		this.mapPosition = new Vector2(mapPosition.x, mapPosition.y);
		this.size = new Size(size?.width, size?.height, size?.multiplier);
		this.imagePart = imagePart;
		this.opacity = 1;
	}

	apply(actions: () => void) {
		ctx.save();
		actions();
		ctx.restore();
	}

	rotate(angle: number, drawFn: () => void, cx: number = 0, cy: number = 0) {
		this.apply(() => {
			ctx.translate(cx, cy);
			ctx.rotate(angle);
			ctx.translate(-cx, -cy);
			drawFn();
		});
	}

	collide(other: Sprite) {
		return !(
			this.mapPosition.x + this.size.width < other.mapPosition.x ||
			this.mapPosition.x > other.mapPosition.x + other.size.width ||
			this.mapPosition.y + this.size.height < other.mapPosition.y ||
			this.mapPosition.y > other.mapPosition.y + other.size.height
		);
	}

	draw() {
		if (!ctx) return;
		ctx.globalAlpha = this.opacity;

		const { x, y } = this.mapPosition;
		const { width, height } = this.size;
		const part = this.imagePart;

		ctx.drawImage(
			this.image,
			part?.x ?? 0,
			part?.y ?? 0,
			part?.width ?? this.image.width,
			part?.height ?? this.image.height,
			x,
			y,
			width ?? this.image.width,
			height ?? this.image.height,
		);
		ctx.globalAlpha = 1;
	}
}

// -----------------------------------------------------------------------------
export class Animation extends Sprite {
	images: HTMLImageElement[];
	timer: Timer;
	side: number;
	action?: number;
	speed: number;
	sideCound: number;
	frameCount: number;
	constructor(
		paths: string[],
		mapPosition: { x: number; y: number },
		size: { width: number; height: number; multiplier: number },
		imagePart: { x: number; y: number; width: number; height: number },
		frameCount: number,
		frameSpeed: number,
		moveSpeed: number,
		sideCound: number,
	) {
		super(paths[0], mapPosition, size, imagePart);
		this.images = [];
		this.timer = new Timer(frameSpeed);
		this.speed = moveSpeed;
		this.sideCound = sideCound;
		this.action = undefined;
		this.side = 1;
		this.frameCount = frameCount;
		paths.forEach((path) => {
			const img = new Image();
			img.src = path;
			this.images.push(img);
		});
	}

	updateFrame(time: number): void {
		this.timer.doTick(time);
		if (!this.timer.tick()) return;
		this.imagePart!.x =
			(this.imagePart?.x! + this.imagePart?.width!) % (this.imagePart?.width! * this.frameCount);
		this.timer.reset();
	}
}

// -----------------------------------------------------------------------------

export class Menu {
	x: number;
	y: number;
	width: number;
	height: number;
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw() {
		ctx.fillStyle = 'rgba(77, 77, 77, 0.9)';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

// -----------------------------------------------------------------------------

export class Sound {
	audio: HTMLAudioElement;
	private _setVolume: number;
	constructor(path: string) {
		this.audio = new Audio(path);
		this.audio.volume = 0.1;
		this._setVolume = 0.1;
	}

	play = () => {
		try {
			this.audio.play();
		} catch {}
	};
	pause = () => this.audio.pause();
	loop = (value: boolean) => (this.audio.loop = value);

	volume = (value: number) => {
		this.audio.volume = value;
	};

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}

	playEffect = () => (this.audio.cloneNode() as HTMLAudioElement).play();

	fadeIn = (duration = 2000) => {
		this._setVolume = this.audio.volume;
		this.audio.volume = 0;
		this.play();

		const stepTime = 20;
		const steps = duration / stepTime;
		const volumeStep = this._setVolume / steps;
		let currentVolume = 0;

		const fadeInterval = setInterval(() => {
			currentVolume += volumeStep;
			if (currentVolume >= this._setVolume) {
				currentVolume = this._setVolume;
				clearInterval(fadeInterval);
			}
			this.audio.volume = currentVolume;
		}, stepTime);
		clearInterval(fadeInterval);
	};
}

// -----------------------------------------------------------------------------

export class MyText {
	text: string;
	font: string;
	size: number;
	mapPosition: Vector2;
	color: string;
	constructor(text: string, x: number, y: number) {
		this.text = text;
		this.font = 'Arial';
		this.size = 20;
		this.mapPosition = new Vector2(x, y);
		this.color = 'white';
	}

	setText = (text: string) => (this.text = text);

	draw() {
		ctx.font = `${this.size}px ${this.font}`;
		ctx.fillStyle = this.color;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText(this.text, this.mapPosition.x, this.mapPosition.y);
	}
}

// -----------------------------------------------------------------------------

export class Timer {
	delay: number;
	elapsed: number;
	constructor(delay: number) {
		this.delay = delay;
		this.elapsed = 0;
	}

	reset = () => (this.elapsed = 0);

	doTick = (time: number) => (this.elapsed += time);

	tick() {
		if (this.elapsed >= this.delay) {
			this.elapsed = 0;
			return true;
		}
		return false;
	}

	update() {
		if (this.elapsed < this.delay) {
			this.elapsed += 17; // 1000 ms / 60 fps = 16.7
		}
	}
}

// -----------------------------------------------------------------------------

export class List {
	items: string[];
	constructor() {
		this.items = [];
	}

	add = (item: string) => this.items.push(item);

	clear = () => (this.items = []);

	get(index: number) {
		if (index >= 0 && index < this.items.length) {
			return this.items[index];
		}
	}

	filter(callback: (value: string, index: number, array: string[]) => boolean) {
		this.items = this.items.filter(callback);
	}

	forEach(callback: (value: string, index: number, array: string[]) => void) {
		this.items.forEach(callback);
	}

	count = () => this.items.length;

	remove(index: number) {
		if (index >= 0 && index < this.items.length) {
			this.items.splice(index, 1);
		}
	}
}

// -----------------------------------------------------------------------------

export class Storage {
	save = (key: string, value: string) => localStorage.setItem(key, value);

	load(key: string) {
		const value = localStorage.getItem(key);
		return value;
	}

	remove = (key: string) => localStorage.removeItem(key);

	clear = () => localStorage.clear();
}

export class SoundWeb {
	private static audioCtx: AudioContext;
	private buffer: AudioBuffer | null = null;

	private gainNode: GainNode;
	private source: AudioBufferSourceNode | null = null;

	private volumeValue = 0.1;
	private isLoop = false;

	constructor(private path: string) {
		if (!SoundWeb.audioCtx) {
			SoundWeb.audioCtx = new AudioContext();
		}

		this.gainNode = SoundWeb.audioCtx.createGain();
		this.gainNode.gain.value = this.volumeValue;
		this.gainNode.connect(SoundWeb.audioCtx.destination);
	}

	static async unlock() {
		if (SoundWeb.audioCtx.state === 'suspended') {
			await SoundWeb.audioCtx.resume();
			console.log('🔓 Audio unlocked!');
		}
	}

	async load() {
		const res = await fetch(this.path);
		const arrayBuffer = await res.arrayBuffer();
		this.buffer = await SoundWeb.audioCtx.decodeAudioData(arrayBuffer);
	}

	play() {
		if (!this.buffer) return;

		this.stop();

		this.source = SoundWeb.audioCtx.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.loop = this.isLoop;

		this.source.connect(this.gainNode);
		this.source.start();
	}

	playEffect() {
		if (!this.buffer) return;

		const effect = SoundWeb.audioCtx.createBufferSource();
		effect.buffer = this.buffer;

		effect.connect(this.gainNode);
		effect.start();
	}

	stop() {
		if (this.source) {
			this.source.stop();
			this.source.disconnect();
			this.source = null;
		}
	}

	loop(value: boolean) {
		this.isLoop = value;
		if (this.source) {
			this.source.loop = value;
		}
	}

	volume(value: number) {
		this.volumeValue = value;
		this.gainNode.gain.value = value;
	}

	fadeIn(duration = 2000) {
		this.volume(0);
		this.play();

		this.gainNode.gain.linearRampToValueAtTime(
			this.volumeValue,
			SoundWeb.audioCtx.currentTime + duration / 1000,
		);
	}

	fadeOut(duration = 2000) {
		this.gainNode.gain.linearRampToValueAtTime(0, SoundWeb.audioCtx.currentTime + duration / 1000);

		setTimeout(() => this.stop(), duration);
	}
}
