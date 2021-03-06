/**
 * Select a random entry from an array
 * @param {Array} arr The array to pick from
 * @returns {Mixed} The randomly selected item
 */
export default function randomArray(arr) {
  const id = Math.floor(Math.random() * arr.length);
  return arr[id];
};
