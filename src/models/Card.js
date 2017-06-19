import world from '../World';

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
  use(actor, target) {
    const interrogationFunction = actor[this.getInterrogationMethod()];

    this.used = true;

    return interrogationFunction.call(world, target);
  }

  getInterrogationMethod() {
    if (this.type === 'LOCATION') return 'interrogateLocation';
    else if (this.type === 'TIME') return 'interrogateTime';
    else if (this.type === 'ITEM') return 'interrogateItem';
    else if (this.type === 'SUSPECT') return 'interrogateNeighbour';
  }

  getDescription() {
    if (this.type === 'LOCATION') return 'Ask a suspect when they were in a given room';
    else if (this.type === 'TIME') return 'Ask a suspect where they were at a given time';
    else if (this.type === 'ITEM') return 'Ask a suspect when they saw a particular item';
    else if (this.type === 'SUSPECT') return 'Ask a suspect when they saw another suspect';
  }
};
