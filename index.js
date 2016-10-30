const world = require('./src/World');
const randomArray = require('./src/lib/randomArray');

// Build the world
world.init();

/**
 * Run the simulation
 */
function runSimulation() {
  for (let time = 1; time < 12; time++) {
    // Move everybody who wants to move
    for (const actor of world.actors) {
      if (actor.isAlive) {
        // Move players randomly
        if (Math.random() > 0.75) {
          actor.setLocation(randomArray(world.locations));
        }
      }
    }

    // If the assassin is with their target and their target alone then do the deed
    if (world.target.isAlive && world.target.location === world.assassin.location && world.target.location.getActors().length === 2) {
      world.target.isAlive = false;
      world.target.location.addFeature(time, 'corpse');
    }

    // Check for evidence
    for (const actor of world.actors) {
      for (const neighbour of actor.location.getActors()) {
        if (actor.isAlive && actor !== world.assassin && !neighbour.isAlive) {
          console.log(`${actor.name} discovered ${neighbour.name}'s body at ${time}`);
        }
      }
    }

    // Log everybody
    for (const actor of world.actors) actor.log(time);
    for (const feature of world.features) feature.log(time);
  }
}

// Run the simulation until the target gets killed
while (world.target.isAlive) {
  world.reset();
  runSimulation();
}

// Interrogate the assassin
const response = world.actors[0].interrogate({
  time: 11
});

console.log(`${world.actors[0].name}: ${response}`);
