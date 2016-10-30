module.exports = class Feature {
  constructor({name, isWeapon}) {
    this.name = name;
    this.isWeapon = isWeapon;
    this.location = null;
    this.holder = null;
    this._log = [];
  }

  /**
   * Move the feature
   */
  setLocation(location) {
    this.location = location;
  }

  /**
   * Change who's holding the feature
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
