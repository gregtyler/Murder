const randomArray = require('../lib/randomArray');

module.exports = {
  intro: function(world) {
    // Work out the killing weapon
    const killingWeapon = world.items.find(function(item) {
      return item._log.filter(function(log) {
        return log.time === world.target.deathTime && log.holder === world.assassin;
      }).length > 0;
    });

    // Work out the end time
    const endTime = world.actors[0]._log.reverse()[0].time;

    // Work out who discovered the body
    const discoverer = world.actors.find(function(actor) {
      return actor.isAlive && actor.location === world.target.location;
    });

    // Write some intro text
    return `You have been invited at the request of Dr. Green to a party at his mansion near the pictureseque village of Ram's Bottom. The party is to celebrate his 50th birthday, and he intends to invite many of his closest friends and colleagues. You've only known the Doctor for a few months, so it's a great priviledge to have been invited

The party started at 1100 but, due to botched directinos, you arrive at ${endTime}. Just as you arrive, you hear a blood-curdling scream! One of the guests has been murdered and the body of {{victim:${world.target.name}}} was just discovered by {{actor:${discoverer.name}}} in the {{loc:${world.target.location.name}}}. It appears they were killed with the {{item:${killingWeapon.name}}}.

As the only guest who wasn't previously present, and the only attendee with any detective experience, Dr. Green asks you to investigate and orders all of his guests to answer any of your questions.`;
  },
  endCorrect: function(world) {
    const drGreen = world.actors.find(actor => actor.name === 'Dr. Green');
    return `You gather the party guests together in the Sitting Room. The local constabulary have just arrived. "Quite simply", you state, "it was ${world.assassin.name}". The room gasps, and all eyes turn towards ${world.assassin.name}.

"That's right", they say, "I did it! And I would have gotten away with it if it wasn't for this unexpected guest!"

As the police officer cuffs the assassin and takes them away, she says to you. "Thank you so much. You've really saved the day here."` + (drGreen.isAlive ? `

Dr. Green is ecstatic with your work. "What an exciting night! I can only hope my 60th is as wild!"` : '');
  },
  endWrong: function(world, accusee) {
    // Find Dr. Green
    const drGreen = world.actors.find(actor => actor.name === 'Dr. Green');

    // Determine a second victim
    let victim = randomArray(world.actors);
    while (!victim.isAlive || victim === accusee || victim === world.assassin) {
      victim = randomArray(world.actors);
    }

    return `With the party assembled in the Sitting Room, you explain how you know that ${accusee.name} committed the crime to rapt attention before the police drag the suspect away.

"I'm innocent!" They shout. "Innocent I say!"

` + (drGreen.isAlive ? `"To think I ever trusted them." Dr. Green laments.

` : '') + `However, a month later the investigation finds ${accusee.name} innocent of all charges. Front page headlines spout about "the amateur detective who almost got an innocent person killed". Embarrassed, you vow never to return to Ram's Bottom.` + (drGreen.isAlive ? ' And, indeed, you never hear from Dr. Green again.' : '') + `

Two months later, you read a story hidden on page 5 of the newspaper. Another death, and this time it's poor ${victim.name} who's been horribly murdered by an unknown assailant. An amateur detective at the scene, one Hercule Poirot, points to ${world.assassin.name} as the guilty party, but have the police rebuilt their trust in amateurs yet?`;
  },
  actorNames: [
    'Dr. Green',
    'Prof. Coal',
    'Lady Peach',
    'Dame Turquoise',
    'Mr. Pink',
    'Mx. Orchid'
  ],
  locationNames: [
    'Kitchen',
    'Sitting Room',
    'Dining Room',
    'Master Bedroom',
    'Bathroom',
    'Larder',
    'Vestibule'
  ],
  itemDetails: [
    {name: 'Knife', isWeapon: true},
    {name: 'Gun', isWeapon: true},
    {name: 'Candlestick', isWeapon: true},
    {name: 'Lead piping', isWeapon: true},
    {name: 'Rope', isWeapon: true},
    {name: 'Piano wire', isWeapon: true},
    {name: 'Fish tank', isWeapon: false},
    {name: 'Lampshade', isWeapon: false}
  ]
};
