const world = require('./src/World');
const randomArray = require('./src/lib/randomArray');
const Item = require('./src/models/Item');

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

    // If the assassin sees a weapon, then take it
    if (world.assassin.location.getItems().filter(a => a.isWeapon).length) {
      world.assassin.location.getItems().filter(a => a.isWeapon)[0].holder = world.assassin;
    }

    // If the assassin is with their target and their target alone then do the deed
    if (world.target.isAlive && world.target.location === world.assassin.location && world.assassin.getWeapon().length && world.target.location.getActors().length === 2) {
      world.target.isAlive = false;
      const corpse = new Item({name: 'Corpse', isWeapon: false});
      world.target.location.addItem(time, corpse);

      console.log(`Weapon: ${world.assassin.getWeapon()[0].name}. Killer: ${world.assassin.name}`);
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
    for (const item of world.items) item.log(time);
  }
}

// Run the simulation until the target gets killed
while (world.target.isAlive) {
  world.reset();
  runSimulation();
}

// Interrogate the assassin
const response = world.actors[0].interrogateLocation(world.locations[0]);

console.log(`${world.actors[0].name}: ${response}`);
