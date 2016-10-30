module.exports = class Actor {
  constructor(name) {
    this.name = name;
    this.target = null;
    this.location = null;
    this.isAlive = true;
    this._log = [];
  }

  setLocation(location) {
    this.location = location;
  }

  setTarget(target) {
    this.target = target;
  }

  log(time) {
    this._log.push({time, location: this.location});
  }

  toString() {
    return this.name;
  }
};
