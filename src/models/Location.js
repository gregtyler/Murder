const world = require('../World.js');

module.exports = class Location {
  constructor(name) {
    this.name = name;
    this.features = [];
  }

  getActors() {
    const _this = this;
    return world.actors.filter(function(actor) {
      return actor.location === _this;
    });
  }

  addFeature(time, feature) {
    this.features.push({time, feature});
  }

  toString() {
    return this.name;
  }
};
