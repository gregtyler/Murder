const $modalBG = document.querySelector('.modal__bg');
const $modal = document.querySelector('.modal');
const $header = document.querySelector('.modal__header');
const $body = document.querySelector('.modal__body');

const modal = {
  show: function(title, body) {
    $header.innerHTML = title;

    if (body instanceof HTMLElement) {
      $body.innerHTML = '';
      $body.appendChild(body);
    } else {
      $body.innerHTML = body;
    }

    $modalBG.hidden = false;
    $modal.hidden = false;
  },

  hide: function() {
    $modalBG.hidden = true;
    $modal.hidden = true;
  }
};

$modalBG.addEventListener('click', function() {
  modal.hide();
});

document.body.addEventListener('keydown', function(event) {
  if (event.which === 27) {
    modal.hide();
  }
});

export default modal;
