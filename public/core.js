'use strict';

/**
 * Select a random entry from an array
 * @param {Array} arr The array to pick from
 * @returns {Mixed} The randomly selected item
 */

/**
 * Select a random entry from an array
 * @param {Array} arr The array to pick from
 * @returns {Mixed} The randomly selected item
 */
var randomArray$3 = function randomArray$3(arr) {
  const id = Math.floor(Math.random() * arr.length);
  return arr[id];
};

const randomArray = randomArray$3;

/**
 * Get the crossover timeline of two locations
 * @param {Actor} actor The actor to build a timeline for
 * @param {Mixed} comparator The Actor or Location to find a crossover with
 * @returns {Array} An array of the timeline where the actor was either in the
 * given location or in the same location as the given actor.
 */

const randomArray$5 = randomArray$3;

var mansion$2 = {
  intro: function(world) {
    // Work out the killing weapon
    const killingWeapon = world.items.find(function(item) {
      return item._log.filter(function(log) {
        return log.time === world.target.deathTime && log.holder === world.assassin;
      }).length > 0;
    });

    // Work out the end time
    const endTime = world.actors[0]._log.reverse()[0].time;

    // Work out who discovered the body
    const discoverer = world.actors.find(function(actor) {
      return actor.isAlive && actor.location === world.target.location;
    });

    // Write some intro text
    return `You have been invited at the request of Dr. Green to a party at his mansion near the picturesque village of Eccleshurst. The party is to celebrate his 50th birthday, and he intends to invite many of his closest friends and colleagues. You've only known the Doctor for a few months, so it's a great privilege to have been invited

The party started at 1100 but, due to botched directions, you arrive at ${endTime}. Just as you arrive, you hear a blood-curdling scream! One of the guests has been murdered and the body of {{victim:${world.target.name}}} was just discovered by {{actor:${discoverer.name}}} in the {{loc:${world.target.location.name}}}. It appears they were killed with the {{item:${killingWeapon.name}}}.

As the only guest who wasn't previously present, and the only attendee with any detective experience, Dr. Green asks you to investigate and orders all of his guests to answer any of your questions.`;
  },
  endCorrect: function(world) {
    const drGreen = world.actors.find(actor => actor.name === 'Dr. Green');
    return `You gather the party guests together in the Sitting Room. The local constabulary have just arrived. "Quite simply", you state, "it was ${world.assassin.name}". The room gasps, and all eyes turn towards ${world.assassin.name}.

"That's right", they say, "I did it! And I would have gotten away with it if it wasn't for this unexpected guest!"

As the police officer cuffs the assassin and takes them away, she says to you. "Thank you so much. You've really saved the day here."` + (drGreen.isAlive ? `

Dr. Green is ecstatic with your work. "What an exciting night! I can only hope my 60th is as wild!"` : '');
  },
  endWrong: function(world, accusee) {
    // Find Dr. Green
    const drGreen = world.actors.find(actor => actor.name === 'Dr. Green');

    // Determine a second victim
    let victim = randomArray$5(world.actors);
    while (!victim.isAlive || victim === accusee || victim === world.assassin) {
      victim = randomArray$5(world.actors);
    }

    return `With the party assembled in the Sitting Room, you explain how you know that ${accusee.name} committed the crime to rapt attention before the police drag the suspect away.

"I'm innocent!" They shout. "Innocent I say!"

` + (drGreen.isAlive ? `"To think I ever trusted them." Dr. Green laments.

` : '') + `However, a month later the investigation finds ${accusee.name} innocent of all charges. Front page headlines spout about "the amateur detective who almost got an innocent person killed". Embarrassed, you vow never to return to Eccleshurst.` + (drGreen.isAlive ? ' And, indeed, you never hear from Dr. Green again.' : '') + `

Two months later, you read a story hidden on page 5 of the newspaper. Another death, and this time it's poor ${victim.name} who's been horribly murdered by an unknown assailant. An amateur detective at the scene, one Hercule Poirot, points to ${world.assassin.name} as the guilty party, but have the police rebuilt their trust in amateurs yet?`;
  },
  actorNames: [
    'Dr. Green',
    'Prof. Coal',
    'Lady Peach',
    'Dame Turquoise',
    'Mr. Pink',
    'Mx. Orchid'
  ],
  locationNames: [
    'Kitchen',
    'Sitting Room',
    'Dining Room',
    'Master Bedroom',
    'Bathroom',
    'Larder',
    'Vestibule'
  ],
  itemDetails: [
    {name: 'Knife', isWeapon: true},
    {name: 'Gun', isWeapon: true},
    {name: 'Candlestick', isWeapon: true},
    {name: 'Lead piping', isWeapon: true},
    {name: 'Rope', isWeapon: true},
    {name: 'Piano wire', isWeapon: true},
    {name: 'Fish tank', isWeapon: false},
    {name: 'Lampshade', isWeapon: false}
  ]
};

