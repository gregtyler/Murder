/**
 * Get the crossover timeline of two locations
 * @param {Actor} actor The actor to build a timeline for
 * @param {Mixed} comparator The Actor or Location to find a crossover with
 * @returns {Array} An array of the timeline where the actor was either in the
 * given location or in the same location as the given actor.
 */
export default function getCrossoverTimeline(actor, comparator) {
  const matches = [];
  const global = typeof process !== 'undefined' ? process : window;
  let locationMatch = null;
  let prevTime;

  for (const i in actor._log) {
    const time = actor._log[i].time;
    if (
      (comparator.constructor.name === 'Actor' && comparator._log[i].location === actor._log[i].location) ||
      (comparator.constructor.name === 'Location' && comparator === actor._log[i].location)
    ) {
      const currentLocation = actor._log[i].location;
      // If the location changes, push a new location
      if (currentLocation !== locationMatch) {
        if (matches.length && typeof matches[matches.length - 1].end === 'undefined') {
          matches[matches.length - 1].end = prevTime;
        }

        locationMatch = currentLocation;
        matches.push({start: time, location: currentLocation});
      }
    } else if (locationMatch !== null) {
      matches[matches.length - 1].end = prevTime;
      locationMatch = null;
    }

    prevTime = time;
  }

  // If they finish in the same room, tie off the time spent together
  if (locationMatch !== null) {
    matches[matches.length - 1].end = Math.max.apply(global, actor._log.map(a => a.time));
    locationMatch = null;
  }

  // Add a timeframe to all of the matches
  for (const match of matches) {
    match.timeframe = match.start === match.end ? `at ${match.start}` : `from ${match.start} until ${match.end}`;
  }

  return matches;
};
