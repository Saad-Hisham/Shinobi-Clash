import './style.css'
import Phaser, { HEADLESS, Physics, Scene } from 'phaser'

const sizes = {
  width: 1080,
  height: 500
}
const speedDown = 900
let animationKey = "idle"
const runSpeed = 300
class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game")
    this.player
    this.groundGroup
    this.sky
    this.onGround
    this.x
    this.groundCollider
    this.enemies = [];
    this.enemiesArray = [];
    this.lastTime = 0;
    this.shurikens = [];
    this.health = 5;
    this.isAttacking = false;
    this.attackCounter = 0;
    this.isRunning = false;
    this.knight;
    this.knightHealth = 5;
    this.Blood;
    this.playershurikens = [];
    this.shurikensCount = 5;
    this.isThrowing = false;
    this.iconShurk = [{ x: 1295, y: 240, type: "shurkien" }, { x: 1510 + 50, y: 0, type: "heal" }]
    this.healthBottles = 1;
    this.flyingDemons = [{ x: 4000, y: 220 }, { x: 5000, y: 150 }, { x: 6000, y: 150 }];
    this.demonShots = [];
    this.lastHeavyHitTime = 0; // Cooldown for heavy taking damage
    this.lastHeavyDamageTime = 0; // Cooldown for heavy dealing damage
    this.heavyHeartsGroup = null; // Initialize heavyHeartsGroup
    this.heavyHealth = 10; // Initialize heavyHealth
  }

  preload() {
    this.load.audio('getHit', "/assets/sounds/Something being hit - Sound Effect.mp3");
    this.load.audio('hurt', "/assets/sounds/hurt.mp3");
    this.load.audio('hurt', "/assets/sounds/hurt.mp3");
    this.load.audio('sc', "/assets/sounds/sc.mp3");
    this.load.audio('sw1', "/assets/sounds/sw1.mp3");
    this.load.audio('sw2', "/assets/sounds/sw2.mp3");
    this.load.audio('sw3', "/assets/sounds/sw3.mp3");
    this.load.audio('run', "/assets/sounds/run.mp3");
    this.load.audio('bs', "/assets/sounds/Blood Spill Sound Effect (mp3cut.net).mp3");
    this.load.audio('fd', "/assets/sounds/Female Choking Sound Effect (HD) (mp3cut.net).mp3");






    this.load.spritesheet("idle", "/assets/player/IDLE.png", {
      frameWidth: 96,
      frameHeight: 96
    })

    this.load.spritesheet("run", "/assets/player/RUN.png", {
      frameWidth: 96,
      frameHeight: 96
    })

    this.load.spritesheet("attack", "/assets/player/sSamuraiAtk1.png", {
      frameWidth: 97,
      frameHeight: 96
    })
    this.load.spritesheet("attackTwo", "/assets/player/sSamuraiAtk2.png", {
      frameWidth: 96,
      frameHeight: 96
    })
    this.load.spritesheet("attackThree", "/assets/player/sSamuraiAtk3.png", {
      frameWidth: 97,
      frameHeight: 96
    })
    this.load.spritesheet("hurt", "/assets/player/HURT.png", {
      frameWidth: 96,
      frameHeight: 96
    })

    this.load.spritesheet("dash", "/assets/player/sSamuraiDash.png", {
      frameWidth: 96,
      frameHeight: 96
    })
    this.load.spritesheet("deff", "/assets/player/sSamuraiDefend.png", {
      frameWidth: 96,
      frameHeight: 96
    })
    this.load.spritesheet("throwShurkien", "/assets/player/sSamuraiThrow.png", {
      frameWidth: 96,
      frameHeight: 96
    })
    this.load.spritesheet("heal", "/assets/player/sSamuraiHeal.png", {
      frameWidth: 96,
      frameHeight: 96
    })


    this.load.spritesheet("shurkiendude", "/assets/enemy/shurkien/shuriken-dude.png", {
      frameWidth: 720 / 9,
      frameHeight: 64
    })

    this.load.spritesheet("KnightIdle", "/assets/enemy/knight/Idle/Idle-Sheet.png", {
      frameWidth: 64,
      frameHeight: 80
    })

    this.load.spritesheet("KnightRun", "/assets/enemy/knight/Run/Run-Sheet.png", {
      frameWidth: 80,
      frameHeight: 80
    })

    this.load.spritesheet("HeavyRun", "/assets/enemy/heavy/Run/Run.png", {
      frameWidth: 96,
      frameHeight: 93
    })

    this.load.spritesheet("KnightAttack", "/assets/enemy/knight/Attack-01/Attack-01-Sheet.png", {
      frameWidth: 96,
      frameHeight: 80
    })


    this.load.spritesheet("heavyAttack", "/assets/enemy/heavy/Attack/Attack.png", {
      frameWidth: 96,
      frameHeight: 93
    })


    this.load.spritesheet("KnightHurt", "/assets/enemy/knight/hurt/Idle-Sheet.png", {
      frameWidth: 64,
      frameHeight: 80
    })

    this.load.spritesheet("KnightDie", "/assets/enemy/knight/Dead/Dead-Sheet.png", {
      frameWidth: 80,
      frameHeight: 64
    })

    this.load.spritesheet('Blood', '/assets/skills/blood.png', {
      frameWidth: 512,
      frameHeight: 512
    });

    this.load.spritesheet("HeavyIdle", "/assets/enemy/heavy/Idle/Idle.png", {
      frameWidth: 96,
      frameHeight: 93
    })

    this.load.spritesheet('shurk', "/assets/player/sSamuraiShurikenCloned.png", {
      frameWidth: 48 / 4,
      frameHeight: 12
    });


    this.load.spritesheet('tornado', "/assets/skills/tornado.png", {
      frameWidth: 1048 / 4,
      frameHeight: 210
    });

    this.load.spritesheet('throwTornado', "/assets/player/ATTACK 1.png", {
      frameWidth: 96,
      frameHeight: 96
    });

    this.load.spritesheet('potion', "/assets/skills/potion.png", {
      frameWidth: 425,
      frameHeight: 506
    });

    this.load.spritesheet('DemonIdle', "/assets/enemy/Fly demon/IDLE.png", {
      frameWidth: 81,
      frameHeight: 71
    });

    this.load.spritesheet('DemonDeath', "/assets/enemy/Fly demon/DEATH.png", {
      frameWidth: 81,
      frameHeight: 71
    });

    this.load.spritesheet('DemonAttack', "/assets/enemy/Fly demon/ATTACK.png", {
      frameWidth: 81,
      frameHeight: 71
    });
    this.load.image("ground", "/assets/envoirment/ground-2.png")
    this.load.image("sky", "/assets/envoirment/sky.png")
    this.load.image("stone", "/assets/envoirment/stone.png")
    this.load.image("lower-stone", "/assets/envoirment/lower-stone.png")
    this.load.image("earth", "/assets/envoirment/earth.png")
    this.load.image("stont-w-g", "/assets/envoirment/stont-w-g.png")
    this.load.image("grass", "/assets/envoirment/grass.png")
    this.load.image("lower-grass", "/assets/envoirment/lower-grass.png")
    this.load.image("sea", "/assets/envoirment/sea.png")
    this.load.image("clouds", "/assets/envoirment/clouds.png")
    this.load.image("cave", "/assets/envoirment/cave.png")
    this.load.image("land", "/assets/envoirment/far-grounds.png")
    this.load.image("clif", "/assets/envoirment/clif.png")
    this.load.image("wood-l", "/assets/envoirment/wood-left.png")
    this.load.image("wood-m", "/assets/envoirment/wood-mid.png")
    this.load.image("wood-r", "/assets/envoirment/wood-right.png")
    this.load.image("lower-ground", "/assets/envoirment/lower-ground.png")
    this.load.image("tree", "/assets/envoirment/tree.png")
    this.load.image("cave-edge", "/assets/envoirment/cave-edge.png")
    this.load.image("rock", "/assets/envoirment/rock.png")
    this.load.image("heart", "/assets/player/heart.png")
    this.load.image("shurkicon", "/assets/skills/sSamuraiShurikenCloned.png")
    this.load.image("icon", "/assets/skills/lcon.png")
    this.load.image("shot", "/assets/enemy/Fly demon/projectile.png")



  }


  drawPlayer() {
    // Clear existing groups if they exist
    if (this.heartsGroup) {
      this.heartsGroup.clear(true, true);
    } else {
      this.heartsGroup = this.add.group();
    }

    if (this.shurikenGroup) {
      this.shurikenGroup.clear(true, true);
    } else {
      this.shurikenGroup = this.add.group();
    }

    if (this.bottleGroup) {
      this.bottleGroup.clear(true, true);
    } else {
      this.bottleGroup = this.add.group();
    }

    if (this.iconGroup) {
      this.iconGroup.clear(true, true);
    } else {
      this.iconGroup = this.add.group();
    }



    // Draw hearts
    for (let i = 0; i < this.health; i++) {
      let heart = this.add.image(95 + i * 30, 30, 'heart').setScale(0.04); // Adjusted Y to 70
      this.heartsGroup.add(heart);
    }

    // Draw shuriken icon and count
    let shurikenIcon = this.add.image(90, 55, 'shurkicon').setScale(1); // Adjusted Y to 110
    let shurikenCountText = this.add.text(100, 48, `${this.shurikensCount}`, { // Adjusted Y to 100
      fontSize: '10px',
      color: '#000000',
      fontFamily: 'Arial'
    }).setOrigin(0, 0);
    this.shurikenGroup.add(shurikenIcon);
    this.shurikenGroup.add(shurikenCountText);

    // Draw health bottle icon and count
    let bottleIcon = this.add.image(90 + 30, 55, 'potion').setScale(0.03); // Adjusted Y to 150
    let bottleCountText = this.add.text(100 + 30, 48, `${this.healthBottles}`, { // Adjusted Y to 140
      fontSize: '10px',
      color: '#000000',
      fontFamily: 'Arial'
    }).setOrigin(0, 0);
    this.bottleGroup.add(bottleIcon);
    this.bottleGroup.add(bottleCountText);
  }

  drawKnightHearts() {
    // Clear existing hearts if they exist
    if (this.knightHeartsGroup) {
      this.knightHeartsGroup.clear(true, true);
    } else {
      this.knightHeartsGroup = this.add.group();
    }

    // Calculate full hearts and check for half heart
    const fullHearts = Math.floor(this.knightHealth);
    const hasHalfHeart = this.knightHealth % 1 >= 0.5;

    // Calculate total width for centering
    const totalHearts = fullHearts + (hasHalfHeart ? 1 : 0);
    const heartSpacing = 20;
    const totalWidth = (totalHearts - 1) * heartSpacing;

    // Draw full hearts
    for (let i = 0; i < fullHearts; i++) {
      let heart = this.add.image(
        this.knight.x - totalWidth / 2 + (i * heartSpacing), // Center all hearts
        this.knight.y - this.knight.displayHeight / 2 - 10,  // Position above head
        'heart'
      ).setScale(0.033);
      heart.setOrigin(0.5, 0.5); // Consistent origin for all hearts
      this.knightHeartsGroup.add(heart);
    }

    // Draw half heart if applicable
    if (hasHalfHeart) {
      let halfHeart = this.add.image(
        this.knight.x - totalWidth / 2 + (fullHearts * heartSpacing), // Position right after last full heart
        this.knight.y - this.knight.displayHeight / 2 - 10,          // Same Y position
        'heart'
      ).setScale(0.033);

      // Crop to show only left half of the heart
      halfHeart.setCrop(0, 0, halfHeart.width / 2, halfHeart.height);
      halfHeart.setOrigin(0.25, 0.5); // Adjust origin to align left edge properly (0.25 because we're showing half)
      this.knightHeartsGroup.add(halfHeart);
    }
  }



  drawHeavyHearts() {
    // Clear existing hearts if they exist
    if (this.heavyHeartsGroup) {
      this.heavyHeartsGroup.clear(true, true);
    } else {
      this.heavyHeartsGroup = this.add.group();
    }

    // Calculate full hearts and check for half heart
    const fullHearts = Math.floor(this.heavyHealth);
    const hasHalfHeart = this.heavyHealth % 1 >= 0.5;

    // Calculate total width for centering
    const totalHearts = fullHearts + (hasHalfHeart ? 1 : 0);
    const heartSpacing = 20;
    const totalWidth = (totalHearts - 1) * heartSpacing;

    // Draw full hearts
    for (let i = 0; i < fullHearts; i++) {
      let heart = this.add.image(
        this.heavy.x - totalWidth / 2 + (i * heartSpacing), // Center all hearts
        this.heavy.y - this.heavy.displayHeight / 2 - 10,  // Position above head
        'heart'
      ).setScale(0.033);
      heart.setOrigin(0.5, 0.5); // Consistent origin for all hearts
      this.heavyHeartsGroup.add(heart);
    }

    // Draw half heart if applicable
    if (hasHalfHeart) {
      let halfHeart = this.add.image(
        this.heavy.x - totalWidth / 2 + (fullHearts * heartSpacing), // Position right after last full heart
        this.heavy.y - this.heavy.displayHeight / 2 - 10,          // Same Y position
        'heart'
      ).setScale(0.033);

      // Crop to show only left half of the heart
      halfHeart.setCrop(0, 0, halfHeart.width / 2, halfHeart.height);
      halfHeart.setOrigin(0.25, 0.5); // Adjust origin to align left edge properly (0.25 because we're showing half)
      this.heavyHeartsGroup.add(halfHeart);
    }
  }

  demonCollision(player, demon) {
    const currentTime = this.time.now;

    if (this.isAttacking &&
      (player.anims.currentAnim?.key === "attack" ||
        player.anims.currentAnim?.key === "attackTwo" ||
        player.anims.currentAnim?.key === "attackThree")) {
      const playerFacingDemon =
        (player.flipX && demon.x < player.x) ||
        (!player.flipX && demon.x > player.x);

      if (playerFacingDemon) {
        demon.play("DemonDeath", true);


      }
    } else if (!this.lastDamageTime || currentTime - this.lastDamageTime > 500) {
      if (demon.texture.key == "DemonDeath" != true) {
        this.applyDamage(player);
        demon.play("DemonDeath", true);
        this.lastDamageTime = currentTime;
      }

    }

    demon.once('animationcomplete-DemonDeath', () => {
      if (demon && demon.active) {
        demon.destroy();
        const index = this.flyingDemons.indexOf(demon);
        if (index > -1) {
          this.flyingDemons.splice(index, 1);
        }
      }
    });

  }


  handleDemonShotHit(player, shot) {
    const currentTime = this.time.now;

    // Apply damage with cooldown to prevent rapid hits
    if (!this.lastDamageTime || currentTime - this.lastDamageTime > 500) {
      this.applyDamage(player); // Reuse your existing damage function
      this.lastDamageTime = currentTime;
    }

    // Destroy the shot on hit
    shot.destroy();
    const index = this.demonShots.indexOf(shot);
    if (index !== -1) {
      this.demonShots.splice(index, 1);
    }
  }
  create() {
    this.getHit = this.sound.add('getHit');
    this.hurt = this.sound.add('hurt');
    this.sc = this.sound.add('sc');
    this.sw1 = this.sound.add('sw1', {
      volume: 0.5
    });
    this.bs = this.sound.add('bs', {
      volume: 0.5
    });
    this.fd = this.sound.add('fd', {
      volume: 5
    });
    this.sw2 = this.sound.add('sw2');
    this.sw3 = this.sound.add('sw3');
    this.run = this.sound.add('run', {
      loop: true,
      volume: 0.5
    });

    this.x = 0

    this.cursor = this.input.keyboard.createCursorKeys();
    this.cursor.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.cursor.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);


    this.onGround = false
    const idle = {
      key: "idle",
      frames: this.anims.generateFrameNumbers("idle", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }),
      frameRate: 16,
      repeat: -1

    }

    const run = {
      key: "run",
      frames: this.anims.generateFrameNumbers("run", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }),
      frameRate: 20,
      repeat: -1

    }

    const attack = {
      key: "attack",
      frames: this.anims.generateFrameNumbers("attack", { frames: [0, 1, 2, 3] }),
      frameRate: 22,
      repeat: 0
    }


    const attackTwo = {
      key: "attackTwo",
      frames: this.anims.generateFrameNumbers("attackTwo", { frames: [0, 1, 2, 3, 4] }),
      frameRate: 22,
      repeat: 0
    }


    const attackThree = {
      key: "attackThree",
      frames: this.anims.generateFrameNumbers("attackThree", { frames: [0, 1, 2, 3] }),
      frameRate: 22,
      repeat: 0
    }
    const throwTornado = {
      key: "throwTornado",
      frames: this.anims.generateFrameNumbers("throwTornado", { frames: [0, 1, 2, 3, 4, 5, 6] }),
      frameRate: 15,
      repeat: 0
    }

    const DemonIdle = {
      key: "DemonIdle",
      frames: this.anims.generateFrameNumbers("DemonIdle", { frames: [0, 1, 2, 3] }),
      frameRate: 15,
      repeat: -1
    }

    const DemonDeath = {
      key: "DemonDeath",
      frames: this.anims.generateFrameNumbers("DemonDeath", { frames: [0, 1, 2, 3, 4, 5, 6] }),
      frameRate: 15,
      repeat: 0,
    }
    const DemonAttack = {
      key: "DemonAttack",
      frames: this.anims.generateFrameNumbers("DemonAttack", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
      frameRate: 15,
      repeat: 0,
    }
    const potion = {
      key: "potion",
      frames: this.anims.generateFrameNumbers("potion", { frames: [0, 1, 2, 3, 4, 5] }),
      frameRate: 15,
      repeat: -1
    }


    const hurt = {
      key: "hurt",
      frames: this.anims.generateFrameNumbers("hurt", { frames: [0, 1, 2, 3] }),
      frameRate: 10,
      repeat: 0,
    }

    const KnightIdle = {
      key: "KnightIdle",
      frames: this.anims.generateFrameNumbers("KnightIdle", { frames: [0, 1, 2, 3] }),
      frameRate: 10,
      repeat: -1,
    }
    const HeavyIdle = {
      key: "HeavyIdle",
      frames: this.anims.generateFrameNumbers("HeavyIdle", { frames: [0, 1, 2, 3, 4, 5] }),
      frameRate: 10,
      repeat: -1,
    }

    const KnightRun = {
      key: "KnightRun",
      frames: this.anims.generateFrameNumbers("KnightRun", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
      frameRate: 20,
      repeat: -1,
    }

    const HeavyRun = {
      key: "HeavyRun",
      frames: this.anims.generateFrameNumbers("HeavyRun", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
      frameRate: 20,
      repeat: -1,
    }

    const heavyAttack = {
      key: "heavyAttack",
      frames: this.anims.generateFrameNumbers("heavyAttack", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }),
      frameRate: 20,
      repeat: 0,
    }

    const KnightAttack1 = {
      key: "KnightAttack1",
      frames: this.anims.generateFrameNumbers("KnightAttack", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0,
    }

    const KnightAttack2 = {
      key: "KnightAttack2",
      frames: this.anims.generateFrameNumbers("KnightAttack", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: 0,
    }

    const KnightHurt = {
      key: "KnightHurt",
      frames: this.anims.generateFrameNumbers("KnightHurt", { frames: [0, 1, 2, 3] }),
      frameRate: 10,
      repeat: 0,
    }
    const KnightDie = {
      key: "KnightDie",
      frames: this.anims.generateFrameNumbers("KnightDie", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
      frameRate: 5,
      repeat: 0,
    }

    const dash = {
      key: "dash",
      frames: this.anims.generateFrameNumbers("dash", { frames: [0, 1, 2, 3,] }),
      frameRate: 10,
      repeat: 0,
    }
    const deff = {
      key: "deff",
      frames: this.anims.generateFrameNumbers("deff", { start: 4, end: 5 }),
      frameRate: 5,
      repeat: -1,
    }
    const reflect = {
      key: "reflect",
      frames: this.anims.generateFrameNumbers("deff", { start: 1, end: 5 }),
      frameRate: 10,
      repeat: 0,
    }
    const throwShurkien = {
      key: "throwShurkien",
      frames: this.anims.generateFrameNumbers("throwShurkien", { frames: [0, 1, 2, 3, 4, 5, 6] }),
      frameRate: 30,
      repeat: 0,
    }

    const heal = {
      key: "heal",
      frames: this.anims.generateFrameNumbers("heal", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }),
      frameRate: 15,
      repeat: 0,
    }
    const shurkiendude = {
      key: "shurkiendude",
      frames: this.anims.generateFrameNumbers("shurkiendude", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
      frameRate: 10,
      repeat: 0,
    }

    const shuriken = {
      key: "shuriken",
      frames: this.anims.generateFrameNumbers("shurk", { frames: [0, 1, 2, 3] }),
      frameRate: 120,
      repeat: -1
    }


    const Blood = {
      key: "Blood",
      frames: this.anims.generateFrameNumbers("Blood", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }),
      frameRate: 15,
      repeat: 0,
    }
    const shurk = {
      key: "shurk",
      frames: this.anims.generateFrameNumbers("shurk", { frames: [0, 1, 2, 3] }),
      frameRate: 35,
      repeat: -1,
    }

    const tornado = {
      key: "tornado",
      frames: this.anims.generateFrameNumbers("tornado", { frames: [0, 1, 2, 3] }),
      frameRate: 25,
      repeat: -1,
    }
    this.anims.create(idle)
    this.anims.create(run)
    this.anims.create(attack)
    this.anims.create(attackTwo)
    this.anims.create(attackThree)
    this.anims.create(hurt)
    this.anims.create(dash)
    this.anims.create(deff)
    this.anims.create(shurkiendude)
    this.anims.create(shuriken)
    this.anims.create(KnightIdle)
    this.anims.create(HeavyIdle)
    this.anims.create(KnightHurt)
    this.anims.create(KnightDie)
    this.anims.create(KnightRun)
    this.anims.create(HeavyRun)
    this.anims.create(heavyAttack)
    this.anims.create(KnightAttack1)
    this.anims.create(KnightAttack2)
    this.anims.create(reflect)
    this.anims.create(Blood)
    this.anims.create(throwShurkien)
    this.anims.create(shurk)
    this.anims.create(tornado)
    this.anims.create(throwTornado)
    this.anims.create(heal)
    this.anims.create(potion)
    this.anims.create(DemonIdle)
    this.anims.create(DemonDeath)
    this.anims.create(DemonAttack)












    // sky creation

    // Background sky
    this.add.image(0, 0, "sky").setOrigin(0, 0).setScale(10, 2);
    this.cloudsGroup = this.add.group();
    const cloudWidth = 544;
    const screenWidth = this.sys.game.config.width * 6;

    for (let i = 0, x = 0; x < screenWidth; x += cloudWidth, i++) {

      this.cloudsGroup.create(x, 200, "clouds")
        .setOrigin(0, 0)
    }


    this.skyGroup = this.add.group();
    const seaWidth = 112;
    this.skyGroup.create(1460, sizes.height - 150, "land")

    for (let x = 0; x < screenWidth * 2; x += seaWidth) {
      this.skyGroup.create(x, this.sys.game.config.height - 130, "sea")
        .setOrigin(0, 0)
        .setScale(1, 1.4);
    }

    // ground creationg
    this.groundGroup = this.add.group();

    const groundElements = [
      { x: 0, yOffset: sizes.height + 70, key: "cave", flipX: false, scaleX: 1.2, scaleY: .6 },
      { x: 20, yOffset: 167, key: "land", flipX: true, scaleX: 2, scaleY: 2 },
      { x: 30, yOffset: 80, key: "lower-stone", flipX: true, scaleX: 1, scaleY: 122.2233 },
      { x: 60, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 1, scaleY: 1.33 },
      { x: 0, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 1, scaleY: 1.33 },
      { x: 226, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 2, scaleY: 3.33 },
      { x: 255, yOffset: 80, key: "lower-stone", flipX: true, scaleX: 1, scaleY: 5.33 },
      { x: 284, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 1, scaleY: 2.33 },
      { x: 313, yOffset: 80, key: "lower-stone", flipX: true, scaleX: 1, scaleY: 5.33 },
      { x: 342, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 1, scaleY: 1.33 },
      { x: 371, yOffset: 80, key: "lower-stone", flipX: true, scaleX: 1, scaleY: 5.33 },
      { x: 400, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 1, scaleY: 5.33 },
      { x: 429, yOffset: 80, key: "lower-stone", flipX: true, scaleX: 1, scaleY: 4.33 },
      { x: 459, yOffset: 80, key: "lower-stone", flipX: true, scaleX: 1, scaleY: 1.33 },
      { x: 484, yOffset: 80, key: "lower-stone", flipX: true, scaleX: 1, scaleY: 2.33 },
      { x: 514, yOffset: 80, key: "lower-stone", flipX: true, scaleX: 2, scaleY: 3.33 },
      { x: 540, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 1, scaleY: 5.33 },
      { x: 574, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 4.1, scaleY: 5.33 },
      { x: 697, yOffset: 63, key: "lower-grass", flipX: false, scaleX: 2, scaleY: 2.1 },
      { x: 757, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 4.23, scaleY: 5.33 },
      { x: 880, yOffset: 80, key: "lower-stone", flipX: false, scaleX: 7.23, scaleY: 5.33 },



      { x: 6960, yOffset: 80, key: "lower-ground", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 513, yOffset: 90, key: "earth", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 140, yOffset: 111, key: "ground", flipX: false, scaleX: 1, scaleY: 1.1 },
      { x: 70, yOffset: 111, key: "ground", flipX: true, scaleX: 1, scaleY: 1.1 },
      { x: 0, yOffset: 100, key: "stone", flipX: false },
      { x: 14, yOffset: 100, key: "stone", flipX: true },
      { x: 45, yOffset: 100, key: "stone", flipX: false },
      { x: 226, yOffset: 100, key: "earth", flipX: false, scaleX: 1.5, scaleY: 1 },
      { x: 298, yOffset: 100, key: "earth", flipX: false, scaleX: 1.5, scaleY: 1 },
      { x: 370, yOffset: 100, key: "earth", flipX: false, scaleX: 1.5, scaleY: 1 },
      { x: 442, yOffset: 100, key: "earth", flipX: false, scaleX: 1.5, scaleY: 1 },
      { x: 514, yOffset: 130, key: "stont-w-g", flipX: false, scaleX: 1.4, scaleY: 1.4 },
      { x: 552, yOffset: 100, key: "earth", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 600, yOffset: 100, key: "earth", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 648, yOffset: 100, key: "earth", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 884, yOffset: 105, key: "earth", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 925, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 925 + 48, yOffset: 105, key: "earth", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 696, yOffset: 105, key: "stone", flipX: false, scaleX: 2, scaleY: 2 },
      { x: 756, yOffset: 105, key: "stone", flipX: true, scaleX: 2, scaleY: 2 },
      { x: 1021, yOffset: 114, key: "ground", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 820, yOffset: 147, key: "grass", flipX: true, scaleX: 2, scaleY: 2 },
      { x: 1250, yOffset: 220, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },

      { x: 1510, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 1770, yOffset: 220, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 1800, yOffset: 180, key: "land", flipX: false, scaleX: 2.5, scaleY: 2.5 },
      { x: 2000, yOffset: 114, key: "ground", flipX: false, scaleX: 1, scaleY: 1.1 },
      { x: 2089, yOffset: 70, key: "lower-grass", flipX: false, scaleX: 3, scaleY: 3 },
      { x: 2179, yOffset: 70, key: "lower-stone", flipX: true, scaleX: 1, scaleY: 1.2 },
      { x: 2209, yOffset: 70, key: "lower-stone", flipX: false, scaleX: 12, scaleY: 5.2 },
      { x: 2309, yOffset: 40, key: "lower-ground", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2089, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2089, yOffset: 270, key: "tree", flipX: false, scaleX: 1.5, scaleY: 1.5 },
      { x: 2137, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2185, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2233, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2281, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2329, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2377, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2425, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2473, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2521, yOffset: 105, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2560, yOffset: 102, key: "wood-l", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2601, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2633, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2664, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2696, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2728, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2760, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2792, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2760, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2792, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2824, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2856, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2888, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2920, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 2952, yOffset: 102, key: "wood-m", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 3000, yOffset: 110, key: "ground", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 2984, yOffset: 102, key: "wood-r", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 3250, yOffset: 220, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 3510, yOffset: 220, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 3770, yOffset: 220, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 4030, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 4300, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 4560, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 4820, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 5080, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 5340, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 5600, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 5860, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 6120, yOffset: 320, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 6420, yOffset: 220, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 6720, yOffset: 170, key: "clif", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 6920, yOffset: 102, key: "ground", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7155, yOffset: 177, key: "cave-edge", flipX: false, scaleX: 3.1, scaleY: 3.1 },
      { x: 7248, yOffset: 520, key: "cave", flipX: true, scaleX: .5, scaleY: .4 },
      { x: 7450, yOffset: 520, key: "cave", flipX: false, scaleX: .5, scaleY: .4 },

      { x: 6960 + 48, yOffset: 94, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 6960 + 48 * 2, yOffset: 94, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 6960 + 48 * 3, yOffset: 94, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 6960 + 48 * 4, yOffset: 94, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 6960 + 48 * 5, yOffset: 94, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7248, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7280, yOffset: 112, key: "stont-w-g", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7280 + 30, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7280 + 30 * 2, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7280 + 30 * 3, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7280 + 30 * 4, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7280 + 30 * 5, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7280 + 30 * 5, yOffset: 494, key: "rock", flipX: false, scaleX: 2, scaleY: 2 },
      { x: 7460, yOffset: 109, key: "ground", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7460 + 89, yOffset: 109, key: "ground", flipX: true, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 2, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 3, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 4, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 5, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 6, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 7, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 8, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 9, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 10, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 11, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 12, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 13, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 14, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 15, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 16, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 17, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 18, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 18, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 19, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 20, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 21, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 22, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 23, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 24, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 25, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 26, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 27, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 28, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 29, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 30, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 31, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 32, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 33, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 34, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 35, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 36, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 37, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 38, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 39, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 40, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 41, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 42, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 43, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 44, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 45, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 46, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 47, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 48, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 49, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 50, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 51, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 52, yOffset: 101, key: "earth", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 7549 + 48 * 53, yOffset: 101, key: "earth", flipX: false, scaleX: .6, scaleY: 1 },
      { x: 10120, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10, yOffset: 112, key: "stont-w-g", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 2, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 3, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 4, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 5, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 7, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 6, yOffset: 112, key: "stont-w-g", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 8, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 9, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 10, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 11, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 12, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 13, yOffset: 112, key: "stont-w-g", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 14, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 15, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 16, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 17, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 18, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 19, yOffset: 112, key: "stont-w-g", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 20, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 21, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 22, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 23, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 24, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 25, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 26, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 27, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 28, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 29, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 30, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 31, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 32, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 33, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 34, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 35, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 36, yOffset: 112, key: "stont-w-g", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 37, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 38, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 39, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 40, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 41, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 42, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 43, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 44, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 45, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 46, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 47, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 48, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },
      { x: 10120 + 10 + 21 * 49, yOffset: 94, key: "stone", flipX: false, scaleX: 1, scaleY: 1 },

    ];


    const baseX = 6960;
    const offsetX = 30;
    const scaleYValues = Array.from({ length: 140 }, () => Math.floor(Math.random() * (5 - 3 + 1)) + 3);


    for (let i = 1; i <= scaleYValues.length; i++) {
      groundElements.unshift({
        x: baseX + offsetX * i,
        yOffset: 80,
        key: "lower-stone",
        flipX: i % 2 === 0,
        scaleX: 1,
        scaleY: scaleYValues[i - 1]
      });
    }

    groundElements.forEach(({ x, yOffset, key, flipX, scaleX = 1, scaleY = 1 }) => {
      this.groundGroup.create(x + this.x, sizes.height - yOffset, key)
        .setOrigin(0)
        .setFlipX(flipX)
        .setScale(scaleX, scaleY);
    });

    // player hp

    this.drawPlayer();

    // player creation
    this.player = this.physics.add.sprite(100, 0 - 100, animationKey).setScale(3);
    this.player.play(animationKey, true);
    this.player.setSize(20, 30).setOffset(37, 50);


    // Female knight creation
    this.knight = this.physics.add.sprite(900, 360, "KnightIdle").setScale(1.8).setSize(30, 50).setOffset(10, 14);
    this.heavy = this.physics.add.sprite(900, 200, "HeavyIdle").setScale(2).setSize(40, 60).setOffset(30, 30);


    this.knight.flipX = true;
    this.heavy.flipX = true;
    this.heavy.play("HeavyIdle", true);


    this.knight.play("KnightIdle", true);
    this.knight.isInvulnerable = false; // Initialize invulnerability



    // demon creation
    // Create flying demons from the array
    this.flyingDemons = this.flyingDemons.map(demon => {
      const demonSprite = this.physics.add.sprite(demon.x, demon.y, "DemonIdle")
        .setScale(1)
        .setSize(30, 50)
        .setOffset(10, 14);
      let distance = Math.abs(demonSprite.x - this.player.x);


      // Initialize demon properties
      demonSprite.play("DemonIdle", true);
      demonSprite.body.allowGravity = false;
      demonSprite.baseY = demon.y; // Store base Y position for hovering
      demonSprite.attackCooldown = 0; // Add cooldown tracking
      demonSprite.hoverSpeed = 0.05; // Speed of hovering motion
      demonSprite.hoverAmplitude = 20; // How far up/down it hovers


      return demonSprite;
    });




    this.physics.add.overlap(this.player, this.flyingDemons, this.demonCollision, null, this);
    this.physics.add.overlap(this.player, this.demonShots, this.handleDemonShotHit, null, this);
    // Add collision with ground

    //
    // shurkien creation

    // Shuriken creation
    this.iconShurk = this.iconShurk.map((icon) => {
      let spriteKey = icon.type === "heal" ? "potion" : "shurkicon";
      const item = this.physics.add.sprite(icon.x, icon.y, spriteKey)
        .setScale(icon.type === "heal" ? 0.07 : 2)
        .setOffset(0, 0);
      item.type = icon.type; // Store the type for later use

      // Play potion animation if it's a heal item
      if (icon.type === "heal") {
        item.play("potion", true);
      }

      return item;
    });
    // Draw initial knight hearts
    this.drawKnightHearts();
    //
    this.drawHeavyHearts();




    this.groundColliders = [
      this.physics.add.staticSprite((sizes.width + 30) / 2, sizes.height - 90)
        .setSize(sizes.width + 30, 20)
        .setDisplaySize(sizes.width + 30, 20),
      this.physics.add.staticSprite((1000, 100)).setX(1300).setScale(3, 1).setY(300).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(1560).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(1820).setScale(3, 1).setY(300).refreshBody(),
      this.physics.add.staticSprite((2000, 100)).setX(2550).setScale(33.7, 1).setY(415).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(3250 + 50).setScale(3, 1).setY(300).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(3510 + 50).setScale(3, 1).setY(300).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(3770 + 50).setScale(3, 1).setY(300).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(4030 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(4300 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(4560 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(4820 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(5080 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(5340 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(5600 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(5860 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(6120 + 50).setScale(3, 1).setY(200).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(6420 + 50).setScale(3, 1).setY(300).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(6720 + 50).setScale(3, 1).setY(350).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(8470 + 50).setScale(100, 1).setY(425).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(9317 + 50).setScale(100, 1).setY(425).refreshBody(),
      this.physics.add.staticSprite((1000, 100)).setX(9317 * 1.1 + 50).setScale(100, 1).setY(425).refreshBody(),





    ];





    // collison
    this.groundColliders.forEach(ground => {
      this.physics.add.collider(this.player, ground, this.stopFalling, null, this);
      this.physics.add.collider(this.knight, ground, this.stopFalling, null, this);
      this.physics.add.collider(this.heavy, ground, this.stopFalling, null, this);

      this.iconShurk.forEach((icon) => {
        this.physics.add.collider(icon, ground, this.stopFalling, null, this);
        this.physics.add.collider(icon, this.player, () => {
          if (icon.type === "shurkien") {
            this.shurikensCount += 3;
          } else if (icon.type === "heal") {
            this.healthBottles += 1;
          }
          this.drawPlayer()

          icon.destroy();
        }, null, this);
      });
    });
    this.input.on('pointerdown', (pointer) => {
      this.isThrowing = false;

      if (pointer.rightButtonDown()) {
        this.isDashing = false;
        const currentAnim = this.player.anims.currentAnim?.key;
        const isAttackAnim = currentAnim === "attack" || currentAnim === "attackTwo" || currentAnim === "attackThree";
        console.log("Current animation on right-click:", currentAnim);

        if (currentAnim !== "hurt") {
          if (currentAnim !== "deff" && !isAttackAnim) { // Only defend if not attacking
            this.player.play("deff", true);
            this.player.setSize(20, 30).setOffset(this.player.flipX ? 32 : 45, 50);
          } else if (isAttackAnim && this.player.anims.currentAnim) {
            const totalFrames = this.player.anims.currentAnim.frames.length;
            const currentFrame = this.player.anims.currentFrame.index;
            const defendFrame = totalFrames - 3;

            if (currentFrame >= defendFrame) {
              this.player.play("deff", true);
              this.player.setSize(20, 30).setOffset(this.player.flipX ? 32 : 45, 50);
              // Only reset isAttacking if attack is fully complete (handled in animationcomplete)
            }
          } else {
            this.player.setSize(20, 30).setOffset(this.player.flipX ? 32 : 45, 50);
          }
        }
      }
    });

    // Ensure attack completion resets the state properly
    this.player.on('animationcomplete', (anim) => {
      if (anim.key === "attack" || anim.key === "attackTwo" || anim.key === "attackThree") {
        this.isAttacking = false;
        this.player.play("idle", true); // Default to idle unless defending
        this.player.setSize(20, 30).setOffset(40, 50);
      }
    });

    // Update attack trigger to interrupt defending if needed
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown() && this.player.texture.key !== "hurt") {
        if (!this.player.flipX) {
          this.player.setSize(49, 30).setOffset(40, 50);
        } else {
          this.player.setSize(49, 30).setOffset(15, 50);
        }
        this.player.body.updateFromGameObject();
        this.isAttacking = true;

        // Interrupt defending if active
        if (this.player.anims.currentAnim?.key === "deff") {
          this.player.stop();
        }

        switch (this.attackCounter) {
          case 0:
            this.player.play("attack", true);
            this.sw1.play();
            break;
          case 1:
            this.player.play("attackTwo", true);
            this.sw1.play();
            break;
          case 2:
            this.player.play("attackThree", true);
            this.sw1.play();
            break;
        }
        this.attackCounter = (this.attackCounter + 1) % 3;
      }
    });

    // Handle button release
    this.input.on('pointerup', (pointer) => {
      if (!pointer.rightButtonDown()) {
        const currentAnim = this.player.anims.currentAnim?.key;
        if (currentAnim === "deff" || currentAnim === "reflect") {
          this.player.play("idle", true);
          this.player.setSize(20, 30).setOffset(40, 50); // Explicitly reset to idle hitbox
        }
      }
    });



    this.input.keyboard.on('keydown-W', () => {
      this.isThrowing = false
      if (this.player.body.onFloor()) {
        this.player.setVelocityY(-600);

      }
    });

    //on complete attack
    this.player.on('animationcomplete', (anim) => {
      if (this.isAttacking || anim.key === "hurt" || anim.key === "dash" || anim.key === "deff") {
        this.isAttacking = false;
        this.player.play("idle", true);
        this.player.setSize(20, 30).setOffset(40, 50);

      }
    });
    this.physics.add.overlap(this.player, this.knight, this.checkKnightCol, null, this);
    this.physics.add.overlap(this.player, this.heavy, this.checkheavyCol, null, this);



    this.input.keyboard.on('keydown-F', () => {
      // Only throw shuriken if not already attacking, key wasn't just pressed, and shurikens are available
      if (!this.isAttacking && !this.rKeyPressed) {
        if (this.shurikensCount > 0) {
          this.isAttacking = true;
          this.rKeyPressed = true;
          this.isThrowing = true; // Set throwing flag to protect animation
          this.player.play("throwShurkien", true);

        }


        // Spawn shuriken on frame 2 and reset isAttacking
        this.player.once('animationupdate', (animation, frame) => {
          if (frame.index === 2 && animation.key === "throwShurkien") {
            const shuriken = this.physics.add.sprite(this.player.x, this.player.y + 50, 'shurk').setScale(1.5);
            shuriken.body.allowGravity = false;
            shuriken.setVelocityX(this.player.flipX ? -1000 : 1000);
            shuriken.play('shurk', true);
            this.playershurikens.push(shuriken);
            this.isAttacking = false; // Reset attacking state when shuriken leaves
            this.shurikensCount -= 1
            this.drawPlayer()

          }
        });

        // Clear throwing flag when animation completes
        this.player.once('animationcomplete-throwShurkien', () => {
          this.isThrowing = false;

        });
      }
    });

    this.input.keyboard.on('keydown-R', () => {
      if (this.healthBottles > 0 && this.player.texture.key != "heal") {

        this.player.play("heal")
        this.player.once('animationcomplete-heal', () => {
          if (this.player.texture.key == "heal") {
            this.healthBottles -= 1
            this.player.play("idle")
            this.health += 2
            this.drawPlayer()
          }


        });

      }


    });






    // 
    // Reset key press flag when R is released

    // Add this to reset the key press flag when R is released
    this.input.keyboard.on('keyup-F', () => {
      this.rKeyPressed = false;
    });
    this.physics.add.overlap(this.playershurikens, this.knight, this.shurikenHitKnight, null, this);
    this.physics.add.overlap(this.playershurikens, this.flyingDemons, this.shurikenHitDemon, null, this);


  }





  shurikenHitKnight(shuriken, knight) {
    // Don't damage if knight is dead, dying, or invulnerable
    if (this.knightHealth <= 0 ||
      knight.anims.currentAnim?.key === "KnightDie") {
      return;
    }

    const currentTime = this.time.now;
    // Use a shorter cooldown to allow multiple hits in quick succession if needed
    if (!this.lastKnightShurikenDamageTime || currentTime - this.lastKnightShurikenDamageTime > 100) {
      this.knightHealth -= 0.5;  // Keep 0.5 damage per shuriken
      this.drawKnightHearts();
      this.getHit.play();

      knight.play("KnightHurt", true);
      knight.setVelocityX(0);

      // Handle knight death
      if (this.knightHealth <= 0) {
        knight.play("KnightDie", true);
        knight.anims.pause(knight.anims.currentAnim.frames[2]);

        this.Blood = this.add.sprite(knight.x + 10, knight.y + 10, "Blood").setScale(0.2);
        this.Blood.play("Blood", true);
        this.bs.play();
        this.fd.play();

        this.Blood.knight = knight;
        knight.setOffset(30, -6);

        this.Blood.once("animationcomplete-Blood", () => {
          this.Blood.destroy();
          knight.anims.resume();
          knight.once("animationcomplete-KnightDie", () => {
            this.Blood = null;
          });
        });
      } else {
        knight.once("animationcomplete-KnightHurt", () => {
          knight.play("KnightIdle", true);
          knight.setSize(30, 50).setOffset(knight.flipX ? 10 : 22, 14);
        });
      }

      this.lastKnightShurikenDamageTime = currentTime;
    }

    // Destroy the shuriken that hit, regardless of damage timing
    shuriken.destroy();

    // Remove it from the array immediately
    const index = this.playershurikens.indexOf(shuriken);
    if (index !== -1) {
      this.playershurikens.splice(index, 1);
    }
  }

  shurikenHitDemon(shuriken, demon) {
    demon.play("DemonDeath", true)
    demon.once('animationcomplete-DemonDeath', () => {
      if (demon && demon.active) {
        demon.destroy();
        const index = this.flyingDemons.indexOf(demon);
        shuriken.destroy()
        if (index > -1) {
          this.flyingDemons.splice(index, 1);
        }
      }
    });
  }
  knightAttack() {
    const distanceToPlayer = Math.abs(this.knight.x - this.player.x);
    const currentTime = this.time.now;

    // Initialize attack timing variables if not set
    if (!this.knight.lastAttackTime) {
      this.knight.lastAttackTime = 0;
    }
    if (!this.knight.nextAttackDelay) {
      this.knight.nextAttackDelay = 0; // Start with no delay for first attack
    }

    // Conditions to skip attack
    if (
      this.knight.anims.isPlaying && this.knight.anims.currentAnim.key.includes("Attack") || // Already attacking
      distanceToPlayer > 150 // Too far to attack
    ) {
      return;
    }

    // Allow attack if cooldown has expired or it’s the first attack
    if (currentTime - this.knight.lastAttackTime < this.knight.nextAttackDelay && this.knight.lastAttackTime !== 0) {
      return; // Skip if cooldown not expired and not first attack
    }

    this.knight.isInvulnerable = true; // Set invulnerability when starting attack
    const attackSequences = [
      ["KnightAttack1"],
      ["KnightAttack1", "KnightAttack2"],
      ["KnightAttack1", "KnightAttack2", "KnightAttack1"]
    ];
    const selectedSequence = Phaser.Math.RND.pick(attackSequences);
    this.knight.lastAttackTime = currentTime;
    this.knight.nextAttackDelay = Phaser.Math.Between(1000, 2000); // Set delay for next attack
    this.playSequence([...selectedSequence], () => {
      this.knight.isInvulnerable = false; // Clear invulnerability when sequence ends
    });
  }
  // Keep playSequence updated with proper hitbox management
  playSequence(animations, onComplete) {
    if (animations.length === 0) {
      this.knight.play("KnightIdle", true);
      this.knight.setSize(30, 50).setOffset(this.knight.flipX ? 10 : 22, 14); // Reset to default hitbox
      if (onComplete) onComplete(); // Call onComplete to clear invulnerability
      return;
    }

    const currentAnim = animations.shift();

    // Configure knight's hitbox based on facing direction during attack
    if (currentAnim.includes("Attack")) {
      if (!this.knight.flipX) {
        // Facing right
        this.knight.setSize(40, 50).setOffset(40, 14); // Adjusted hitbox for attack facing right
      } else {
        // Facing left
        this.knight.setSize(40, 50).setOffset(10, 14); // Adjusted hitbox for attack facing left
      }
    } else {
      // Non-attack animations (like idle or run)
      this.knight.setSize(30, 50).setOffset(this.knight.flipX ? 10 : 22, 14);
    }

    this.knight.play(currentAnim, true);
    // Continue sequence on animation complete
    this.knight.once("animationcomplete", () => {
      this.knight.setSize(30, 50).setOffset(this.knight.flipX ? 10 : 22, 14); // Reset hitbox after each animation
      this.playSequence(animations, onComplete);
    });
  }
  checkKnightCol(player, knight) {
    const playerFacingKnight =
      (player.flipX && knight.x < player.x) ||
      (!player.flipX && knight.x > player.x);
    const currentTime = this.time.now;
    const currentAnim = knight.anims.currentAnim?.key;
    const playerAnim = player.anims.currentAnim?.key;

    // Skip if knight is already dead or dying
    if (this.knightHealth <= 0 || currentAnim === "KnightDie") {
      return;
    }

    // Check if the knight is attacking the player
    if (currentAnim?.includes("Attack")) {
      if (!this.lastDamageTime || currentTime - this.lastDamageTime > 500) {
        if (playerAnim === "deff" && playerAnim !== "reflect") {
          if (playerFacingKnight) {
            this.knightReflectCooldown = currentTime + 1000;
            this.sc.play();
            player.play("reflect", true);
            player.once("animationcomplete-reflect", () => {
              player.play("deff", true);
            });
          } else {
            this.applyDamage(player);
          }
        } else if (playerAnim !== "deff" && playerAnim !== "reflect") {
          this.applyDamage(player);
        }
        this.lastDamageTime = currentTime;
      }
    }

    // Check if the player is attacking the knight
    if (
      this.isAttacking &&
      (playerAnim === "attack" || playerAnim === "attackTwo" || playerAnim === "attackThree")
    ) {
      if (currentAnim?.includes("Attack")) {
        if (!this.lastPlayerCounterDamageTime || currentTime - this.lastPlayerCounterDamageTime > 500) {
          this.applyDamage(player);
          this.lastPlayerCounterDamageTime = currentTime;
        }
      } else if (!this.knight.isInvulnerable) {
        if (!this.lastKnightDamageTime || currentTime - this.lastKnightDamageTime > 500) {
          if (playerFacingKnight) {
            this.knightHealth -= 1;
            this.drawKnightHearts();
            this.getHit.play();
            knight.play("KnightHurt", true);
            knight.setVelocityX(0);
          }

          // Check health immediately after damage
          if (this.knightHealth <= 0) {
            knight.play("KnightDie", true);
            knight.anims.pause(knight.anims.currentAnim.frames[2]); // Pause at frame 3

            // Create and play blood effect, anchoring it to knight
            this.Blood = this.add.sprite(knight.x + 10, knight.y + 10, "Blood").setScale(0.2)
            this.Blood.play("Blood", true);
            this.bs.play();
            this.fd.play();


            this.Blood.knight = knight;
            knight.setOffset(30, -6); // Adjust offset as requested

            // Wait for blood animation to complete before resuming knight death
            this.Blood.once("animationcomplete-Blood", () => {
              this.Blood.destroy(); // Clean up blood sprite
              knight.anims.resume(); // Resume KnightDie animation from frame 3
              knight.once("animationcomplete-KnightDie", () => {
                // knight.disableBody(true, true); // Disable body after death animation
                this.Blood = null; // Reset reference
              });
            });
          } else {
            // Only set up hurt completion if knight is still alive
            knight.once("animationcomplete-KnightHurt", () => {
              knight.play("KnightIdle", true);
              knight.setSize(30, 50).setOffset(knight.flipX ? 10 : 22, 14);
            });
          }

          this.lastKnightDamageTime = currentTime;
        }
      }
    }
  }

  checkheavyCol(player, heavy) {
    const playerFacingHeavy =
      (heavy.flipX && player.x < heavy.x) ||
      (!heavy.flipX && player.x > heavy.x);
    const currentTime = this.time.now;
    const currentAnim = heavy.anims.currentAnim?.key;
    const currentFrame = heavy.anims.currentFrame?.index;
    const playerAnim = player.anims.currentAnim?.key;
    const distance = Math.abs(player.x - heavy.x);

    // Skip if heavy is dead
    if (this.heavyHealth <= 0) {
      return;
    }

    // Apply damage to player on frame 9 of heavyAttack with cooldown
    if (
      playerFacingHeavy &&
      currentAnim === "heavyAttack" &&
      currentFrame === 9 &&
      (!this.lastHeavyDamageTime || currentTime - this.lastHeavyDamageTime > 500) &&
      playerAnim !== "deff" &&
      playerAnim !== "reflect"
    ) {
      this.health -= 2;
      this.drawPlayer();
      player.play("hurt", true);
      this.hurt.play();
      player.once("animationcomplete-hurt", () => {
        player.play("idle", true);
      });
      this.lastHeavyDamageTime = currentTime;
    }

    // Apply damage to heavy on player attack animation completion
    if (playerFacingHeavy && distance <= 100) {
      // Set up listener for player attack completion
      player.once("animationcomplete", (anim) => {
        if (
          anim.key === "attack" ||
          anim.key === "attackTwo" ||
          anim.key === "attackThree"
        ) {
          // Check conditions again to ensure validity at completion
          const stillFacingHeavy =
            (heavy.flipX && player.x < heavy.x) ||
            (!heavy.flipX && player.x > heavy.x);
          const stillInRange = Math.abs(player.x - heavy.x) <= 100;
          if (
            this.heavyHealth > 0 &&
            stillInRange &&
            (!this.lastHeavyHitTime || currentTime - this.lastHeavyHitTime > 300)
          ) {
            this.heavyHealth -= 1;
            this.drawHeavyHearts();
            this.getHit.play();
            heavy.play("HeavyHurt", true);
            heavy.setVelocityX(0);
            heavy.once("animationcomplete-HeavyHurt", () => {
              heavy.play("HeavyIdle", true);
              heavy.setSize(40, 50).setOffset(heavy.flipX ? 10 : 22, 14);
            });
            this.lastHeavyHitTime = currentTime;
          }
        }
      });
    }
  }
  // Helper function to apply damage and handle hurt animation
  applyDamage(player) {
    this.health -= 1;
    this.drawPlayer();
    player.play("hurt", true);
    this.hurt.play();
    player.once("animationcomplete-hurt", () => {
      player.play("idle", true);
    });
  }
  knightHandler() {
    // Skip all logic if knight is dead or dying
    if (this.knightHealth <= 0 || this.knight.anims.currentAnim?.key === "KnightDie") {
      this.knight.setVelocityX(0); // Ensure no movement during death
      return;
    }

    // Skip movement and animation changes if knight is hurt
    if (this.knight.anims.currentAnim?.key === "KnightHurt") {
      this.knight.setVelocityX(0);
      return;
    }

    let knightFrontOfPlayer = this.knight.x > this.player.x;
    let distance = Math.abs(this.knight.x - this.player.x);

    if (knightFrontOfPlayer) {
      this.knight.flipX = true;

      if (distance <= 700 || this.knightHealth < 5) {
        if (distance > 70) {
          this.knight.setVelocityX(-350);
          if (!this.knight.anims.currentAnim?.key.includes("Attack")) {
            this.knight.play("KnightRun", true);
            this.knight.setSize(30, 50).setOffset(20, 14);
          }
        } else {
          this.knight.setVelocityX(0);
          this.knightAttack();
        }
      } else {
        this.knight.setVelocityX(0);
        if (!this.knight.anims.currentAnim?.key.includes("Attack")) {
          this.knight.play("KnightIdle", true);
          this.knight.setSize(30, 50).setOffset(10, 14);
        }
      }
    } else {
      this.knight.flipX = false;

      if (distance <= 700 && this.knight.x <= this.groundColliders[0].x + 500) {
        if (distance > 70) {
          this.knight.setVelocityX(350);

          if (!this.knight.anims.currentAnim?.key.includes("Attack")) {
            this.knight.play("KnightRun", true);
            this.knight.setSize(30, 50).setOffset(30, 14);

          }
        } else {
          this.knight.setVelocityX(0);
          this.knightAttack();
        }
      } else {
        this.knight.setVelocityX(0);
        if (!this.knight.anims.currentAnim?.key.includes("Attack")) {
          this.knight.play("KnightIdle", true);
          this.knight.setSize(30, 50).setOffset(22, 14);
        }
      }
    }
  }
  heavyHandler() {
    // Skip if heavy is dead
    if (this.heavyHealth <= 0) {
      this.heavy.setVelocityX(0);
      return;
    }

    let heavyFrontOfPlayer = this.heavy.x > this.player.x;
    let distance = Math.abs(this.heavy.x - this.player.x);
    const currentTime = this.time.now;

    // Initialize last attack time if not set
    if (!this.heavy.lastAttackTime) {
      this.heavy.lastAttackTime = 0;
    }

    // Rest period after attack
    if (currentTime - this.heavy.lastAttackTime < 5000) {
      this.heavy.setVelocityX(0);
      if (this.heavy.anims.currentAnim?.key !== "heavyAttack") {
        this.heavy.play("HeavyIdle", true);
      }
      return;
    }

    if (distance <= 700) { // Detection range
      if (heavyFrontOfPlayer) {
        this.heavy.flipX = true;
        if (distance > 70) { // Run until close
          this.heavy.setVelocityX(-350);
          this.heavy.play("HeavyRun", true);
          this.heavy.setSize(40, 60).setOffset(30, 30);


        } else { // Attack when close
          this.heavy.setVelocityX(0);
          if (this.heavy.anims.currentAnim?.key !== "heavyAttack") {
            this.heavy.play("heavyAttack", true);
            this.heavy.setSize(60, 60).setOffset(10, 30);
            this.heavy.lastAttackTime = currentTime; // Start rest
            // Transition to idle after attack
            this.heavy.once('animationcomplete-heavyAttack', () => {
              this.heavy.play("HeavyIdle", true);
              this.heavy.setSize(40, 60).setOffset(30, 30);
            });
          }
        }
      } else {
        this.heavy.flipX = false;
        if (distance > 70) {
          this.heavy.setVelocityX(350);
          this.heavy.play("HeavyRun", true);
        } else {
          this.heavy.setVelocityX(0);
          if (this.heavy.anims.currentAnim?.key !== "heavyAttack") {
            this.heavy.play("heavyAttack", true);
            this.heavy.setSize(60, 60).setOffset(30, 30);

            this.heavy.lastAttackTime = currentTime;
            this.heavy.once('animationcomplete-heavyAttack', () => {
              this.heavy.play("HeavyIdle", true);
            });
          }
        }
      }
    } else {
      this.heavy.setVelocityX(0);
      this.heavy.play("HeavyIdle", true);
    }
  }
  update(timestamp, delta) {
    let speedFactor = delta / 16.67;
    let backgroundSpeed = speedFactor * 5;
    let newAnimation = "idle";

    if (this.heavyHeartsGroup && this.heavyHealth > 0) {
      const fullHearts = Math.floor(this.heavyHealth);
      const hasHalfHeart = this.heavyHealth % 1 >= 0.5;
      const totalHearts = fullHearts + (hasHalfHeart ? 1 : 0);
      const heartSpacing = 20;
      const totalWidth = (totalHearts - 1) * heartSpacing;
      let heartIndex = 0;

      this.heavyHeartsGroup.children.iterate((heart) => {
        const isHalfHeart = heartIndex === fullHearts && hasHalfHeart;
        heart.setPosition(
          this.heavy.x - totalWidth / 2 + (heartIndex * heartSpacing),
          this.heavy.y - this.heavy.displayHeight / 2 - 10
        );
        if (isHalfHeart) {
          heart.setCrop(0, 0, heart.width / 2, heart.height);
          heart.setOrigin(0.25, 0.5);
        } else {
          heart.setCrop();
          heart.setOrigin(0.5, 0.5);
        }
        heartIndex++;
      });
    }

    this.playershurikens.forEach((shuriken, index) => {
      if (shuriken.x > sizes.width || shuriken.x < 0) {
        shuriken.destroy();
        this.playershurikens.splice(index, 1);
      }
    });

    // Demon attack logic
    this.flyingDemons.forEach((demonSprite) => {
      if (demonSprite.active && demonSprite.texture.key !== "DemonDeath") {
        const distance = Math.abs(demonSprite.x - this.player.x);
        if (this.player.x < demonSprite.x) {
          demonSprite.setFlipX(false);
        } else {
          demonSprite.setFlipX(true);
        }
        if (!demonSprite.lastAttackTime) {
          demonSprite.lastAttackTime = 0;
        }
        if (timestamp - demonSprite.lastAttackTime >= 1500 && distance <= 700) {
          if (demonSprite.anims.currentAnim?.key !== "DemonAttack") {
            demonSprite.play("DemonAttack", true);
            demonSprite.off('animationupdate');
            demonSprite.on('animationupdate', (animation, frame) => {
              if (animation.key === "DemonAttack" && frame.index === 6) {
                const shot = this.physics.add.sprite(demonSprite.x - 20, demonSprite.y + 10, "shot")
                  .setScale(0.5)
                  .setSize(10, 10);
                shot.body.allowGravity = false;
                const direction = this.player.x < demonSprite.x ? -1 : 1;
                shot.setVelocityX(direction * 500);
                shot.setFlipX(direction > 0);
                this.demonShots.push(shot);
              }
            });
            demonSprite.off('animationcomplete-DemonAttack');
            demonSprite.once('animationcomplete-DemonAttack', () => {
              if (demonSprite.active && demonSprite.texture.key !== "DemonDeath") {
                demonSprite.play("DemonIdle", true);
              }
            });
            demonSprite.lastAttackTime = timestamp;
          }
        }
      }
    });

    const { left, right, D, A } = this.cursor;

    if (this.Blood && this.Blood.knight) {
      if (this.knight.flipX === true) {
        this.Blood.setX(this.Blood.knight.x + 20);
        this.Blood.setY(this.Blood.knight.y - 10);
        this.Blood.setFlipX(true);
      } else {
        this.Blood.setX(this.Blood.knight.x - 20);
        this.Blood.setY(this.Blood.knight.y - 10);
      }
    }

    this.input.keyboard.on('keydown-SHIFT', () => {
      if (this.player.texture.key !== "heal") {
        this.player.setSize(25, 30).setOffset(45, 50);
        newAnimation = "dash";
        this.player.play("dash", true);
        this.isDashing = true;
        this.isThrowing = false;
      }
    });

    this.player.on("animationcomplete", (anim, frame) => {
      if (anim.key === "dash" || this.isAttacking != true || anim.key == "run" || anim.key == "deff") {
        this.isDashing = false;
      }
    });

    if (this.isDashing && (this.player.anims.currentAnim.key === "dash" || this.isAttacking)) {
      let knightIsDead = this.knightHealth <= 0;
      const screenWidth = this.sys.game.config.width;
      const cameraX = this.cameras.main.scrollX;
      const heavyLeftEdge = this.heavy.x - 96; // Approximate left edge of heavy (96 is half of scaled width 192)
      const heavyRightEdge = this.heavy.x + 96; // Approximate right edge of heavy
      const heavyInView = heavyLeftEdge >= cameraX && heavyRightEdge <= cameraX + screenWidth;

      if (knightIsDead && !heavyInView) {
        if (this.player.flipX != true) {
          this.groundColliders.forEach(ground => {
            ground.setX(ground.x -= backgroundSpeed * 1.5);
            ground.refreshBody();
          });
          this.groundGroup.children.iterate(ground => {
            ground.setX(ground.x - backgroundSpeed * 1.5);
          });
          this.skyGroup.children.iterate((sea) => {
            sea.setX(sea.x - backgroundSpeed * 1.5);
          });
          this.flyingDemons.forEach((demon) => {
            demon.setX(demon.x - backgroundSpeed * 1.5);
          });
          this.demonShots.forEach((demon) => {
            demon.setX(demon.x - backgroundSpeed * 1.5);
          });
          this.cloudsGroup.children.iterate((cloud) => {
            cloud.setX(cloud.x - (backgroundSpeed * 0.5) * 1.5);
          });
          this.iconShurk.forEach((icon) => {
            icon.setX(icon.x -= backgroundSpeed * 1.5);
          });
          this.playershurikens.forEach((shurk) => {
            shurk.x -= backgroundSpeed * 1.5;
          });
          if (Array.isArray(this.enemies) && this.enemies.length > 0) {
            this.enemies.forEach((enemy) => {
              if (enemy?.active) {
                enemy.setX(enemy.x -= backgroundSpeed * 1.5);
              }
            });
          }
          this.shurikens.forEach((shurken) => {
            shurken.setX(shurken.x -= backgroundSpeed * 1.5);
          });
          this.knight.setX(this.knight.x - backgroundSpeed * 1.5);
          this.heavy.setX(this.heavy.x - backgroundSpeed * 1.5);
        } else {
          this.player.setSize(25, 30).setOffset(25, 50);
          if (this.groundColliders[0].x <= 552) {
            this.groundColliders.forEach(ground => {
              ground.setX(ground.x += backgroundSpeed * 1.5);
              ground.refreshBody();
            });
            this.groundGroup.children.iterate(ground => {
              ground.setX(ground.x + backgroundSpeed * 1.5);
            });
            this.skyGroup.children.iterate((sea) => {
              sea.setX(sea.x + backgroundSpeed * 1.5);
            });
            this.flyingDemons.forEach((demon) => {
              demon.setX(demon.x += backgroundSpeed * 1.5);
            });
            this.demonShots.forEach((demon) => {
              demon.setX(demon.x += backgroundSpeed * 1.5);
            });
            this.cloudsGroup.children.iterate((cloud) => {
              cloud.setX(cloud.x + (backgroundSpeed * 0.5) * 1.5);
            });
            this.iconShurk.forEach((icon) => {
              icon.setX(icon.x += backgroundSpeed * 1.5);
            });
            this.playershurikens.forEach((shurk) => {
              shurk.x += backgroundSpeed * 1.5;
            });
            if (Array.isArray(this.enemies) && this.enemies.length > 0) {
              this.enemies.forEach((enemy) => {
                if (enemy?.active) {
                  enemy.setX(enemy.x += backgroundSpeed * 1.5);
                }
              });
            }
            this.shurikens.forEach((shurken) => {
              shurken.setX(shurken.x += backgroundSpeed * 1.5);
            });
            this.knight.setX(this.knight.x + backgroundSpeed * 1.5);
            this.heavy.setX(this.heavy.x + backgroundSpeed * 1.5);
          }
        }
      } else {
        if ((this.player.flipX && this.player.x > 50) || (!this.player.flipX && this.player.x < screenWidth - 50)) {
          if (this.player.flipX) {
            this.player.x -= backgroundSpeed * 1.5;
            this.player.setOffset(25, 50)
          } else {
            this.player.x += backgroundSpeed * 1.5;
          }
        }
      }
    }

    this.input.mouse.disableContextMenu();
    if (D.isDown && this.player.texture.key !== "deff" && this.player.texture.key !== "heal") {
      this.isThrowing = false;
      if (this.isAttacking) {
        this.player.setSize(49, 30).setOffset(40, 50);
      }
      newAnimation = "run";
      this.player.setFlipX(false);
      const screenWidth = this.game.config.width;
      const middleScreen = screenWidth / 2.5;
      let knightIsDead = this.knightHealth <= 0;
      const cameraX = this.cameras.main.scrollX;
      const heavyLeftEdge = this.heavy.x - 96;
      const heavyRightEdge = this.heavy.x + 96;
      const heavyInView = heavyLeftEdge >= cameraX && heavyRightEdge <= cameraX + screenWidth;

      if (knightIsDead && !heavyInView) {
        const tolerance = 2;
        if (Math.abs(this.player.x - middleScreen) > tolerance) {
          let moveSpeed = Math.abs(this.player.x - middleScreen) * 1.5;
          if (this.player.x > middleScreen) {
            this.player.setVelocityX(-Math.max(moveSpeed, 50));
            backgroundSpeed = speedFactor * 8;
          } else {
            this.player.setVelocityX(Math.max(moveSpeed, 50));
            backgroundSpeed = speedFactor * 5;
          }
        } else {
          this.player.setVelocityX(0);
          backgroundSpeed = speedFactor * 5;
        }
        this.groundColliders.forEach((ground) => {
          ground.setX(ground.x -= backgroundSpeed);
          ground.refreshBody();
        });
        this.flyingDemons.forEach((demon) => {
          demon.setX(demon.x -= backgroundSpeed);
        });
        this.demonShots.forEach((demon) => {
          demon.setX(demon.x -= backgroundSpeed);
        });
        this.iconShurk.forEach((icon) => {
          icon.setX(icon.x - backgroundSpeed);
        });
        this.groundGroup.children.iterate((ground) => {
          ground.setX(ground.x - backgroundSpeed);
        });
        this.skyGroup.children.iterate((sea) => {
          sea.setX(sea.x - backgroundSpeed);
        });
        this.cloudsGroup.children.iterate((cloud) => {
          cloud.setX(cloud.x - backgroundSpeed * 0.5);
        });
        this.playershurikens.forEach((shurk) => {
          shurk.x -= backgroundSpeed;
        });
        this.knight.setX(this.knight.x - backgroundSpeed);
        this.heavy.setX(this.heavy.x - backgroundSpeed);
      } else {
        if (this.player.x < screenWidth - 100) {
          this.player.setVelocityX(400);
        } else {
          this.player.setVelocityX(0);
        }
      }
      if (!this.isAttacking && !this.isDashing) {
        this.player.setSize(20, 30).setOffset(45, 50);
      }
      if (!this.run.isPlaying && !this.isAttacking && !this.isDashing && this.player.texture.key !== "deff" && this.player.body.onFloor()) {
        this.run.play();
      }
    } else if (A.isDown && this.player.texture.key != "deff" && this.player.texture.key !== "heal") {
      this.isThrowing = false;
      if (this.isAttacking) {
        this.player.setSize(49, 30).setOffset(15, 50);
      }
      newAnimation = "run";
      let knightIsDead = this.knightHealth <= 0;
      this.player.setFlipX(true);
      const screenWidth = this.game.config.width;
      const cameraX = this.cameras.main.scrollX;
      const heavyLeftEdge = this.heavy.x - 96;
      const heavyRightEdge = this.heavy.x + 96;
      const heavyInView = heavyLeftEdge >= cameraX && heavyRightEdge <= cameraX + screenWidth;

      if (!this.isAttacking && !this.isDashing) {
        this.player.setSize(20, 30).setOffset(30, 50);
      }

      if (knightIsDead && !heavyInView && this.groundColliders[0].x <= 552) {
        this.groundColliders.forEach(ground => {
          ground.setX(ground.x += backgroundSpeed);
          ground.refreshBody();
        });
        this.iconShurk.forEach((icon) => {
          icon.setX(icon.x + backgroundSpeed);
        });
        this.flyingDemons.forEach((demon) => {
          demon.setX(demon.x += backgroundSpeed);
        });
        this.demonShots.forEach((demon) => {
          demon.setX(demon.x += backgroundSpeed);
        });
        this.groundGroup.children.iterate((ground) => {
          ground.setX(ground.x + backgroundSpeed);
        });
        this.skyGroup.children.iterate((sea) => {
          sea.setX(sea.x + backgroundSpeed);
        });
        this.cloudsGroup.children.iterate((cloud) => {
          cloud.setX(cloud.x + backgroundSpeed * 0.5);
        });
        this.playershurikens.forEach((shurk) => {
          shurk.x += backgroundSpeed;
        });
        if (Array.isArray(this.enemies) && this.enemies.length > 0) {
          this.enemies.forEach((enemy) => {
            if (enemy?.active) {
              enemy.setX(enemy.x += backgroundSpeed);
            }
          });
        }
        this.knight.setX(this.knight.x + backgroundSpeed);
        this.heavy.setX(this.heavy.x + backgroundSpeed);
        this.shurikens.forEach((shurken) => {
          shurken.setX(shurken.x += backgroundSpeed);
        });
      } else {
        if (this.player.x > 100) {
          this.player.setVelocityX(-400);
        } else {
          this.player.setVelocityX(0);
        }
      }
      if (!this.run.isPlaying && !this.isAttacking && !this.isDashing && this.player.texture.key != "deff" && this.player.body.onFloor()) {
        this.run.play();
      }
    } else {
      this.player.setVelocityX(0);

      if (this.player.texture.key == "idle") {
        this.player.setSize(16, 30).setOffset(40, 50);
        if (this.run.isPlaying) {
          this.run.stop();
        }
      }
    }

    if (this.run.isPlaying && !this.player.body.onFloor() || this.player.texture.key == "deff") {
      this.run.stop();
    }

    if (
      this.player.anims.currentAnim?.key !== newAnimation &&
      !this.isAttacking &&
      !this.isThrowing &&
      this.player.anims.currentAnim?.key !== "hurt" &&
      this.player.anims.currentAnim?.key !== "dash" &&
      this.player.anims.currentAnim?.key !== "deff" &&
      this.player.anims.currentAnim?.key !== "reflect" &&
      this.player.anims.currentAnim?.key !== "heal"
    ) {
      this.player.play(newAnimation, true);
    }

    // Update knight hearts position
    if (this.knightHeartsGroup && this.knightHealth > 0) {
      const fullHearts = Math.floor(this.knightHealth);
      const hasHalfHeart = this.knightHealth % 1 >= 0.5;
      const totalHearts = fullHearts + (hasHalfHeart ? 1 : 0);
      const heartSpacing = 20;
      const totalWidth = (totalHearts - 1) * heartSpacing;
      let heartIndex = 0;

      this.knightHeartsGroup.children.iterate((heart) => {
        const isHalfHeart = heartIndex === fullHearts && hasHalfHeart;
        heart.setPosition(
          this.knight.x - totalWidth / 2 + (heartIndex * heartSpacing),
          this.knight.y - this.knight.displayHeight / 2 - 10
        );
        if (isHalfHeart) {
          heart.setCrop(0, 0, heart.width / 2, heart.height);
          heart.setOrigin(0.25, 0.5);
        } else {
          heart.setCrop();
          heart.setOrigin(0.5, 0.5);
        }
        heartIndex++;
      });
    }
    // this.knightHandler();
    this.heavyHandler();
  }



}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    }
  },
  scene: [GameScene]
}

const game = new Phaser.Game(config)