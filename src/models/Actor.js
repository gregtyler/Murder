const world = require('../World.js');

/**
 * Get the crossover timeline of two locations
 * @param {Actor} actor The actor to build a timeline for
 * @param {Mixed} comparator The Actor or Location to find a crossover with
 * @returns {Array} An array of the timeline where the actor was either in the
 * given location or in the same location as the given actor.
 */
function getCrossoverTimeline(actor, comparator) {
  const matches = [];
  let locationMatch = null;
  let prevTime;
  for (const i in actor._log) {
    const time = actor._log[i].time;
    if (
      (comparator.constructor.name === 'Actor' && comparator._log[i].location === actor._log[i].location) ||
      (comparator.constructor.name === 'Location' && comparator === actor._log[i].location)
    ) {
      const currentLocation = actor._log[i].location;
      // If the location changes, push a new location
      if (currentLocation !== locationMatch) {
        if (matches.length && typeof matches[matches.length - 1].end === 'undefined') {
          matches[matches.length - 1].end = prevTime;
        }

        locationMatch = currentLocation;
        matches.push({start: time, location: currentLocation});
      }
    } else if (locationMatch !== null) {
      matches[matches.length - 1].end = prevTime;
      locationMatch = null;
    }

    prevTime = time;
  }

  // If they finish in the same room, tie off the time spent together
  if (locationMatch !== null) {
    matches[matches.length - 1].end = Math.max.apply(process, actor._log.map(a => a.time));
    locationMatch = null;
  }

  return matches;
}

module.exports = class Actor {
  constructor(name) {
    this.name = name;
    this.target = null;
    this.location = null;
    this.isAlive = true;
    this._log = [];
  }

  /**
   * Move the actor
   */
  setLocation(location) {
    this.location = location;
  }

  /**
   * Set a target to kill
   */
  setTarget(target) {
    this.target = target;
  }

  /**
   * Get the weapon the actor has
   */
  getWeapon() {
    return world.items.filter(item => (item.holder === this && item.isWeapon === true));
  }

  /**
   * Log the actor's current location
   */
  log(time) {
    this._log.push({time, location: this.location});
  }

  /**
   * Interrogate the actor for where they were at a certain time
   * @param {Integer} time The time being asked about
   * @returns {String} The response from the actor
   */
  interrogateTime(time) {
    const log = this._log.filter(function(log) {
      return log.time === time;
    })[0];

    let response = `At ${time}, I was in the ${log.location.name}.`;

    // List other actors present
    if (log.location.getActors().length > 1) {
      const neighbours = log.location.getActors().filter(a => a !== this);
      response += ' ' + neighbours.map(a => a.name).join(', ') + ' were there.';
    }

    // List items in the room
    if (log.location.getItems(time).length) {
      const items = log.location.getItems(time);
      response += ' In the room were: ' + items.map(a => a.name).join(', ');
    }

    return response;
  }

  /**
   * Interrogate the actor for when they saw a neighbour
   * @param {Actor} actor The neighbour being asked about
   * @returns {String} The response from the actor
   */
  interrogateNeighbour(actor) {
    const matches = getCrossoverTimeline(this, actor);

    // Build the response
    if (matches.length) {
      const match = matches[0];
      let response = `I was with ${actor.name} in the ${match.location.name} from ${match.start} until ${match.end}.`;
      for (const match of matches.slice(1)) {
        response += ` And again in the ${match.location.name} from ${match.start} until ${match.end}.`;
      }
      return response;
    } else {
      return `I never saw ${actor.name}.`;
    }
  }

  /**
   * Interrogate the actor for where they last saw an item
   * @param {Item} item The item being asked about
   * @returns {String} The response from the actor
   */
  interrogateItem(item) {
    // Find all times that the
    const crossoverLogs = this._log.filter(function(log, index) {
      return item._log[index].location === log.location;
    });

    if (crossoverLogs.length) {
      const lastSighting = crossoverLogs.reverse()[0];
      return `I last saw the ${item.name} in the ${lastSighting.location.name} at ${lastSighting.time}.`;
    } else {
      return `I never saw the ${item.name}.`;
    }
  }

  /**
   * Interrogate the actor for when they were in a location
   * @param {Location} location The location being asked about
   * @returns {String} The response from the actor
   */
  interrogateLocation(location) {
    const matches = getCrossoverTimeline(this, location);

    // Build the response
    if (matches.length) {
      const match = matches[0];
      let response = `I was in the ${location.name} from ${match.start} until ${match.end}.`;
      for (const match of matches.slice(1)) {
        response += ` And again from ${match.start} until ${match.end}.`;
      }
      return response;
    } else {
      return `I was never in the ${location.name}.`;
    }
  }
};
