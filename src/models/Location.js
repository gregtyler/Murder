const world = require('../World.js');

module.exports = class Location {
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  getActors() {
    const _this = this;
    return world.actors.filter(function(actor) {
      return actor.location === _this;
    });
  }

  getItems(time) {
    const _this = this;
    return world.items.filter(function(item) {
      return item._log.filter(log => log.time === time)[0].location === _this;
    });
  }

  addItem(time, item) {
    this.items.push({time, item});
  }

  toString() {
    return this.name;
  }
};
