import world from '../World';
import modal from '../lib/modal';
import arrayIntoList from '../lib/arrayIntoList';

export default class Card {
  constructor({name, desc, type}) {
    this.name = name;
    this.desc = desc;
    this.type = type;
    this.used = false;
  }

  /**
   * Use the card
   */
  use(actor) {
    const _this = this;

    return new Promise(function(resolve) {
      const $div = document.createElement('div');
      const $list = arrayIntoList(_this.getInterrogationOptions(actor), function(target) {
        resolve(_this.performInterrogation(actor, target));
      });

      const $intro = document.createElement('divs');
      $intro.innerHTML = `Interrogating ${actor.name}:<br><br>`;

      $div.appendChild($intro);
      $div.appendChild($list);

      modal.show(_this.getInterrogationOptionsTitle(), $div);
    });
  }

  performInterrogation(actor, target) {
    const interrogationFunction = actor[this.getInterrogationMethod()];

    if (this.type === 'TIME') target = target.name;

    this.used = true;

    return interrogationFunction.call(actor, target);
  }

  getInterrogationMethod() {
    if (this.type === 'LOCATION') return 'interrogateLocation';
    else if (this.type === 'TIME') return 'interrogateTime';
    else if (this.type === 'ITEM') return 'interrogateItem';
    else if (this.type === 'SUSPECT') return 'interrogateNeighbour';
  }

  getInterrogationOptionsTitle() {
    if (this.type === 'LOCATION') return 'Which location would you like to ask about?';
    else if (this.type === 'TIME') return 'What time slot would you like to ask about?';
    else if (this.type === 'ITEM') return 'Which item would you like to ask about?';
    else if (this.type === 'SUSPECT') return 'Which item would you like to ask about?';
  }

  getInterrogationOptions(actor) {
    if (this.type === 'LOCATION') return world.locations;
    else if (this.type === 'TIME') return world._log.map(log => ({name: log.time}));
    else if (this.type === 'ITEM') return world.items;
    else if (this.type === 'SUSPECT') return world.actors.filter(act => act !== actor);
  }

  getDescription() {
    if (this.type === 'LOCATION') return 'Ask a suspect when they were in a given room';
    else if (this.type === 'TIME') return 'Ask a suspect where they were at a given time';
    else if (this.type === 'ITEM') return 'Ask a suspect when they saw a particular item';
    else if (this.type === 'SUSPECT') return 'Ask a suspect when they saw another suspect';
  }
};
