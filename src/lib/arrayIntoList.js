/**
 * Convert an array into an HTML list
 */
export default function arrayIntoList(array, callback) {
  const $list = document.createElement('div');

  array.forEach(function(target) {
    const $target = document.createElement('a');
    $target.style = 'display: block;';
    $target.href = '#';
    $target.innerHTML = target.name;
    $target.addEventListener('click', function(event) {
      event.preventDefault();
      callback(target);
    });
    $list.appendChild($target);
  });

  return $list;
}
