# Super Mario Bros Style Platformer

A simple browser-based platformer game built with Kaboom.js, inspired by Super Mario Bros.

## How to Play

1. Open `index.html` in your web browser
2. Use the following controls:
   - **Left Arrow**: Move left
   - **Right Arrow**: Move right  
   - **Spacebar**: Jump
   - **R**: Restart game (when game over or level complete)
   - **SPACE**: Advance to next level (when level complete)
## Game Features

### Core Gameplay
- **Player Character**: Red rectangle that can move and jump
- **Physics**: Realistic gravity and collision detection
- **Platforms**: Multiple platforms to jump between
- **Camera**: Follows the player as they move through the level
- **3 Levels**: Progressively challenging levels with different layouts

### Level Progression
- **Level 1**: 3 coins, 1 enemy - Basic platforming
- **Level 2**: 5 coins, 2 enemies - More complex layout
- **Level 3**: 7 coins, 3 enemies - Advanced challenge
- **Level Complete**: Collect all coins to advance to next level
- **Game Complete**: Beat all 3 levels to win!

### Enemies & Collectibles
- **Enemies**: Magenta rectangles that move back and forth
  - Jump on top to defeat (stomp) and earn 20 points
  - Touch from the side = Game Over
- **Coins**: Gold circles worth 10 points each
  - Collect ALL coins in a level to advance to the next level
  - Coin counter shows progress (e.g., "Coins: 2/5")

### Audio
- **Jump Sound**: Plays when jumping
- **Coin Sound**: Plays when collecting coins
- **Enemy Defeat Sound**: Plays when stomping enemies

### Scoring System
- Coins: +10 points each
- Enemy stomps: +20 points each
- Score is displayed in the top-left corner

## Technical Details

### File Structure
- `index.html` - Main HTML file with Kaboom.js CDN
- `style.css` - Styling for the game canvas and UI
- `game.js` - Complete game logic and mechanics

### Game Architecture
- **Scenes**: Main game scene and game over scene
- **Physics**: Kaboom.js built-in physics engine
- **Audio**: Web Audio API for sound effects
- **Collision Detection**: Built-in collision system

### Expandability
The code is organized to make it easy to add:
- More levels
- Different enemy types
- Power-ups
- More complex level designs
- Sprite animations
- Background music

## Getting Started

Simply open `index.html` in any modern web browser. No additional setup or installation required!

## Code Comments

The code includes extensive comments explaining:
- How each game system works
- Physics and collision detection
- Audio implementation
- Game state management
- Scene transitions

This makes it perfect for learning game development concepts!
