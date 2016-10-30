const world = require('../World.js');

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
    const matches = [];
    let locationMatch = null;
    for (const i in this._log) {
      const time = this._log[i].time;
      if (actor._log[i].location === this._log[i].location) {
        const currentLocation = this._log[i].location;
        // If the location changes, push a new location
        if (currentLocation !== locationMatch) {
          if (matches.length) {
            matches[matches.length - 1].end = time;
          }

          locationMatch = currentLocation;
          matches.push({start: time, location: currentLocation});
        }
      } else if (locationMatch !== null) {
        matches[matches.length - 1].end = time;
        locationMatch = null;
      }
    }

    // If they finish in the same room, tie off the time spent together
    if (locationMatch !== null) {
      matches[matches.length - 1].end = Math.max.apply(this, this._log.map(a => a.time));
      locationMatch = null;
    }

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
};
