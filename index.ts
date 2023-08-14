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

    const logo = this.add.image(400, 300, 'logo');
    logo.setScale(0.7);
    this.logo = logo;

    const text1 = this.add.bitmapText(
      200,
      200,
      'Shadowsintolightfontgreen',
      'Pumpkin Programming',
      60
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

    const loading = this.add.text(0, 0, ['Loading...not really'], {
      fontFamily: 'Shadowsintolight',
      fontSize: '40px',
      color: 'white',
    });

    /* START PRELOAD ITEMS */
    this.load.baseURL =
      'https://jsnyder116.github.io/asteroids-jas-0116102010333-4gyx8n-9ypzi5/';
    this.load.image('ship', 'static/assets/ship.png');
    this.load.image('asteroid', 'static/piskel image/Asteroid Piskel.png');
    this.load.image('bullet', 'static/piskel image/Bullet Piskel.png');
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
      y: '500',
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
  private ship: Phaser.GameObjects.Sprite;
  private asteroids: Phaser.Physics.Arcade.Group;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private bullet: Phaser.GameObjects.Sprite;
  private bulletActive: boolean = false;

  constructor() {
    super({ key: 'MainLevel' });
  }

  preload() {}

  create() {
    this.physics.world.setBounds(0, 0, 800, 600);

    this.add.graphics().fillStyle(0x000000, 1).fillRect(0, 0, 800, 600);
    this.add.graphics().lineStyle(1, 0xffffff).strokeRect(0, 0, 800, 600);
    var randomNumberx = Phaser.Math.Between(0, 800);
    var randomNumbery = Phaser.Math.Between(0, 600);
    var randomNumber = Phaser.Math.Between(0, 100);

    const ship = this.physics.add.sprite(400, 300, 'ship');

    const cursorKeys = this.input.keyboard.createCursorKeys();
    this.cursorKeys = cursorKeys;
    this.ship = ship;

    this.asteroids = this.physics.add.group({
      key: 'asteroid',
      repeat: 10, // Create 9 additional asteroids
      setXY: { x: Phaser.Math.Between(0, 800), y: Phaser.Math.Between(0, 600), stepX: 80 }, // Adjust spacing between asteroids
    });

    this.asteroids.children.iterate((asteroid) => {
      var randomAngle = Phaser.Math.Between(1, 360);
      asteroid.angle = randomAngle;
    });
    this.physics.add.collider(
      ship,
      this.asteroids,
      this.handleCollision,
      null,
      this
    );

    this.bullet = this.physics.add.sprite(-100, -100, 'bullet');
  }

  update() {
    this.moveSprite();
    this.moveAsteroid();
    this.checkBoundary();
    if (this.bulletActive) {
      this.moveBullet();

      this.physics.overlap(
        this.bullet,
        this.asteroids,
        this.handleBulletAsteroidCollision,
        null,
        this
      );

      if (
        this.bullet.x < 0 ||
        this.bullet.x > 800 ||
        this.bullet.y < 0 ||
        this.bullet.y > 600
      ) {
        this.resetBullet();
      }
    }
  }
  moveAsteroid() {
    this.asteroids.children.iterate((asteroid) => {
      this.moveForward(asteroid, 1);
      if (asteroid.x >= 800) {
        asteroid.x -= 800;
      }
      if (asteroid.x <= 0) {
        asteroid.x += 800;
      }

      if (asteroid.y >= 600) {
        asteroid.y -= 600;
      }

      if (asteroid.y <= 0) {
        asteroid.y += 600;
      }
    });
  }
  moveBullet() {
    this.moveForward(this.bullet, 5);
  }
  spawnBullet() {
    const angleRad = (this.ship.angle - 90) * (Math.PI / 180);
    const offsetX = Math.cos(angleRad) * 40;
    const offsetY = Math.sin(angleRad) * 40;

    this.bullet.setTexture('bullet'); // Set the texture to the loaded bullet image
    this.bullet.setPosition(this.ship.x + offsetX, this.ship.y + offsetY);
    this.bullet.angle = this.ship.angle;
    this.bullet.setVelocity(Math.cos(angleRad) * 300, Math.sin(angleRad) * 300);

    this.bulletActive = true;
  }
  handleBulletAsteroidCollision(bullet, asteroid) {
    // Handle bullet-asteroid collision here
    this.resetBullet();
    
    asteroid.destroy(); // Destroy the asteroid on collision
    const _asteroid = this.physics.add.sprite(0, 0, 'asteroid');
    var randomAngle = Phaser.Math.Between(1, 360);
    _asteroid.angle = randomAngle;
    this.asteroids.add(_asteroid);
    
  }
  resetBullet() {
    this.bullet.setPosition(-100, -100);
    this.bullet.setVelocity(0, 0);
    this.bulletActive = false;
  }
  moveSprite() {
    if (this.cursorKeys.up.isDown) {
      this.moveForward(this.ship, 1);
    }

    if (this.cursorKeys.right.isDown) {
      this.ship.angle += 2;
    }

    if (this.cursorKeys.left.isDown) {
      this.ship.angle -= 2;
    }
    if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown
    ) {
      if (!this.bulletActive) {
        this.spawnBullet();
      }
    }
  }

  moveForward(gameObject, speed = 1) {
    const angleRad = (gameObject.angle - 90) * (Math.PI / 180);
    gameObject.x = gameObject.x + 1 * Math.cos(angleRad) * speed;
    gameObject.y = gameObject.y + 1 * Math.sin(angleRad) * speed;
  }

  checkBoundary() {
    if (this.ship.x >= 800) {
      this.ship.x -= 800;
    }

    if (this.ship.x <= 0) {
      this.ship.x += 800;
    }

    if (this.ship.y >= 600) {
      this.ship.y -= 600;
    }

    if (this.ship.y <= 0) {
      this.ship.y += 600;
    }
    if (this.ship.x >= 800) {
      this.ship.x -= 800;
    }
  }

  private handleCollision(ship, asteroid) {
    console.log('Collision detected between ship and asteroids!');
    this.scene.start('MainLevel');
    // Implement collision handling logic here
    // For example, you can restart the level, decrease health, etc.
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#ffb64f',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [BootLevel, SplashLevel, MainLevel],
};

const game = new Phaser.Game(config);
