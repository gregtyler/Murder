import flavour from './flavours/mansion.js';
import Actor from './models/Actor';
import Location from './models/Location';
import Item from './models/Item';
import randomArray from './lib/randomArray';

const world = {
  flavour,
  locations: [],
  actors: [],
  items: [],
  _log: [],
  target: null,
  assassin: null
};

/**
 * Build the world/environment
 */
world.init = function init() {
  // Build an array of locations
  for (const name of flavour.locationNames) {
    world.locations.push(new Location(name));
  }

  // Build an array of actors
  for (const name of flavour.actorNames) {
    const actor = new Actor(name);
    actor.setLocation(randomArray(world.locations));
    world.actors.push(actor);
  }

  // Build an array of items
  for (const itemDetail of flavour.itemDetails) {
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

  for (const item of world.items) {
    item._log = [];
  }

  world._log = [];
};

/**
 * Log a slot in the world
 */
world.log = function(time) {
  this._log.push({time});
};

export default world;
