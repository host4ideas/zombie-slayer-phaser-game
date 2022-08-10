import Phaser from "phaser";
// Survivor animations sprites
import survivorKnifeAnimations from "../assets/textures/top_down_survivor/survivor_knife/survivor_knife.png";
import survivorKnifeConfiguration from "../assets/textures/top_down_survivor/survivor_knife/survivor_knife.json";
import survivorRifleAnimations from "../assets/textures/top_down_survivor/survivor_rifle/survivor_rifle.png";
import survivorRifleConfiguration from "../assets/textures/top_down_survivor/survivor_rifle/survivor_rifle.json";
import survivorShotgunAnimations from "../assets/textures/top_down_survivor/survivor_shotgun/survivor_shotgun.png";
import survivorShotgunConfiguration from "../assets/textures/top_down_survivor/survivor_shotgun/survivor_shotgun.json";
import survivorHandgunAnimations from "../assets/textures/top_down_survivor/survivor_handgun/survivor_handgun.png";
import survivorHandgunConfiguration from "../assets/textures/top_down_survivor/survivor_handgun/survivor_handgun.json";
import survivorFlashlightAnimations from "../assets/textures/top_down_survivor/survivor_flashlight/survivor_flashlight.png";
import survivorFlashlightConfiguration from "../assets/textures/top_down_survivor/survivor_flashlight/survivor_flashlight.json";
// Zombie animations sprites
import zombieAnimations from "../assets/textures/top_down_zombie/texture.png";
import zombieConfiguration from "../assets/textures/top_down_zombie/texture.json";
// Bullet sprite
import bulletSprite from "../assets/sprites/bullet5.png";
// Zombie audios
import zombieAttack1 from "../assets/audio/characters/Zombie-Aggressive-Attack-A1.mp3";
import zombieAttack2 from "../assets/audio/characters/Zombie-Aggressive-Attack-A2.mp3";
import zombieAttack3 from "../assets/audio/characters/Zombie-Aggressive-Attack-A3.mp3";
import zombieAttack4 from "../assets/audio/characters/Zombie-Aggressive-Attack-A4.mp3";
import zombieAttack5 from "../assets/audio/characters/Zombie-Aggressive-Attack-A5.mp3";
import zombieAttack6 from "../assets/audio/characters/Zombie-Aggressive-Attack-A7.mp3";
// Weapon audios
import rifleAudioShoot from "../assets/audio/weapons/5.56-AR15-Single-Close-GunShot-A.mp3";
import shotgunAudioShoot from "../assets/audio/weapons/12-Gauge-Pump-Action-Shotgun-Close-Gunshot-A.mp3";
import pistolAudioShoot from "../assets/audio/weapons/1911-.45-ACP-Close-Single-Gunshot-A.mp3";

// Zombie variables
let zombieGroup;

// Survivor variables
let survivor;
let availableGuns = ["flashlight", "knife", "handgun", "rifle", "shotgun"];
let survivorGun = availableGuns[3];
let currentMag;

// Bullet variables
let bullet;
let mouse;
let input;

// Game variables
let target = 0;
const ROTATION_SPEED = 1 * Math.PI; // radians per second

// Game round variables
let zombieCount = 99;

// Game info varialbes
let ammoInfo;
let healthInfo;
let textObject; // Text object
let currentRound; // The text of the text object
let reloadInfoText;

// Damage and health variables
let weaponDamage = 2;
let survivorHealth = 5;

/**
 **** MAIN SCENE CLASS ****
 */
export default class MainScene extends Phaser.Scene {
    constructor() {
        super("mainscene");
        // Weapon variables
        this.lastShot = 0;
        currentMag = 20;
        this.shotDelay = 300;
        this.lastMeleeAtack = 0;
        this.meleeAtackDelay = 300;
        // Zombie variables
        this.lastZombieHit = 0;
        this.zombieHitDelay = 1000;
        // New round variable
        this.triggerNewRound = true;
        // Animation triggers
        this.isPlayingAnimMelee = true;
        this.isPlayingZombieAttack = false;
    }

