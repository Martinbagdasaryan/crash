import { ctx, Sound, SoundWeb } from './gamelib';
import { Airplane, GameMap, Sky, SpaceItem, Star } from './items';
// import startGameMp3 from '/audio/startGame.mp3';
// import fly from '/audio/fly.wav';
// import crush from '/audio/crush.wav';

export class GameCycleController {
	airplane: Airplane;
	background: GameMap;
	planets: SpaceController;
	sky: Sky;
	startGameSound: SoundWeb;
	flySound: SoundWeb;
	crushSound: SoundWeb;
	constructor(musicVolume: number, gameVolume: number, overall: number) {
		this.airplane = new Airplane();
		this.background = new GameMap();
		this.planets = new SpaceController(200);
		this.sky = new Sky();

		// this.startGameSound = new Sound(startGameMp3);
		// this.flySound = new Sound(fly);
		// this.crushSound = new Sound(crush);
		this.flySound = new SoundWeb('/audio/fly.wav');
		this.startGameSound = new SoundWeb('/audio/startGame.mp3');
		this.crushSound = new SoundWeb('/audio/crush.wav');
		const load = async () => {
			await this.flySound.load();
			await this.startGameSound.load();
			await this.crushSound.load();
		};

		load();

		this.setMusicVolume(musicVolume, overall);
		this.setGameVolume(gameVolume, overall);
	}

	setMusicVolume(volume: number, overall: number) {
		this.startGameSound.volume(volume * overall);
	}

	setGameVolume(volume: number, overall: number) {
		this.flySound.volume(volume * overall);
		this.crushSound.volume(volume * overall);
	}

	mute() {
		this.setMusicVolume(0, 0);
		this.setGameVolume(0, 0);
	}

	stopSound() {
		this.startGameSound.stop();
		this.flySound.stop();
		this.crushSound.stop();
	}

	unMute(volume: number, overall: number) {
		this.setMusicVolume(volume, overall);
		this.setGameVolume(volume, overall);
	}

	startGame() {
		Airplane.fly = true;
		try {
			this.flySound.fadeIn();
			this.flySound.loop(true);
			this.startGameSound.play();
		} catch {}
		if (!this.background.initialized) {
			this.background.initialized = true;
		}
	}

	crush() {
		Airplane.fly = false;
		try {
			this.flySound.stop();
			this.crushSound.play();
		} catch {}
		this.airplane?.switchImages(true);
		try {
			this.startGameSound.stop();
		} catch {}
	}

	bettingTime() {
		this.toInitialPosition();
		this.background.initialized = true;
		this.airplane.switchImages(false);
	}

	setSize() {
		this.airplane.setSize?.();
		this.background.setSize?.();
		for (let i of this.planets.planets) {
			i.toInitialPosition();
		}
	}

	toInitialPosition() {
		this.airplane.toInitialPosition();
		this.background.toInitialPosition();
		this.sky.toInitialPosition();
		this.planets.toInitialPosition();
	}

	drawDelta(delta: number) {
		this.sky?.draw?.(delta);
		this.background.drawDelta?.(delta);
		this.planets.drawDelta?.(delta, this.sky?.offset || 0, this.background?.currentSize);
		this.airplane.drawDelta?.(delta);
	}
}

export class SpaceController {
	planets: SpaceItem[];
	stars: Star[];
	planetCount: number;
	minDistance: number;

	constructor(starCount: number) {
		//prettier-ignore
		const planetData = [
			{ img: '/images/mapItems/half-moon.webp', 	width: 840,  height: 840,	multiplier: 0.28, from: 1500, to: 10000, speed: 0.5 },
			{ img: '/images/mapItems/mars.webp', 			width: 400,  height: 400,	multiplier: 0.45, from: 1500, to: 10000, speed: 0.5 },
			{ img: '/images/mapItems/arevik.webp', 		width: 587,  height: 376,	multiplier: 0.6,  from: 1500, to: 10000, speed: 0.5 },
			{ img: '/images/mapItems/red-hole.webp',	width: 254,  height: 110, 									from: 1500, to: 10000, speed: 0.5 },
			{ img: '/images/mapItems/black-hole.webp',width: 547,  height: 283,	multiplier: 0.6,  from: 1500, to: 10000, speed: 0.5 },
			{ img: '/images/mapItems/cloud1.png', 		width: 1284, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud2.webp', 		width: 700,	 height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud3.webp', 		width: 700,	 height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud4.webp', 		width: 1386, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud5.webp', 		width: 700,	 height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud6.png', 		width: 1333, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud7.webp', 		width: 1249, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud8.webp', 		width: 1447, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud9.webp', 		width: 1094, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud10.webp', 		width: 933,	 height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud11.webp', 		width: 1475, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud12.webp', 		width: 1517, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
			{ img: '/images/mapItems/cloud13.png', 		width: 1667, height: 700, multiplier: 0.5,  from: 0, 		to: 1500,  speed: 5 },
		];
		this.planetCount = 5;
		this.minDistance = 1000;
		this.planets = [];
		this.stars = [];
		for (const i of planetData) {
			const newPlanet = new SpaceItem(
				i.img,
				{
					width: i.width,
					height: i.height,
					multiplier: i.multiplier,
				},
				{ from: i.from, to: i.to },
				i.speed,
			);
			this.planets.push(newPlanet);
		}

		for (let i = 0; i < starCount; i++) {
			this.stars.push(new Star());
		}
	}

	toInitialPosition() {
		for (let i of this.planets) {
			i.toInitialPosition();
		}
		for (let i of this.stars) {
			i.toInitialPosition();
		}
	}

	drawDelta(delta: number, airplanePosition: number, mapSize?: number) {
		airplanePosition = -(airplanePosition - 8000);

		for (const planet of this.planets) {
			planet.drawDelta(delta, airplanePosition, mapSize);
			if (planet.mapPosition.y > window.innerHeight) {
				if (
					!this.planets.some((i) => {
						i.collide(planet);
					})
				) {
					planet.toInitialPosition();
				}
			}
		}
		for (const star of this.stars) {
			star.draw(ctx, airplanePosition);
			star.update(airplanePosition);
		}
	}
}
