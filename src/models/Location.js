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

  getFeatures(time) {
    const _this = this;
    return world.features.filter(function(feature) {
      return feature._log.filter(log => log.time === time)[0].location === _this;
    });
  }

  addFeature(time, feature) {
    this.features.push({time, feature});
  }

  toString() {
    return this.name;
  }
};
