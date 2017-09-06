
// here we initate our game and attach it to the 'gameDiv' div on our HTML
const game = new Phaser.Game((window.innerWidth * .75), 500, Phaser.AUTO, 'gameDiv');


// what the heck is mainstate? well this is our first 'stage' in the game
var mainState = { 

  // the preload function is a built in function that gets called to load all of our assets before we begin playing
  preload: function() {
    game.load.spritesheet('bart', 'assets/bartSprite.png', 53, 52, 6);
    game.load.image('background', 'assets/sky.jpg'); 
    game.load.image('palms', 'assets/palmtrees.png');
    game.load.image('sidewalk', 'assets/sidewalk.png');
    game.load.image('barrel', 'assets/barrel.png');
  },


  // the create function initializes all the in game objects and sets their traits - this is also called by phaser
  create: function() {

    // initilaize a physics system - arcade physics are just very simple physics and collision detection
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // create our background sky - a tileSprite repeats... this will give a loop effect
    sky = game.add.tileSprite(0, 0, 1240, 700, 'background');

    // scale it up a bit for sizing
    sky.scale.x = 1.5;
    sky.scale.y = 1.5;

    // add a layer of palm trees
    palms = game.add.tileSprite(0, 0, 2000, 500, 'palms');

    // add the sidewalk to skate on
    sidewalk = game.add.tileSprite(-10, 440, 1000, 100, 'sidewalk');


    // create our player, scale, it, and create a health property
    player = game.add.sprite(10, 10, 'bart');
    player.scale.y = 2;
    player.scale.x = 2;
    player.health = 100;
 
    // here we play an animation - this is comprised of different frames we created from our spritesheet in the preload function
    player.animations.add('skate', [0, 1, 2, 3, 4, 6], 10, true);
    player.animations.play('skate');

    // here we turn on the physics for our player, and add gravity
    game.physics.arcade.enable([sidewalk, player]);
    game.physics.arcade.gravity.y = 500;

    // this keeps our player from falling off the edge of the screen
    player.body.collideWorldBounds = true;

    // because our sidewalk is affected by physics - we need to tell the game to hold it still!
    sidewalk.body.allowGravity = false;
    sidewalk.body.immovable = true;

    // this function creates a barrel and sends it back toward bart
    barrel = game.add.sprite((window.innerWidth * .75) - 50, 200, 'barrel');
    game.physics.arcade.enable(barrel);
    barrel.body.acceleration.x = -100;


    // this initilizes listeners on our arrowkeys
    cursors = game.input.keyboard.createCursorKeys();

    // this is like a setTimeout and calls our custom 'addBarrel' function with, as you guessed it, will add a barrel
    game.time.events.loop(Math.random() * 10000, this.addBarrel);

    // here we display the health at the top left corner of the screen
    healthText = 'h e a l t h   ' + player.health;
    health = game.add.text(16, 16, healthText, {fontSize: '25px', fill: '#FF69B4', font: 'TrebuchetMS'});
  },


  // the update function is called by phaser every frame! here we check for collision, and add forces and movement
  update: function() {

    // these will nudge our position of our tilesets- they loop so they are constantly being shifted a different speeds to create the illusion of movement
    sky.tilePosition.x -= 2;
    palms.tilePosition.x -= 4;
    sidewalk.tilePosition.x -= 1;

    // these are simple collision checks between our objects- so they dont overlap!
    game.physics.arcade.collide(player, sidewalk);
    game.physics.arcade.collide(barrel, sidewalk);

    // here when we experience a collision between a player and a barrel, we call a custom function that will decrement the players health
    // update our score, and if the player is dead, start the 'game over' stage
    game.physics.arcade.collide(player, barrel, function() {
      player.health -= 1;
      health.text = 'h e a l t h   ' + player.health;
      if (player.health < 1) {
        game.state.start('gameover');
      }
    });

    // this resets our accelleration - kind tricky to explain but without it we would get continual build up of acceleration
    player.body.acceleration.setTo(0, 0);

    // here we accelerate or decelerate based on which arrow key we are pushing down
    if (cursors.left.isDown) {
      player.body.acceleration.x = -300;
    } else if (cursors.right.isDown) {
      player.body.acceleration.x = 300;
    }

    // if we hit up, and we're currently on the ground, lets jump!
    if (cursors.up.isDown && player.body.touching.down) {
      player.body.acceleration.y = -20000;   
    }
  },

  // our custom function that gets called on our timer. note, barrel is being overwritten - so we cant have more than one on the screen at a time
  addBarrel: function() {

    barrel = game.add.sprite((window.innerWidth * .75) - 50, 200, 'barrel');
    game.physics.arcade.enable(barrel);
    barrel.body.acceleration.x = -100;
  },
};

// a very simple game over 'stage' just displaying an image
var gameover = {
  preload: function() {
    game.load.image('gameover', 'assets/gameover.png'); 
  },

  create: function() {
    endscreen = game.add.sprite(0, 0, 'gameover');
    endscreen.width = (window.innerWidth * .75);
    endscreen.height = 500;

  }
};

// these add our stages to our game, and then calls our first 'main' stage
game.state.add('main', mainState);
game.state.add('gameover', gameover);
game.state.start('main');
