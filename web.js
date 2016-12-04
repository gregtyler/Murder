import world from './src/World';
import simulator from './src/components/Simulator';
//import interrogatorWeb from './src/components/interrogatorWeb';

// Build the world
world.init();

// Run the simulation until the target gets killed
while (world.target.isAlive || simulator.iterations > 12) {
  world.reset();
  simulator.run();
}

// Being the interrogator
//interrogatorWeb.start();
