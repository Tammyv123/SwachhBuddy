// src/components/EcoRunner.tsx
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

const EcoRunner: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    class MainScene extends Phaser.Scene {
      player!: Phaser.Physics.Arcade.Sprite;
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      spaceKey!: Phaser.Input.Keyboard.Key;
      groundTiles!: Phaser.GameObjects.TileSprite;
      wasteGroup!: Phaser.GameObjects.Group;
      score = 0;
      scoreText!: Phaser.GameObjects.Text;
      gameOver = false;
      nextWasteTime = 0;
      restartButton!: Phaser.GameObjects.Text;
      gameOverText!: Phaser.GameObjects.Text;

      recyclableItems = ["banana", "apple", "paper"];
      nonRecyclableItems = ["bottle", "plasticBag", "can"];

      preload() {
        // 🌿 Background image (eco-friendly sky)
        this.load.image("background", "/src/asset/bg.jpg");

        // Ground and player 
        this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
        this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");

        // Recyclable
        this.load.image("banana", "/src/asset/toppng.com-shopping-bag-png-512x512.png");
        this.load.image("paper", "/src/asset/toppng.com-crumpled-piece-of-paper-311x289.png");
        this.load.image("apple", "/src/asset/box.png");

        // Non-recyclable
        this.load.image("plasticBag", "/src/asset/toppng.com-tin-can-tin-can-cartoon-236x353.png");
        this.load.image("bottle", "/src/asset/toppng.com-do-what-i-waaant-transparent-warp-pipe-pngs-for-all-flappy-bird-pipe-425x613.png");
        this.load.image("can", "/src/asset/toppng.com-grocery-bag-png-600x729.png");
      }

      create() {
        this.score = 0;
        this.gameOver = false;

        // 🌿 Add background first (behind everything else)
        this.add.image(400, 300, "background").setDisplaySize(1000, 800);

        // Ground
        this.groundTiles = this.add.tileSprite(400, 600, 1000, 100, "ground");
        this.physics.add.existing(this.groundTiles, true);

        // Player
        this.player = this.physics.add.sprite(150, 500, "player").setScale(2.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.groundTiles);

        // Waste group
        this.wasteGroup = this.add.group();

        // Scoreboard
        this.add.rectangle(400, 20, 800, 40, 0x007bff).setOrigin(0.5);
        this.scoreText = this.add.text(20, 8, "Score: 0", { fontSize: "24px", fill: "#fff" } as Phaser.Types.GameObjects.Text.TextStyle).setDepth(10);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Restart button
        this.restartButton = this.add.text(400, 360, "Restart", {
          fontSize: "32px",
          fill: "#fff",
          backgroundColor: "#007bff",
          padding: { x: 20, y: 10 }
        } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5).setInteractive().setVisible(false);

        this.restartButton.on("pointerdown", () => this.scene.restart());
      }

      update(time: number) {
        if (this.gameOver) return;

        this.groundTiles.tilePositionX += 4;

        this.wasteGroup.getChildren().forEach((wasteObj: any) => {
          wasteObj.x -= 4;
          if (wasteObj.x < -50) {
            if (wasteObj.type === "recyclable") {
              this.score += 5;
              this.scoreText.setText("Score: " + this.score);
            }
            wasteObj.destroy();
          }
        });

        if ((this.cursors.up.isDown || this.spaceKey.isDown) && this.player.body.touching.down) {
          this.player.setVelocityY(-420);
        }

        if (time > this.nextWasteTime) {
          this.createWaste();
          this.nextWasteTime = time + Phaser.Math.Between(1200, 1800);
        }

        this.physics.world.overlap(this.player, this.wasteGroup, (playerObj, waste: any) => {
          if (waste.type === "non-recyclable") {
            this.endGame();
          } else {
            this.score += 10;
            this.scoreText.setText("Score: " + this.score);
            waste.destroy();
          }
        });
      }

      endGame() {
        this.gameOver = true;
        this.physics.pause();
        this.player.setTint(0xff0000);

        this.gameOverText = this.add.text(400, 250, "GAME OVER\nScore: " + this.score, {
          fontSize: "40px",
          fill: "#ff0000",
          align: "center"
        } as Phaser.Types.GameObjects.Text.TextStyle).setOrigin(0.5);

        this.restartButton.setVisible(true);
      }

      createWaste() {
        const wasteType = Phaser.Math.RND.pick(["recyclable", "non-recyclable"]);
        const x = 850;
        const y = 525;
        let key: string;

        if (wasteType === "recyclable") {
          key = Phaser.Math.RND.pick(this.recyclableItems);
        } else {
          key = Phaser.Math.RND.pick(this.nonRecyclableItems);
        }

        const waste = this.add.image(x, y - 20, key).setScale(0.1).setDepth(15);
        this.physics.add.existing(waste);
        (waste.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        (waste as any).type = wasteType;

        this.wasteGroup.add(waste);
      }
    }

    if (!gameRef.current && gameContainerRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: { default: "arcade", arcade: { gravity: { y: 600 } as Phaser.Types.Physics.Arcade.ArcadeWorldConfig["gravity"], debug: false } },
        scene: MainScene,
        parent: gameContainerRef.current
      });
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
     <div
      ref={gameContainerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#cceeff", // optional page background
      }}
    />
  );
};

export default EcoRunner;