    preload() {
        // Load assets
        this.load.atlas(
            "survivor_animations_knife",
            survivorKnifeAnimations,
            survivorKnifeConfiguration
        );
        this.load.atlas(
            "survivor_animations_rifle",
            survivorRifleAnimations,
            survivorRifleConfiguration
        );
        this.load.atlas(
            "survivor_animations_shotgun",
            survivorShotgunAnimations,
            survivorShotgunConfiguration
        );
        this.load.atlas(
            "survivor_animations_handgun",
            survivorHandgunAnimations,
            survivorHandgunConfiguration
        );
        this.load.atlas(
            "survivor_animations_flashlight",
            survivorFlashlightAnimations,
            survivorFlashlightConfiguration
        );
        this.load.atlas(
            "zombie_animations",
            zombieAnimations,
            zombieConfiguration
        );
        // Load audios
        this.load.audio("attack_zombie_audio_1", zombieAttack1);
        this.load.audio("attack_zombie_audio_2", zombieAttack2);
        this.load.audio("attack_zombie_audio_3", zombieAttack3);
        this.load.audio("attack_zombie_audio_4", zombieAttack4);
        this.load.audio("attack_zombie_audio_5", zombieAttack5);
        this.load.audio("attack_zombie_audio_6", zombieAttack6);
        this.load.audio("rifle_shoot_audio", rifleAudioShoot);
        this.load.audio("shotgun_shoot_audio", shotgunAudioShoot);
        this.load.audio("pistol_shoot_audio", pistolAudioShoot);

        // To add images
        this.textures.addBase64("bullet", bulletSprite);
    }

