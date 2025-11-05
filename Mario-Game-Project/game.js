// Super Mario Bros Style Platformer Game
// Using Kaboom.js for game development

// Initialize Kaboom.js with game settings
kaboom({
    width: 800,
    height: 600,
    canvas: document.getElementById("game-canvas"),
    background: [135, 206, 235], // Sky blue background
});

// Game state variables
let score = 0;
let gameSpeed = 1;
let currentLevel = 1;
let totalCoins = 0;
let coinsCollected = 0;

// Load sprites and sounds (using simple colored rectangles for now)
// In a real game, you'd load actual sprite images here

// Create simple sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playJumpSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playCoinSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1047, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playEnemyDefeatSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Define game objects
const PLAYER_SPEED = 200;
const JUMP_FORCE = 400;
const GRAVITY = 800;

// Level data - each level has platforms, coins, and enemies
const levels = {
    1: {
        platforms: [
            { x: 300, y: 400, width: 200, height: 20 },
            { x: 600, y: 300, width: 150, height: 20 },
            { x: 100, y: 250, width: 100, height: 20 }
        ],
        coins: [
            { x: 350, y: 350 },
            { x: 650, y: 250 },
            { x: 150, y: 200 }
        ],
        enemies: [
            { x: 400, y: 500, direction: 1 }
        ]
    },
    2: {
        platforms: [
            { x: 200, y: 450, width: 150, height: 20 },
            { x: 400, y: 350, width: 100, height: 20 },
            { x: 600, y: 250, width: 120, height: 20 },
            { x: 100, y: 150, width: 80, height: 20 }
        ],
        coins: [
            { x: 250, y: 400 },
            { x: 450, y: 300 },
            { x: 650, y: 200 },
            { x: 150, y: 100 },
            { x: 500, y: 100 }
        ],
        enemies: [
            { x: 300, y: 450, direction: 1 },
            { x: 550, y: 250, direction: -1 }
        ]
    },
    3: {
        platforms: [
            { x: 150, y: 500, width: 100, height: 20 },
            { x: 300, y: 400, width: 80, height: 20 },
            { x: 450, y: 300, width: 100, height: 20 },
            { x: 600, y: 200, width: 80, height: 20 },
            { x: 100, y: 100, width: 60, height: 20 },
            { x: 700, y: 100, width: 60, height: 20 }
        ],
        coins: [
            { x: 200, y: 450 },
            { x: 350, y: 350 },
            { x: 500, y: 250 },
            { x: 650, y: 150 },
            { x: 150, y: 50 },
            { x: 750, y: 50 },
            { x: 400, y: 50 }
        ],
        enemies: [
            { x: 200, y: 500, direction: 1 },
            { x: 400, y: 300, direction: -1 },
            { x: 650, y: 200, direction: 1 }
        ]
    }
};

// Set up physics
setGravity(GRAVITY);

