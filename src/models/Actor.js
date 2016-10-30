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
   * Log the actor's current location
   */
  log(time) {
    this._log.push({time, location: this.location});
  }

  /**
   * Interrogate the actor for information
   */
  interrogate(questions) {
    const log = this._log.filter(function(log) {
      return log.time === questions.time;
    })[0];

    let response = `At ${questions.time}, I was in the ${log.location.name}.`;

    // List other actors present
    if (log.location.getActors().length > 1) {
      const neighbours = log.location.getActors().filter(a => a !== this);
      response += ' ' + neighbours.map(a => a.name).join(', ') + ' were there.';
    }

    // List items in the room
    if (log.location.getFeatures(questions.time).length) {
      const features = log.location.getFeatures(questions.time);
      response += ' In the room were: ' + features.map(a => a.name).join(', ');
    }

    return response;
  }
};