    create() {
        // FOR RESET  PURPOSES
        zombieCount = 99;
        currentRound = 0;
        weaponDamage = 2;
        survivorHealth = 5;

        // Add audios
        this.sound.add("attack_zombie_audio_1");
        this.sound.add("attack_zombie_audio_2");
        this.sound.add("attack_zombie_audio_3");
        this.sound.add("attack_zombie_audio_4");
        this.sound.add("attack_zombie_audio_5");
        this.sound.add("attack_zombie_audio_6");
        this.sound.add("rifle_shoot_audio");
        this.sound.add("shotgun_shoot_audio");
        this.sound.add("pistol_shoot_audio");

        /**
         **** NEW ROUND INFO ****
         */
        const screenCenterX =
            this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY =
            this.cameras.main.worldView.y + this.cameras.main.height / 2;
        textObject = this.add
            .text(screenCenterX, screenCenterY, `Round: ${currentRound}`, {
                fontSize: "5rem",
                color: "#eb5449",
            })
            .setOrigin(0.5);

        /**
         **** RELOAD TEXT ****
         */
        reloadInfoText = this.add
            .text(screenCenterX, screenCenterY, `reload (R)`, {
                fontSize: "2rem",
                color: "#eb5449",
            })
            .setOrigin(0.5);
        reloadInfoText.visible = false;

        /**
         **** AMMO INFO ****
         */
        ammoInfo = this.add.text(0, 0, `Mag: ${currentMag}`, {
            fontSize: "1.5rem",
        });

        /**
         **** HEALTH INFO ****
         */
        healthInfo = this.add.text(200, 0, `Health: ${survivorHealth}`, {
            fontSize: "1.5rem",
        });

        /**
         ***** SURVIVOR CREATION & ANIMATIONS *****
         */
        // Add the character sprite to the map
        survivor = this.add.sprite(
            600,
            370,
            `survivor_animations_${survivorGun}`
        );
        survivor.setScale(0.3);

        this.add.existing(survivor);
        this.physics.add.existing(survivor);

        survivor.body.setSize(64, 64, 32, 32);

        /*
			Knife animations
		*/
        survivor.anims.create({
            key: "survivor-move-knife",
            frames: this.anims.generateFrameNames("survivor_animations_knife", {
                prefix: "survivor-move_knife_",
                suffix: ".png",
                start: 0,
                end: 19,
            }),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-idle-knife",
            frames: this.anims.generateFrameNames("survivor_animations_knife", {
                prefix: "survivor-idle_knife_",
                suffix: ".png",
                start: 0,
                end: 19,
            }),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-meleeattack-knife",
            frames: this.anims.generateFrameNames("survivor_animations_knife", {
                prefix: "survivor-meleeattack_knife_",
                suffix: ".png",
                start: 0,
                end: 14,
            }),
            frameRate: 20,
            repeat: 0,
        });

        /*
			Flashlight animations
		*/

        survivor.anims.create({
            key: "survivor-move-flashlight",
            frames: this.anims.generateFrameNames(
                "survivor_animations_flashlight",
                {
                    prefix: "survivor-move_flashlight_",
                    suffix: ".png",
                    start: 0,
                    end: 19,
                }
            ),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-idle-flashlight",
            frames: this.anims.generateFrameNames(
                "survivor_animations_flashlight",
                {
                    prefix: "survivor-idle_flashlight_",
                    suffix: ".png",
                    start: 0,
                    end: 19,
                }
            ),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-meleeattack-flashlight",
            frames: this.anims.generateFrameNames(
                "survivor_animations_flashlight",
                {
                    prefix: "survivor-meleeattack_flashlight_",
                    suffix: ".png",
                    start: 0,
                    end: 14,
                }
            ),
            frameRate: 20,
            repeat: 0,
        });

        /*
			Rifle animations
		*/

        survivor.anims.create({
            key: "survivor-move-rifle",
            frames: this.anims.generateFrameNames("survivor_animations_rifle", {
                prefix: "survivor-move_rifle_",
                suffix: ".png",
                start: 0,
                end: 19,
            }),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-idle-rifle",
            frames: this.anims.generateFrameNames("survivor_animations_rifle", {
                prefix: "survivor-idle_rifle_",
                suffix: ".png",
                start: 0,
                end: 19,
            }),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-meleeattack-rifle",
            frames: this.anims.generateFrameNames("survivor_animations_rifle", {
                prefix: "survivor-meleeattack_rifle_",
                suffix: ".png",
                start: 0,
                end: 14,
            }),
            frameRate: 20,
            repeat: 0,
        });

        survivor.anims.create({
            key: "survivor-reload-rifle",
            frames: this.anims.generateFrameNames("survivor_animations_rifle", {
                prefix: "survivor-reload_rifle_",
                suffix: ".png",
                start: 0,
                end: 19,
            }),
            frameRate: 20,
            repeat: 0,
        });

        survivor.anims.create({
            key: "survivor-shoot-rifle",
            frames: this.anims.generateFrameNames("survivor_animations_rifle", {
                prefix: "survivor-shoot_rifle_",
                suffix: ".png",
                start: 0,
                end: 2,
            }),
            frameRate: 5,
            repeat: -1,
        });

        /*
			shotgun animations
		*/

        survivor.anims.create({
            key: "survivor-move-shotgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_shotgun",
                {
                    prefix: "survivor-move_shotgun_",
                    suffix: ".png",
                    start: 0,
                    end: 19,
                }
            ),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-idle-shotgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_shotgun",
                {
                    prefix: "survivor-idle_shotgun_",
                    suffix: ".png",
                    start: 0,
                    end: 19,
                }
            ),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-meleeattack-shotgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_shotgun",
                {
                    prefix: "survivor-meleeattack_shotgun_",
                    suffix: ".png",
                    start: 0,
                    end: 14,
                }
            ),
            frameRate: 20,
            repeat: 0,
        });

        survivor.anims.create({
            key: "survivor-reload-shotgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_shotgun",
                {
                    prefix: "survivor-reload_shotgun_",
                    suffix: ".png",
                    start: 0,
                    end: 19,
                }
            ),
            frameRate: 20,
            repeat: 0,
        });

        survivor.anims.create({
            key: "survivor-shoot-shotgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_shotgun",
                {
                    prefix: "survivor-shoot_shotgun_",
                    suffix: ".png",
                    start: 0,
                    end: 2,
                }
            ),
            frameRate: 5,
            repeat: -1,
        });

        /*
			Handgun animations
		*/

        survivor.anims.create({
            key: "survivor-move-handgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_handgun",
                {
                    prefix: "survivor-move_handgun_",
                    suffix: ".png",
                    start: 0,
                    end: 19,
                }
            ),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-idle-handgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_handgun",
                {
                    prefix: "survivor-idle_handgun_",
                    suffix: ".png",
                    start: 0,
                    end: 19,
                }
            ),
            frameRate: 20,
            repeat: -1,
        });

        survivor.anims.create({
            key: "survivor-meleeattack-handgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_handgun",
                {
                    prefix: "survivor-meleeattack_handgun_",
                    suffix: ".png",
                    start: 0,
                    end: 14,
                }
            ),
            frameRate: 20,
            repeat: 0,
        });

        survivor.anims.create({
            key: "survivor-reload-handgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_handgun",
                {
                    prefix: "survivor-reload_handgun_",
                    suffix: ".png",
                    start: 0,
                    end: 14,
                }
            ),
            frameRate: 20,
            repeat: 0,
        });

        survivor.anims.create({
            key: "survivor-shoot-handgun",
            frames: this.anims.generateFrameNames(
                "survivor_animations_handgun",
                {
                    prefix: "survivor-shoot_handgun_",
                    suffix: ".png",
                    start: 0,
                    end: 2,
                }
            ),
            frameRate: 5,
            repeat: -1,
        });

        // survivor default animation
        survivor.anims.play(`survivor-idle-${survivorGun}`);

        // Follow the mouse pointer as rotation direction
        this.input.on("pointermove", function (pointer) {
            target = Phaser.Math.Angle.BetweenPoints(survivor, pointer);
        });

        // Set world collition bounds
        survivor.body.setCollideWorldBounds(true);

        /**
         ***** ZOMBIE CREATION & ANIMATIONS *****
         */
        // Create the zombies group
        zombieGroup = this.physics.add.group();
        newRound(textObject, this);

        /*
			Mouse inputs events
		*/
        // for mouse click event
        mouse = this.input.mousePointer;
        // for mouse position
        input = this.input;

        /*
		   Key define
	   */
        this.keyW = this.input.keyboard.addKey("W"); // Get key W object
        this.keyA = this.input.keyboard.addKey("A"); // Get key A object
        this.keyS = this.input.keyboard.addKey("S"); // Get key S object
        this.keyD = this.input.keyboard.addKey("D"); // Get key D object
        this.keyQ = this.input.keyboard.addKey("Q"); // Get key Q object
        this.keyE = this.input.keyboard.addKey("E"); // Get key E object
        this.keyR = this.input.keyboard.addKey("R"); // Get key R object
        this.key1 = this.key1 = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ONE
        );
        this.key2 = this.key2 = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.TWO
        );
        this.key3 = this.key3 = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.THREE
        );
        this.key4 = this.key4 = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.FOUR
        );
        this.key5 = this.key5 = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.FIVE
        );

        /**
         * ZOMBIE AND SURVIVOR COLLISION
         */
        //  When a zombie hits the survivor, call zombieHitSurvivor function with this as the game bind
        this.physics.add.overlap(
            survivor,
            zombieGroup,
            zombieHitSurvivor.bind(this)
        );
    }
    update(time, delta) {
        /**
         **** Survivor updates ****
         */

        // Rotation of the character
        survivor.rotation = Phaser.Math.Angle.RotateTo(
            survivor.rotation,
            target,
            ROTATION_SPEED * 0.002 * delta
        );

        let survivorAnimations = {
            // Animations object will be updated whenever the user changes gun
            idle: "",
            walk: "",
            meleeattack: "",
            shoot: "",
            reload: "",
            weaponShootSound: "",
        };

        // Switch parameters depending on the actual gun
        switch (survivorGun) {
            case "knife":
                survivorAnimations["idle"] = "survivor-idle-knife";
                survivorAnimations["meleeattack"] =
                    "survivor-meleeattack-knife";
                survivorAnimations["walk"] = "survivor-move-knife";
                weaponDamage = 4;
                this.shotDelay = 500;
                this.meleeAtackDelay = 700;
                break;
            case "flashlight":
                survivorAnimations["idle"] = "survivor-idle-flashlight";
                survivorAnimations["meleeattack"] =
                    "survivor-meleeattack-flashlight";
                survivorAnimations["walk"] = "survivor-move-flashlight";
                weaponDamage = 1;
                this.shotDelay = 200;
                this.meleeAtackDelay = 300;
                break;
            case "rifle":
                survivorAnimations["idle"] = "survivor-idle-rifle";
                survivorAnimations["meleeattack"] =
                    "survivor-meleeattack-rifle";
                survivorAnimations["walk"] = "survivor-move-rifle";
                survivorAnimations["shoot"] = "survivor-shoot-rifle";
                survivorAnimations["reload"] = "survivor-reload-rifle";
                survivorAnimations["weaponShootSound"] = "rifle_shoot_audio";
                weaponDamage = 2;
                this.shotDelay = 300;
                this.meleeAtackDelay = 800;
                break;
            case "shotgun":
                survivorAnimations["idle"] = "survivor-idle-shotgun";
                survivorAnimations["meleeattack"] =
                    "survivor-meleeattack-shotgun";
                survivorAnimations["walk"] = "survivor-move-shotgun";
                survivorAnimations["shoot"] = "survivor-shoot-shotgun";
                survivorAnimations["reload"] = "survivor-reload-shotgun";
                survivorAnimations["weaponShootSound"] = "shotgun_shoot_audio";
                weaponDamage = 4;
                this.shotDelay = 500;
                this.meleeAtackDelay = 1000;
                break;
            case "handgun":
                survivorAnimations["idle"] = "survivor-idle-handgun";
                survivorAnimations["meleeattack"] =
                    "survivor-meleeattack-handgun";
                survivorAnimations["walk"] = "survivor-move-handgun";
                survivorAnimations["shoot"] = "survivor-shoot-handgun";
                survivorAnimations["reload"] = "survivor-reload-handgun";
                survivorAnimations["weaponShootSound"] = "pistol_shoot_audio";
                weaponDamage = 2;
                this.shotDelay = 600;
                this.meleeAtackDelay = 400;
                break;
            default:
                survivorAnimations["idle"] = "survivor-idle-flashlight";
                survivorAnimations["meleeattack"] =
                    "survivor-meleeattack-flashlight";
                survivorAnimations["walk"] = "survivor-move-flashlight";
                weaponDamage = 1;
                this.shotDelay = 200;
        }

        /*
         **** Key bindings ****
         */
        // Movements
        this.keyW.on("down", (ev) => {
            survivor.play(survivorAnimations["walk"]); // Up
            survivor.body.setVelocityY(-100);
        });
        this.keyW.on("up", (ev) => {
            survivor.play(survivorAnimations["idle"]);
            survivor.body.setVelocityY(0);
        });
        this.keyA.on("down", (ev) => {
            survivor.play(survivorAnimations["walk"]); // Left
            survivor.body.setVelocityX(-100);
        });
        this.keyA.on("up", (ev) => {
            survivor.play(survivorAnimations["idle"]);
            survivor.body.setVelocityX(0);
        });
        this.keyS.on("down", (ev) => {
            survivor.play(survivorAnimations["walk"]); // Down
            survivor.body.setVelocityY(100);
        });
        this.keyS.on("up", (ev) => {
            survivor.play(survivorAnimations["idle"]);
            survivor.body.setVelocityY(0);
        });
        this.keyD.on("down", (ev) => {
            survivor.play(survivorAnimations["walk"]); // Right
            survivor.body.setVelocityX(100);
        });
        this.keyD.on("up", (ev) => {
            survivor.play(survivorAnimations["idle"]);
            survivor.body.setVelocityX(0);
        });
        // Interactions
        if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
            survivor.anims.play(survivorAnimations["reload"]);

            this.time.delayedCall(1000, function () {
                currentMag = 20;
                ammoInfo.setText(`Mag: ${currentMag}`);
                reloadInfoText.visible = false;
            });
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
            this.anims.pauseAll();
            survivor.play(survivorAnimations["meleeattack"]);
            survivorMeleeZombie(survivor, zombieGroup.children.entries, this);
        }

        // Change weapon
        this.key1.on("down", (ev) => {
            survivorGun = availableGuns[0];
        });
        this.key2.on("down", (ev) => {
            survivorGun = availableGuns[1];
        });
        this.key3.on("down", (ev) => {
            survivorGun = availableGuns[2];
        });
        this.key4.on("down", (ev) => {
            survivorGun = availableGuns[3];
        });
        this.key5.on("down", (ev) => {
            survivorGun = availableGuns[4];
        });

        /**
         **** Zombie updates ****
         */
        zombieGroup.children.entries.forEach((zombie) => {
            // Move zombies to the survivor's position at a random speed in px/s
            this.physics.moveToObject(zombie, survivor, zombie.randomSpeed);

            if (checkOverlap(survivor, zombie)) {
                zombie.anims.play("walk-zombie");
            }

            // Rotation of the zombie to the survivor position
            updateAngleToSprite(survivor, zombie);
        });

        /**
         * Bullet updates
         */
        // mouse clicked
        if (mouse.isDown) {
            console.log(currentMag);
            // If the survivor weapon is a gun, shot a bullet
            if (
                survivorGun === availableGuns[2] ||
                survivorGun === availableGuns[3] ||
                survivorGun === availableGuns[4]
            ) {
                if (currentMag > 0) {
                    // Check the delay
                    if (this.time.now > this.shotDelay + this.lastShot) {
                        // Make sure the player can't shoot when dead and that they are able to shoot another bullet
                        this.lastShot = this.time.now;

                        if (currentMag - 1 < 0) {
                            currentMag = 0;
                        } else {
                            console.log(currentMag);
                            // Update ammo info
                            currentMag -= 1;
                            ammoInfo.setText(`Mag: ${currentMag}`);
                            survivor.play(survivorAnimations["shoot"]);
                            this.sound.play(
                                survivorAnimations["weaponShootSound"]
                            );
                        }

                        bullet = this.physics.add.sprite(
                            survivor.x,
                            survivor.y,
                            "bullet"
                        );

                        // bullet sprite rotation to mouse firection
                        updateAngleToMouse(this, bullet);
                        // move bullet to mouse direction
                        this.physics.moveTo(bullet, input.x, input.y, 500);
                        //  When the bullet sprite his a zombie from zombieGroup, call bulletHitZombie function
                        this.physics.add.overlap(
                            bullet,
                            zombieGroup,
                            bulletHitZombie
                        );
                    }
                } else {
                    // If the mag is empty, show the reload text
                    reloadInfoText.visible = true;
                }
                // Else: instead of shooting, trigger a melee atack
            } else {
                survivor.play(survivorAnimations["meleeattack"]);
                survivorMeleeZombie(
                    survivor,
                    zombieGroup.children.entries,
                    this
                );
            }
        }

        // Set trigger new round to true
        if (zombieCount < 1) {
            this.triggerNewRound = true;
        }

        // Trigger new round and set trigger new round to false
        if (this.triggerNewRound === true && zombieCount < 1) {
            survivor.body.enable = false;
            newRound(textObject, this);
            survivor.body.enable = true;
            this.triggerNewRound = false;
        }
    }
}

