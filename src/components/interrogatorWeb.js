import world from '../World';
import Card from '../models/Card.js';
import modal from '../lib/modal.js';
import arrayIntoList from '../lib/arrayIntoList';

const $deck = document.querySelector('#deck');
const $log = document.querySelector('#log');

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
    const $list = arrayIntoList(world.actors, function(actor) {
      _this.performInterrogation(card, actor);
    });

    modal.show('Who do you want to interrogate?', $list);
  }

  /**
   * Begin the interrogation process
   */
  start() {
    // Draw cards
    this.cards = [
      new Card({name: 'Time interrogation', type: 'TIME'}),
      new Card({name: 'Suspect interrogation', type: 'SUSPECT'}),
      new Card({name: 'Item interrogation', type: 'ITEM'}),
      new Card({name: 'Location interrogation', type: 'LOCATION'})
    ];

    // Show flavour text
    this.log(world.flavour.intro(world));

    // Show cards
    for (const card of this.cards) {
      const $card = document.createElement('div');
      $card.classList.add('card');
      $card.innerHTML = '<strong>' + card.name + '</strong>';
      const $desc = document.createElement('p');
      $desc.innerHTML = card.getDescription();
      $desc.style = 'margin-bottom: 0;';
      $card.appendChild($desc);

      $card.addEventListener('click', this.interrogate.bind(this, card));
      card.$card = $card;

      $deck.appendChild($card);
    }
  }
};

export default new InterrogatorWeb();