// Function to load a level
function loadLevel(levelNumber) {
    // Clear existing objects
    destroyAll();
    
    const level = levels[levelNumber];
    if (!level) {
        go("gameComplete");
        return;
    }
    
    // Reset level variables
    coinsCollected = 0;
    totalCoins = level.coins.length;
    
    // Add score and level display
    const scoreText = add([
        text(`Score: ${score}`, { size: 24 }),
        pos(20, 20),
        fixed(),
        color(255, 255, 255),
        z(1000)
    ]);
    
    const levelText = add([
        text(`Level: ${currentLevel}`, { size: 24 }),
        pos(20, 50),
        fixed(),
        color(255, 255, 255),
        z(1000)
    ]);
    
    const coinsText = add([
        text(`Coins: ${coinsCollected}/${totalCoins}`, { size: 20 }),
        pos(20, 80),
        fixed(),
        color(255, 255, 0),
        z(1000)
    ]);

    // Create ground platform
    add([
        rect(width(), 60),
        pos(0, height() - 60),
        area(),
        body({ isStatic: true }),
        color(34, 139, 34), // Forest green
        "ground"
    ]);

    // Create platforms for this level
    level.platforms.forEach(platform => {
        add([
            rect(platform.width, platform.height),
            pos(platform.x, platform.y),
            area(),
            body({ isStatic: true }),
            color(139, 69, 19), // Brown
            "platform"
        ]);
    });

    // Create player character
    const player = add([
        rect(32, 32),
        pos(100, height() - 200),
        area(),
        body(),
        color(255, 0, 0), // Red
        "player"
    ]);

    // Player movement controls
    onKeyDown("left", () => {
        player.move(-PLAYER_SPEED, 0);
    });

    onKeyDown("right", () => {
        player.move(PLAYER_SPEED, 0);
    });

    // Simple jump with cooldown to prevent freezing
    let jumpCooldown = 0;
    
    onKeyPress("space", () => {
        // Allow jump if not in cooldown and player is moving downward or stationary
        if (jumpCooldown <= 0 && player.vel.y >= -50) {
            player.jump(JUMP_FORCE);
            playJumpSound(); // Play jump sound effect
            jumpCooldown = 10; // Small cooldown to prevent rapid jumping
        }
    });
    
    // Update jump cooldown
    onUpdate(() => {
        if (jumpCooldown > 0) {
            jumpCooldown--;
        }
    });

    // Create enemies for this level
    level.enemies.forEach(enemyData => {
        const enemy = add([
            rect(24, 24),
            pos(enemyData.x, enemyData.y),
            area(),
            body({ isStatic: true }),
            color(255, 0, 255), // Magenta
            "enemy"
        ]);

        // Enemy movement
        let enemyDirection = enemyData.direction;
        enemy.onUpdate(() => {
            enemy.move(50 * enemyDirection, 0);
            
            // Reverse direction when hitting platform edges
            if (enemy.pos.x <= 0 || enemy.pos.x >= width() - 24) {
                enemyDirection *= -1;
            }
        });
    });

    // Create coins for this level
    level.coins.forEach(coinData => {
        add([
            circle(12),
            pos(coinData.x, coinData.y),
            area(),
            color(255, 215, 0), // Gold
            "coin"
        ]);
    });

    // Collision detection for coins
    player.onCollide("coin", (coin) => {
        destroy(coin);
        coinsCollected++;
        score += 10;
        scoreText.text = `Score: ${score}`;
        coinsText.text = `Coins: ${coinsCollected}/${totalCoins}`;
        playCoinSound(); // Play coin collection sound
        
        // Check if all coins collected
        if (coinsCollected >= totalCoins) {
            // Level complete!
            setTimeout(() => {
                currentLevel++;
                go("levelComplete");
            }, 500);
        }
    });

    // Collision detection for enemy
    player.onCollide("enemy", (enemy) => {
        // Check if player is above enemy (stomping)
        if (player.pos.y < enemy.pos.y - 10) {
            // Player stomped the enemy
            destroy(enemy);
            score += 20;
            scoreText.text = `Score: ${score}`;
            playEnemyDefeatSound(); // Play enemy defeat sound
        } else {
            // Player hit enemy from side - game over
            go("gameOver");
        }
    });

    // Camera follows player
    player.onUpdate(() => {
        camPos(player.pos);
    });

    // Keep player in bounds
    player.onUpdate(() => {
        if (player.pos.x < 0) player.pos.x = 0;
        if (player.pos.x > width() - 32) player.pos.x = width() - 32;
    });
}

// Create the main game scene
scene("game", () => {
    loadLevel(currentLevel);
});

// Level complete scene
scene("levelComplete", () => {
    add([
        text(`Level ${currentLevel - 1} Complete!`, { size: 48 }),
        pos(width()/2, height()/2 - 60),
        color(0, 255, 0),
        anchor("center")
    ]);

    add([
        text(`Score: ${score}`, { size: 24 }),
        pos(width()/2, height()/2 - 20),
        color(255, 255, 255),
        anchor("center")
    ]);

    add([
        text("Press SPACE for Next Level", { size: 20 }),
        pos(width()/2, height()/2 + 20),
        color(255, 255, 255),
        anchor("center")
    ]);

    add([
        text("Press R to Restart", { size: 18 }),
        pos(width()/2, height()/2 + 50),
        color(200, 200, 200),
        anchor("center")
    ]);

    onKeyPress("space", () => {
        go("game");
    });

    onKeyPress("r", () => {
        score = 0;
        currentLevel = 1;
        go("game");
    });
});

// Game complete scene
scene("gameComplete", () => {
    add([
        text("Congratulations!", { size: 48 }),
        pos(width()/2, height()/2 - 80),
        color(255, 215, 0),
        anchor("center")
    ]);

    add([
        text("You completed all levels!", { size: 24 }),
        pos(width()/2, height()/2 - 40),
        color(255, 255, 255),
        anchor("center")
    ]);

    add([
        text(`Final Score: ${score}`, { size: 28 }),
        pos(width()/2, height()/2),
        color(255, 255, 0),
        anchor("center")
    ]);

    add([
        text("Press R to Play Again", { size: 20 }),
        pos(width()/2, height()/2 + 40),
        color(255, 255, 255),
        anchor("center")
    ]);

    onKeyPress("r", () => {
        score = 0;
        currentLevel = 1;
        go("game");
    });
});

// Game over scene
scene("gameOver", () => {
    add([
        text("Game Over!", { size: 48 }),
        pos(width()/2, height()/2),
        color(255, 0, 0),
        anchor("center")
    ]);

    add([
        text(`Final Score: ${score}`, { size: 24 }),
        pos(width()/2, height()/2 + 60),
        color(255, 255, 255),
        anchor("center")
    ]);

    add([
        text("Press R to Restart", { size: 20 }),
        pos(width()/2, height()/2 + 100),
        color(255, 255, 255),
        anchor("center")
    ]);

    onKeyPress("r", () => {
        score = 0;
        currentLevel = 1;
        go("game");
    });
});

// Start the game
go("game");