/**
 * Get the crossover timeline of two locations
 * @param {Actor} actor The actor to build a timeline for
 * @param {Mixed} comparator The Actor or Location to find a crossover with
 * @returns {Array} An array of the timeline where the actor was either in the
 * given location or in the same location as the given actor.
 */
var getCrossoverTimeline$4 = function getCrossoverTimeline$4(actor, comparator) {
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

  // Add a timeframe to all of the matches
  for (const match of matches) {
    match.timeframe = match.start === match.end ? `at ${match.start}` : `from ${match.start} until ${match.end}`;
  }

  return matches;
};

const world$5 = World$2;
const getCrossoverTimeline$3 = getCrossoverTimeline$4;

var Actor_1$2 = class Actor {
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
    return world$5.items.find(item => (item.holder === this && item.isWeapon === true));
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
    const log = this._log.find(function(log) {
      return log.time === time;
    });

    let response = `At ${time}, I was in the ${log.location.name}.`;

    // List other actors present
    if (log.location.getActors().length > 1) {
      const neighbours = log.location.getActors().filter(a => a !== this);
      response += ' ' + neighbours.map(a => a.name).join(', ') + ' were there.';
    } else {
      response += ' I was alone.';
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
    const matches = getCrossoverTimeline$3(this, actor);

    // Build the response
    if (matches.length) {
      const match = matches[0];
      let response = `I was with ${actor.name} in the ${match.location.name} ${match.timeframe}.`;
      for (const match of matches.slice(1)) {
        response += ` And again in the ${match.location.name} ${match.timeframe}.`;
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
    const matches = getCrossoverTimeline$3(this, location);

    // Build the response
    if (matches.length) {
      const match = matches[0];
      let response = `I was in the ${location.name} ${match.timeframe}.`;
      for (const match of matches.slice(1)) {
        response += ` And again ${match.timeframe}.`;
      }
      return response;
    } else {
      return `I was never in the ${location.name}.`;
    }
  }
};

const world$6 = World$2;

var Location_1$2 = class Location {
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  getActors() {
    const _this = this;
    return world$6.actors.filter(function(actor) {
      return actor.location === _this;
    });
  }

  getItems(time) {
    const _this = this;
    return world$6.items.filter(function(item) {
      if (typeof time === 'undefined') {
        return item.location === _this;
      } else {
        const items = item._log.filter(log => log.time === time && log.holder === null);
        if (items.length) return items[0].location === _this;
      }
    });
  }

  addItem(time, item) {
    this.items.push({time, item});
  }

  toString() {
    return this.name;
  }
};

var Item_1$2 = class Item {
  constructor({name, isWeapon}) {
    this.name = name;
    this.isWeapon = isWeapon;
    this.location = null;
    this.holder = null;
    this._log = [];
  }

  /**
   * Move the item
   */
  setLocation(location) {
    this.location = location;
  }

  /**
   * Change who's holding the item
   */
  setHolder(holder) {
    this.holder = holder;
  }

  /**
   * Log the actor's current location
   */
  log(time) {
    this._log.push({time, holder: this.holder, location: this.location});
  }
};

const flavour$1 = mansion$2;

const world$3 = {
  flavour: flavour$1,
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
world$3.init = function init() {
  const Actor = Actor_1$2;
  const Location = Location_1$2;
  const Item = Item_1$2;
  const randomArray = randomArray$3;

  // Build an array of locations
  for (const name of flavour$1.locationNames) {
    world$3.locations.push(new Location(name));
  }

  // Build an array of actors
  for (const name of flavour$1.actorNames) {
    const actor = new Actor(name);
    actor.setLocation(randomArray(world$3.locations));
    world$3.actors.push(actor);
  }

  // Build an array of items
  for (const itemDetail of flavour$1.itemDetails) {
    const item = new Item(itemDetail);
    item.setLocation(randomArray(world$3.locations));
    world$3.items.push(item);
  }

  // Assign a random assassination
  world$3.target = randomArray(world$3.actors);
  world$3.assassin = randomArray(world$3.actors);
  while (world$3.assassin === world$3.target) {
    // Ensure the assassin isn't targetting themselves
    world$3.assassin = randomArray(world$3.actors);
  }

  world$3.assassin.setTarget(world$3.target);
};

/**
 * Reset the simulation
 */
world$3.reset = function() {
  for (const actor of world$3.actors) {
    actor._log = [];
    actor.isAlive = true;
  }

  for (const item of world$3.items) {
    item._log = [];
  }

  world$3._log = [];
};

/**
 * Log a slot in the world
 */
world$3.log = function(time) {
  this._log.push({time});
};

var World$2 = world$3;

const getCrossoverTimeline = getCrossoverTimeline$4;

const flavour = mansion$2;

const world$1 = {
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
world$1.init = function init() {
  const Actor = Actor_1$2;
  const Location = Location_1$2;
  const Item = Item_1$2;
  const randomArray = randomArray$3;

  // Build an array of locations
  for (const name of flavour.locationNames) {
    world$1.locations.push(new Location(name));
  }

  // Build an array of actors
  for (const name of flavour.actorNames) {
    const actor = new Actor(name);
    actor.setLocation(randomArray(world$1.locations));
    world$1.actors.push(actor);
  }

  // Build an array of items
  for (const itemDetail of flavour.itemDetails) {
    const item = new Item(itemDetail);
    item.setLocation(randomArray(world$1.locations));
    world$1.items.push(item);
  }

  // Assign a random assassination
  world$1.target = randomArray(world$1.actors);
  world$1.assassin = randomArray(world$1.actors);
  while (world$1.assassin === world$1.target) {
    // Ensure the assassin isn't targetting themselves
    world$1.assassin = randomArray(world$1.actors);
  }

  world$1.assassin.setTarget(world$1.target);
};

/**
 * Reset the simulation
 */
world$1.reset = function() {
  for (const actor of world$1.actors) {
    actor._log = [];
    actor.isAlive = true;
  }

  for (const item of world$1.items) {
    item._log = [];
  }

  world$1._log = [];
};

/**
 * Log a slot in the world
 */
world$1.log = function(time) {
  this._log.push({time});
};

const world$7 = World$2;
const randomArray$6 = randomArray$3;
const Item = Item_1$2;

const Simulator = class {
  /**
   * Run the simulation
   */
  run() {
    this.iterations = 0;
    let endSimulation = false;
    let time = 1100;
    while (!endSimulation) {
      time += 100;
      this.iterations++;
      // Move everybody who wants to move
      for (const actor of world$7.actors) {
        if (actor.isAlive) {
          // Move players randomly
          if (Math.random() > 0.75) {
            actor.setLocation(randomArray$6(world$7.locations));
          }
        }
      }

      // If the assassin sees a weapon, then take it
      if (!world$7.assassin.getWeapon() && world$7.assassin.location.getItems().filter(a => a.isWeapon).length) {
        world$7.assassin.location.getItems().find(a => a.isWeapon).holder = world$7.assassin;
      }

      // If the assassin is with their target and their target alone then do the deed
      if (world$7.target.isAlive && world$7.target.location === world$7.assassin.location && world$7.assassin.getWeapon() && world$7.target.location.getActors().length === 2) {
        world$7.target.isAlive = false;
        world$7.target.deathTime = time;
        const corpse = new Item({name: 'Corpse', isWeapon: false});
        world$7.target.location.addItem(time, corpse);
      }

      // Check for evidence
      for (const actor of world$7.actors) {
        for (const neighbour of actor.location.getActors()) {
          if (actor.isAlive && actor !== world$7.assassin && !neighbour.isAlive) {
            endSimulation = true;
          }
        }
      }

      // Log everybody
      for (const actor of world$7.actors) actor.log(time);
      for (const item of world$7.items) item.log(time);
      world$7.log(time);
    }
  }
};

var Simulator_1 = new Simulator();

const world$8 = World$2;

// Colours for command line
const colours = {
  loc: 32,
  item: 35,
  actor: 36,
  victim: 31,
  command: [34, 47]
};

// States
const STATE_START = 1;
const STATE_ASSIGN = 2;
const STATE_SPECIFIC = 3;
const STATE_ACCUSE = 4;
const STATE_CLOSE = 5;

const world$9 = World$2;
const randomArray$7 = randomArray$3;
const Item$1 = Item_1$2;

const Simulator$1 = class {
  /**
   * Run the simulation
   */
  run() {
    this.iterations = 0;
    let endSimulation = false;
    let time = 1100;
    while (!endSimulation) {
      time += 100;
      this.iterations++;
      // Move everybody who wants to move
      for (const actor of world$9.actors) {
        if (actor.isAlive) {
          // Move players randomly
          if (Math.random() > 0.75) {
            actor.setLocation(randomArray$7(world$9.locations));
          }
        }
      }

      // If the assassin sees a weapon, then take it
      if (!world$9.assassin.getWeapon() && world$9.assassin.location.getItems().filter(a => a.isWeapon).length) {
        world$9.assassin.location.getItems().find(a => a.isWeapon).holder = world$9.assassin;
      }

      // If the assassin is with their target and their target alone then do the deed
      if (world$9.target.isAlive && world$9.target.location === world$9.assassin.location && world$9.assassin.getWeapon() && world$9.target.location.getActors().length === 2) {
        world$9.target.isAlive = false;
        world$9.target.deathTime = time;
        const corpse = new Item$1({name: 'Corpse', isWeapon: false});
        world$9.target.location.addItem(time, corpse);
      }

      // Check for evidence
      for (const actor of world$9.actors) {
        for (const neighbour of actor.location.getActors()) {
          if (actor.isAlive && actor !== world$9.assassin && !neighbour.isAlive) {
            endSimulation = true;
          }
        }
      }

      // Log everybody
      for (const actor of world$9.actors) actor.log(time);
      for (const item of world$9.items) item.log(time);
      world$9.log(time);
    }
  }
};

var Simulator_1$2 = new Simulator$1();

const world$10 = World$2;

// Colours for command line
const colours$1 = {
  loc: 32,
  item: 35,
  actor: 36,
  victim: 31,
  command: [34, 47]
};

// States
const STATE_START$1 = 1;
const STATE_ASSIGN$1 = 2;
const STATE_SPECIFIC$1 = 3;
const STATE_ACCUSE$1 = 4;
const STATE_CLOSE$1 = 5;

class InterrogatorCli$1 {
  constructor() {
    this.notes = [];
    this.state = STATE_START$1;
    this.interrogationType = null;
  }
  /**
   * Write formatted text to the command line
   */
  write(text) {
    const textFormatted = text.replace(/\{\{(loc|item|actor|command|victim)\:(.*?)\}\}/g, function(match, type, contents) {
      // Get the colour set as an array
      let colourSet = colours$1[type];
      if (typeof colourSet === 'number') colourSet = [colourSet];
      // Wrap the contents with the colour set
      for (const colour of colourSet) {
        contents = `\u001B[${colour}m${contents}`;
      }
      return contents + '\u001B[0m';
    });

    // Write the contents to the output
    console.log(textFormatted + '\n');
  }

  prompt() {
    if (this.state === STATE_START$1) {
      // Ask what they'd like to do
      this.write('What do you want to interrogate someone about? {{command:time}} {{command:suspect}} {{command:item}} {{command:location}}');
      this.write('You can also use {{command:notes}} to review your notes, or {{command:accuse}} to accuse someone.');

      // Give them a prompt
      process.stdout.write('> ');
    } else if (this.state === STATE_ASSIGN$1) {
      let str = 'Who do you want to interrogate?';

      for (const i in world$10.actors) {
        const actor = world$10.actors[i];
        if (actor.isAlive) {
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${actor.name}`;
        } else {
          str += ` ${parseInt(i, 10) + 1}: ${actor.name}`;
        }
      }

      // Ask what they'd like to do
      this.write(str);

      // Give them a prompt
      process.stdout.write('> ');
    } else if (this.state === STATE_SPECIFIC$1) {
      let str = null;
      // Show different options for each type of interrogation
      if (this.interrogationType === 'time') {
        str = 'What time slot would you like to ask about?';

        for (const i in world$10._log) {
          const log = world$10._log[i];
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${log.time}`;
        }
      } else if (this.interrogationType === 'location') {
        str = 'Which location would you like to ask about?';

        for (const i in world$10.locations) {
          const location = world$10.locations[i];
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${location.name}`;
        }
      } else if (this.interrogationType === 'item') {
        str = 'Which item would you like to ask about?';

        for (const i in world$10.items) {
          const item = world$10.items[i];
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${item.name}`;
        }
      } else if (this.interrogationType === 'suspect') {
        str = 'Which suspect would you like to ask them about?';

        for (const i in world$10.actors) {
          const actor = world$10.actors[i];
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${actor.name}`;
        }
      }

      if (str !== null) {
        // Ask what they'd like to do
        this.write(str);

        // Give them a prompt
        process.stdout.write('> ');
      }
    } else if (this.state === STATE_ACCUSE$1) {
      let str = 'Who do you want to accuse of committing the murder? Enter {{command:cancel}} if you\'re not ready yet.\n\n';

      for (const i in world$10.actors) {
        const actor = world$10.actors[i];
        if (actor.isAlive) {
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${actor.name}`;
        } else {
          str += ` ${parseInt(i, 10) + 1}: ${actor.name}`;
        }
      }

      // Ask what they'd like to do
      this.write(str);

      // Give them a prompt
      process.stdout.write('> ');
    } else if (this.state === STATE_CLOSE$1) {
      process.stdout.write('Press any key to exit.');
    }

    // Ask for user input
    process.stdin.resume();
  }

  /**
   * Respond to user entry
   */
  respond(data) {
    process.stdin.pause();

    const str = data.toString().trim();
    if (str === 'exit') {
      process.exit();
    } else if (str === 'cancel') {
      this.state = STATE_START$1;
    } else if (this.state === STATE_START$1 && ['time', 'suspect', 'item', 'location'].indexOf(str) > -1) {
      this.interrogationType = str;
      this.state = STATE_ASSIGN$1;
    } else if (this.state === STATE_ASSIGN$1 && parseInt(str, 10) > 0 && parseInt(str, 10) <= world$10.actors.length) {
      if (world$10.actors[str - 1].isAlive) {
        // Set the actor
        this.actor = world$10.actors[str - 1];

        // Move to the specifics state
        this.state = STATE_SPECIFIC$1;
      } else {
        this.write('You can\'t interrogate a corpse.');
      }
    } else if (this.state === STATE_ACCUSE$1 && parseInt(str, 10) > 0 && parseInt(str, 10) <= world$10.actors.length) {
      if (world$10.actors[str - 1].isAlive) {
        // Set the actor
        const accusee = world$10.actors[str - 1];

        if (accusee === world$10.assassin) {
          this.write(world$10.flavour.endCorrect(world$10));
        } else {
          this.write(world$10.flavour.endWrong(world$10, accusee));
        }

        // Move to the closed state
        this.state = STATE_CLOSE$1;
      } else {
        this.write('It plainly wasn\'t a suicide.');
      }
    } else if (this.state === STATE_SPECIFIC$1) {
      let response = null;
      if (this.interrogationType === 'location' && parseInt(str, 10) > 0 && parseInt(str, 10) <= world$10.locations.length) {
        // Perform the interrogation
        response = this.actor.interrogateLocation(world$10.locations[str - 1]);
      } else if (this.interrogationType === 'time' && parseInt(str, 10) > 0 && parseInt(str, 10) <= world$10.actors[0]._log.length) {
        // Perform the interrogation
        response = this.actor.interrogateTime(world$10.actors[0]._log[str - 1].time);
      } else if (this.interrogationType === 'item' && parseInt(str, 10) > 0 && parseInt(str, 10) <= world$10.items.length) {
        // Perform the interrogation
        response = this.actor.interrogateItem(world$10.items[str - 1]);
      } else if (this.interrogationType === 'suspect' && parseInt(str, 10) > 0 && parseInt(str, 10) <= world$10.actors.length) {
        // Perform the interrogation
        response = this.actor.interrogateNeighbour(world$10.actors[str - 1]);
      }

      this.notes.push(`${this.actor.name}: ${response}`);
      this.write(response);

      // Reset the state
      this.state = STATE_START$1;
      this.interrogationType = null;
    } else if (this.state === STATE_START$1 && str === 'accuse') {
      this.state = STATE_ACCUSE$1;
    } else if (this.state === STATE_CLOSE$1) {
      process.exit();
    } else if (str === 'notes') {
      this.write(this.notes.join('\n'));
    } else {
      this.write(`I don't understand the command "${str}"`);
    }

    this.prompt();
   }

  /**
   * Begin the interrogation process
   */
  start() {
    // Figure out how to respond
    process.stdin.on('data', this.respond.bind(this));

    // Clear the screen
    process.stdout.write('\x1Bc');

    // Write the intro
    this.write(world$10.flavour.intro(world$10));
    this.notes.push(world$10.flavour.intro(world$10));

    this.prompt();
  }
}

var interrogatorCli$3 = new InterrogatorCli$1();

const world = World$2;
const simulator = Simulator_1$2;
const interrogatorCli = interrogatorCli$3;

// Build the world
world.init();

// Run the simulation until the target gets killed
while (world.target.isAlive || simulator.iterations > 12) {
  world.reset();
  simulator.run();
}

// Being the interrogator
interrogatorCli.start();

var index = {

};

module.exports = index;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
