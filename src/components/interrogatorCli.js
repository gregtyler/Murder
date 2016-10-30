const world = require('../World');

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

class InterrogatorCli {
  constructor() {
    this.notes = [];
    this.state = STATE_START;
    this.interrogationType = null;
  }
  /**
   * Write formatted text to the command line
   */
  write(text) {
    const textFormatted = text.replace(/\{\{(loc|item|actor|command|victim)\:(.*?)\}\}/g, function(match, type, contents) {
      // Get the colour set as an array
      let colourSet = colours[type];
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
    if (this.state === STATE_START) {
      // Ask what they'd like to do
      this.write('What do you want to interrogate someone about? {{command:time}} {{command:suspect}} {{command:item}} {{command:location}}');
      this.write('You can also use {{command:notes}} to review your notes, or {{command:accuse}} to accuse someone.');

      // Give them a prompt
      process.stdout.write('> ');
    } else if (this.state === STATE_ASSIGN) {
      let str = 'Who do you want to interrogate?';

      for (const i in world.actors) {
        const actor = world.actors[i];
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
    } else if (this.state === STATE_SPECIFIC) {
      let str = null;
      // Show different options for each type of interrogation
      if (this.interrogationType === 'time') {
        str = 'What time slot would you like to ask about?';

        for (const i in world._log) {
          const log = world._log[i];
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${log.time}`;
        }
      } else if (this.interrogationType === 'location') {
        str = 'Which location would you like to ask about?';

        for (const i in world.locations) {
          const location = world.locations[i];
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${location.name}`;
        }
      } else if (this.interrogationType === 'item') {
        str = 'Which item would you like to ask about?';

        for (const i in world.items) {
          const item = world.items[i];
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${item.name}`;
        }
      } else if (this.interrogationType === 'suspect') {
        str = 'Which suspect would you like to ask them about?';

        for (const i in world.actors) {
          const actor = world.actors[i];
          str += ` {{command:${parseInt(i, 10) + 1}}}: ${actor.name}`;
        }
      }

      if (str !== null) {
        // Ask what they'd like to do
        this.write(str);

        // Give them a prompt
        process.stdout.write('> ');
      }
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
      this.state = STATE_START;
    } else if (this.state === STATE_START && ['time', 'suspect', 'item', 'location'].indexOf(str) > -1) {
      this.interrogationType = str;
      this.state = STATE_ASSIGN;
    } else if (this.state === STATE_ASSIGN && parseInt(str, 10) > 0 && parseInt(str, 10) <= world.actors.length) {
      if (world.actors[str - 1].isAlive) {
        // Set the actor
        this.actor = world.actors[str - 1];

        // Move to the specifics state
        this.state = STATE_SPECIFIC;
      } else {
        this.write('You can\'t interrogate a corpse.');
      }
    } else if (this.state === STATE_SPECIFIC) {
      let response = null;
      if (this.interrogationType === 'location' && parseInt(str, 10) > 0 && parseInt(str, 10) <= world.locations.length) {
        // Perform the interrogation
        response = this.actor.interrogateLocation(world.locations[str - 1]);
      } else if (this.interrogationType === 'time' && parseInt(str, 10) > 0 && parseInt(str, 10) <= world.actors[0]._log.length) {
        // Perform the interrogation
        response = this.actor.interrogateTime(world.actors[0]._log[str - 1].time);
      } else if (this.interrogationType === 'item' && parseInt(str, 10) > 0 && parseInt(str, 10) <= world.items.length) {
        // Perform the interrogation
        response = this.actor.interrogateItem(world.items[str - 1]);
      } else if (this.interrogationType === 'suspect' && parseInt(str, 10) > 0 && parseInt(str, 10) <= world.actors.length) {
        // Perform the interrogation
        response = this.actor.interrogateNeighbour(world.actors[str - 1]);
      }

      this.notes.push(`${this.actor.name}: ${response}`);
      this.write(response);

      // Reset the state
      this.state = STATE_START;
      this.interrogationType = null;
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
    this.write(world.flavour.intro(world));

    this.prompt();
  }
};

module.exports = new InterrogatorCli();
