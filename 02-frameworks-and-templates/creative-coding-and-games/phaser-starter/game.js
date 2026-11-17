const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  parent: 'game-container',
  backgroundColor: '#090d16',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: false }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let player, stars, cursors, score = 0, scoreText;

function preload() {}

function create() {
  const platforms = this.physics.add.staticGroup();
  
  // Create solid platforms using drawn graphics
  const groundGfx = this.add.graphics();
  groundGfx.fillStyle(0x334155, 1);
  groundGfx.fillRect(0, 460, 800, 40);
  groundGfx.generateTexture('ground', 800, 40);
  groundGfx.destroy();

  platforms.create(400, 480, 'ground').refreshBody();

  // Player graphic
  const playerGfx = this.add.graphics();
  playerGfx.fillStyle(0x38bdf8, 1);
  playerGfx.fillCircle(16, 16, 16);
  playerGfx.generateTexture('player', 32, 32);
  playerGfx.destroy();

  player = this.physics.add.sprite(100, 350, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(16, 16, 'Universal Arcade: Arrow Keys to Move', {
    fontSize: '18px',
    fill: '#f8fafc',
    fontFamily: 'monospace'
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-280);
  }
}