// Function to update the rotation of a sprite to mouse pointer position
function updateAngleToMouse(game, view) {
    const dx = game.input.activePointer.x - view.x;
    const dy = game.input.activePointer.y - view.y;
    const targetAngle = (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

    view.angle = targetAngle;
}

// Rotation of sprite1 to the sprite2 position
function updateAngleToSprite(sprite1, sprite2) {
    const dx = sprite1.x - sprite2.x;
    const dy = sprite1.y - sprite2.y;
    const targetAngle = (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

    sprite2.angle = targetAngle;
}

// When a zombie hits the survivor
function bulletHitZombie(bullet, zombie) {
    // Destroy the bullet
    bullet.destroy(true);

    zombie.zombieHealth -= weaponDamage;

    if (zombie.zombieHealth < 1) {
        --zombieCount;

        console.log(zombieCount);

        zombie.destroy(true);
    }
}

function setZombieAnimations(zombie, scene) {
    zombie.setScale(0.2);

    zombie.anims.create({
        key: "walk-zombie",
        frames: scene.anims.generateFrameNames("zombie_animations", {
            prefix: "skeleton-move_",
            suffix: ".png",
            start: 0,
            end: 15,
        }),
        frameRate: 10,
        repeat: -1,
    });

    zombie.anims.create({
        key: "idle-zombie",
        frames: scene.anims.generateFrameNames("zombie_animations", {
            prefix: "skeleton-idle_",
            suffix: ".png",
            start: 0,
            end: 15,
        }),
        frameRate: 8,
        repeat: -1,
    });

    zombie.anims.create({
        key: "meleeattack-zombie",
        frames: scene.anims.generateFrameNames("zombie_animations", {
            prefix: "skeleton-attack_",
            suffix: ".png",
            start: 0,
            end: 7,
        }),
        frameRate: 10,
        repeat: 0,
    });
}

function addZombies(scene, zombieGroup) {
    const { width, height } = scene.sys.game.canvas;
    for (let i = 0; i < currentRound * 4 - currentRound * 2; i++) {
        zombieCount++;
        const border = Math.floor(Phaser.Math.Between(0, 1));

        switch (border) {
            case 0:
                const randomHeigth = Math.floor(Phaser.Math.Between(0, height));
                zombieGroup.create(
                    width - 100,
                    randomHeigth - 100,
                    "zombie_animations"
                );
                break;
            case 1:
                const randomWidth = Math.floor(Phaser.Math.Between(0, width));
                zombieGroup.create(
                    randomWidth - 100,
                    height - 100,
                    "zombie_animations"
                );
                break;
            default:
                break;
        }
    }

    // Add to each zombie in the zombie group the proper animations and physics
    zombieGroup.children.entries.forEach((zombie) => {
        zombie.randomSpeed = Math.floor(Phaser.Math.Between(100, 160));

        setZombieAnimations(zombie, scene);
        zombie.zombieHealth = 5;
        survivor.body.setSize(64, 64, 64, 64);
        zombie.anims.play("walk-zombie");
    });

    zombieCount--;
}

// Creates a new round by setting the round info as visible and adding the zombies to the game
function newRound(textObject, scene) {
    zombieCount = 1;
    textObject.setText(`Round: ${++currentRound}`);
    textObject.visible = true;
    scene.time.delayedCall(
        2000,
        () => {
            textObject.visible = false;
            addZombies(scene, zombieGroup);
        },
        null,
        scene
    );
}

// When a zombie hits the survivor
function zombieHitSurvivor(survivor, zombie) {
    const randomAudio = Math.floor(Phaser.Math.Between(1, 6));

    if (this.time.now > this.zombieHitDelay + this.lastZombieHit) {
        // Make sure the player can't shoot when dead and that they are able to shoot another bullet
        this.lastZombieHit = this.time.now;

        this.sound.play(`attack_zombie_audio_${randomAudio}`);

        zombie.anims.play("meleeattack-zombie");

        survivorHealth -= 1;
        healthInfo.setText(`Health: ${survivorHealth}`);

        if (survivorHealth < 1) {
            playLostGame(this);
            survivor.body.enable = false;
        }
    }
}

function playLostGame(game) {
    game.cameras.main.fadeOut(1000, 0, 0, 0);
    game.time.delayedCall(1000, () => {
        game.sound.stopAll();
        game.scene.start("wastedscene");
        game.scene.remove("mainscene");
    });
}

function survivorMeleeZombie(survivor, zombieGroup, scene) {
    if (scene.time.now > scene.meleeAtackDelay + scene.lastMeleeAtack) {
        scene.lastMeleeAtack = scene.time.now;
        zombieGroup.forEach((zombie) => {
            // Check if a zombie is close enough to deal it damage
            if (
                Phaser.Math.Distance.BetweenPoints(
                    { x: survivor.x, y: survivor.y },
                    { x: zombie.x, y: zombie.y }
                ) <
                zombie.width - 150
            ) {
                zombie.zombieHealth -= weaponDamage;
                if (zombie.zombieHealth < 1) {
                    --zombieCount;

                    console.log(zombieCount);

                    zombie.destroy(true);
                }
            }
        });
    }
}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}
