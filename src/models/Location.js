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
