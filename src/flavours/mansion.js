module.exports = {
  intro: function(world) {
    const killingWeapon = world.items.find(function(item) {
      return item._log.filter(function(log) {
        return log.time === world.target.deathTime && log.holder === world.assassin;
      }).length > 0;
    });
    return `You have been invited at the request of Dr. Green to a party at his mansion near the pictureseque village of Ram's Bottom. The party is to celebrate his 50th birthday, and he intends to invite many of his closest friends and colleagues. You've only known the Doctor for a few months, so it's a great priviledge to have been invited

Unfortunately, just as you arrive (later than many of the guests), you hear a blood-curdling scream! One of the guests has been murdered and the body of {{actor:${world.target.name}}} was just discovered in the {{loc:${world.target.location.name}}}. It appears they were killed with the {{item:${killingWeapon.name}}}.

As the only guest who wasn't previously present, and the only attendee with any detective experience, Dr. Green asks you to investigate and orders all of his guests to answer any of your questions.`;
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
