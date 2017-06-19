import world from '../World';
import Card from '../models/Card.js';
import modal from '../lib/modal.js';
import arrayIntoList from '../lib/arrayIntoList';

const $deck = document.querySelector('#deck');
const $log = document.querySelector('#log');
const $btnAccuse = document.querySelector('#btn-accuse');

class InterrogatorWeb {
  log(item) {
    // Colour text
    item = item.replace(/\{\{(.+?):(.+?)\}\}/g, function(match, type, id) {
      return `<span class="type type--${type}">${id}</span>`;
    });

    // Add <br>
    item = item.replace(/\n/g, '<br>');

    const $entry = document.createElement('div');
    $entry.innerHTML = item;
    $log.appendChild($entry);
  }

  /**
   * Perform an interrogation
   */
  performInterrogation(card, actor) {
    const _this = this;

    card.use(actor)
      .then(function(response) {
        modal.hide();
        _this.log(`<strong>${actor.name}</strong>: ${response}`);
      })
      .catch(function(e) {
        alert(e.message);
      });
  }

  /**
   * Select who to interrogate
   */
  interrogate(card) {
    const _this = this;
    // You can't interrogate a corpse
    const actors = world.actors.filter(actor => actor.isAlive);

    this.cards.forEach(card => card.$card.classList.remove('card--open'));
    card.$card.classList.add('card--open');

    const $list = arrayIntoList(actors, function(actor) {
      _this.performInterrogation(card, actor);
    });

    modal.show('Who do you want to interrogate?', $list);
  }

  /**
   * Begin the interrogation process
   */
  start() {
    const _this = this;

    // Draw cards
    const cardTypes = Card.getTypes();
    this.cards = [];

    for (let i = 0; i < 7; i++) {
      const type = cardTypes[Math.floor(Math.random() * cardTypes.length)];
      this.cards.push(new Card({type}));
    }

    // Show flavour text
    this.log(world.flavour.intro(world));

    // Show cards
    for (const card of this.cards) {
      const $card = document.createElement('div');
      $card.classList.add('card');
      $card.innerHTML = '<strong>' + card.getName() + '</strong>';
      const $desc = document.createElement('p');
      $desc.innerHTML = card.getDescription();
      $desc.style = 'margin-bottom: 0;';
      $card.appendChild($desc);

      $card.addEventListener('click', this.interrogate.bind(this, card));
      card.$card = $card;

      $deck.appendChild($card);
    }

    // Enable accuse button
    $btnAccuse.addEventListener('click', function() {
      const $list = arrayIntoList(world.actors.filter(actor => actor.isAlive), function(accusee) {
        // Clear the playing field
        modal.hide();
        _this.log('<hr>');

        $btnAccuse.hidden = true;

        // Determine the final outcome
        if (accusee === world.assassin) {
          _this.log(world.flavour.endCorrect(world));
        } else {
          _this.log(world.flavour.endWrong(world, accusee));
        }
      });

      modal.show('Who do you want to accuse of the murder?', $list);
    });

    $btnAccuse.hidden = false;
  }
};

export default new InterrogatorWeb();
