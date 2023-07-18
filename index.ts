import Phaser from 'phaser';

// Import stylesheets
import './style.css';

/* ----------------------------------- START SCENE --------------------------------- */
class BootLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'BootLevel' });
  }

  preload() {
    // CHANGE BASE URL!!!!
    this.add.text(20, 20, 'Boot Sequence Initiated.');
    this.load.baseURL = 'https://jsnyder116.github.io/My-Starter-Boiler-plate/';
    this.load.bitmapFont({
      key: 'Shadowsintolightfontgreen',
      textureURL: 'static/assets/font/Shadowsintolightfontgreen.png',
      fontDataURL: 'static/assets/font/Shadowsintolightfontorange.xml',
    });
    this.load.image('logo', 'static/assets/pumpkinlogo2.png');
    this.load.image('splashscreen', 'static/assets/pumpkinlogo2.png');
  }

  create() {
    this.scene.start('SplashLevel');
  }
}

/* ----------------------------------- START SCENE --------------------------------- */
class SplashLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashLevel' });
  }

  preload() {
    //const splashScreen = this.add.image(200, 200, 'splashscreen');

    const logo = this.add.image(500, 400, 'logo');
    logo.setScale(0.7);
    this.logo = logo;

    const text1 = this.add.bitmapText(
      400,
      400,
      'Shadowsintolightfontgreen',
      'Pumpkin Programming',
      80
    );
    this.companyLine1 = text1;
    const text2 = this.add.bitmapText(
      400,
      400,
      'Shadowsintolightfontgreen',
      '',
      45
    );
    this.companyLine2 = text2;

    const loading = this.add.text(15, 70, ['Loading...not really'], {
      fontFamily: 'Shadowsintolight',
      fontSize: '60px',
      color: 'white',
    });

    /* START PRELOAD ITEMS */
    this.load.baseURL =
      'https://jsnyder116.github.io/asteroids-jas-0116102010333-4gyx8n-9ypzi5/';
    this.load.image('ship', 'static/assets/Asteroids ship.png');
    /* END PRELOAD ITEMS */
  }
  private logo: Phaser.GameObjects.Image;
  private companyLine1: Phaser.GameObjects.BitmapText;
  private companyLine2: Phaser.GameObjects.BitmapText;

  create() {
    this.tweens.add({
      targets: this.logo, //your image that must spin
      rotation: 2 * Math.PI, //rotation value must be radian
      ease: 'Bounce',
      delay: 600,
      duration: 1000, //duration is in milliseconds
    });

    this.tweens.add({
      targets: this.companyLine1, //your image that must spin
      x: '175',
      y: '590',
      ease: 'Bounce',
      duration: 1600, //duration is in milliseconds
    });
    this.tweens.add({
      targets: this.companyLine2, //your image that must spin
      x: '650',
      y: '325',
      ease: 'Elastic',
      duration: 500, //duration is in milliseconds
    });

    setTimeout(() => {
      this.scene.start('MainLevel');
    }, 4000);
  }

  update() {}
}

/* ----------------------------------- MAIN SCENE --------------------------------- */

class MainLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'MainLevel' });
  }

  preload() {
    this.physics.add.sprite(500, 400, 'Asteroids ship.png');
  }

  create() {}

  update() {}
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  backgroundColor: '#ffb64f',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [BootLevel, SplashLevel, MainLevel],
};

const game = new Phaser.Game(config);
