import world from '../World';
import randomArray from '../lib/randomArray';
import Item from '../models/Item';

const Simulator = class {
  /**
   * Run the simulation
   */
  run() {
    this.iterations = 0;
    let endSimulation = false;
    let time = 1100;
    while (!endSimulation) {
      time += 100;
      this.iterations++;
      // Move everybody who wants to move
      for (const actor of world.actors) {
        if (actor.isAlive) {
          // Move players randomly
          if (Math.random() > 0.75) {
            actor.setLocation(randomArray(world.locations));
          }
        }
      }

      // If the assassin sees a weapon, then take it
      if (!world.assassin.getWeapon() && world.assassin.location.getItems().filter(a => a.isWeapon).length) {
        world.assassin.location.getItems().find(a => a.isWeapon).holder = world.assassin;
      }

      // If the assassin is with their target and their target alone then do the deed
      if (world.target.isAlive && world.target.location === world.assassin.location && world.assassin.getWeapon() && world.target.location.getActors().length === 2) {
        world.target.isAlive = false;
        world.target.deathTime = time;
        const corpse = new Item({name: 'Corpse', isWeapon: false});
        world.target.location.addItem(time, corpse);
      }

      // Check for evidence
      for (const actor of world.actors) {
        for (const neighbour of actor.location.getActors()) {
          if (actor.isAlive && actor !== world.assassin && !neighbour.isAlive) {
            endSimulation = true;
          }
        }
      }

      // Log everybody
      for (const actor of world.actors) actor.log(time);
      for (const item of world.items) item.log(time);
      world.log(time);
    }
  }
};

export default new Simulator();
