const world = require('./src/World');
const simulator = require('./src/components/Simulator');
const interrogatorCli = require('./src/components/interrogatorCli');

// Build the world
world.init();

// Run the simulation until the target gets killed
while (world.target.isAlive || simulator.iterations > 12) {
  world.reset();
  simulator.run();
}

// Interrogate the assassin
const response = world.actors[0].interrogateLocation(world.locations[0]);

console.log(`${world.actors[0].name}: ${response}`);

// Being the interrogator
interrogatorCli.start();
