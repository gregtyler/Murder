const actorNames = [
  'Dr. Green',
  'Prof. Coal',
  'Lady Peach',
  'Dame Turquoise',
  'Mr. Pink',
  'Mx. Orchid'
];

const locationNames = [
  'Kitchen',
  'Sitting Room',
  'Dining Room',
  'Master Bedroom',
  'Bathroom',
  'Larder',
  'Vestibule'
];

const itemDetails = [
  {name: 'Knife', isWeapon: true},
  {name: 'Gun', isWeapon: true},
  {name: 'Candlestick', isWeapon: true},
  {name: 'Lead piping', isWeapon: true},
  {name: 'Rope', isWeapon: true},
  {name: 'Piano wire', isWeapon: true},
  {name: 'Fish tank', isWeapon: false},
  {name: 'Lampshade', isWeapon: false}
];

const world = {
  locations: [],
  actors: [],
  items: [],
  target: null,
  assassin: null
};

/**
 * Build the world/environment
 */
world.init = function init() {
  const Actor = require('./models/Actor');
  const Location = require('./models/Location');
  const Item = require('./models/Item');
  const randomArray = require('./lib/randomArray');

  // Build an array of locations
  for (const name of locationNames) {
    world.locations.push(new Location(name));
  }

  // Build an array of actors
  for (const name of actorNames) {
    const actor = new Actor(name);
    actor.setLocation(randomArray(world.locations));
    world.actors.push(actor);
  }

  // Build an array of items
  for (const itemDetail of itemDetails) {
    const item = new Item(itemDetail);
    item.setLocation(randomArray(world.locations));
    world.items.push(item);
  }

  // Assign a random assassination
  world.target = randomArray(world.actors);
  world.assassin = randomArray(world.actors);
  while (world.assassin === world.target) {
    // Ensure the assassin isn't targetting themselves
    world.assassin = randomArray(world.actors);
  }

  world.assassin.setTarget(world.target);
};

/**
 * Reset the simulation
 */
world.reset = function() {
  for (const actor of world.actors) {
    actor._log = [];
    actor.isAlive = true;
  }

  console.log('------- RESET ---------');
};

module.exports = world;
