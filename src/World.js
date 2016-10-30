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

const featureDetails = [
  {name: 'Knife', isWeapon: true},
  {name: 'Gun', isWeapon: true},
  {name: 'Candlestick', isWeapon: true}
];

const world = {
  locations: [],
  actors: [],
  features: [],
  target: null,
  assassin: null
};

/**
 * Build the world/environment
 */
world.init = function init() {
  const Actor = require('./models/Actor');
  const Location = require('./models/Location');
  const Feature = require('./models/Feature');
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

  // Build an array of features
  for (const featureDetail of featureDetails) {
    const feature = new Feature(featureDetail);
    feature.setLocation(randomArray(world.locations));
    world.features.push(feature);
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
  }
};

module.exports = world;
