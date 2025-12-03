function countDecimals(num) {
  const str = num.toString();
  if (!str.includes(".")) return 0;
  return str.split(".")[1].length;
}

// this function return a fixed number to 3 decimals if number
// has more than 3 digits after the decimal dot
export function formatNumber(num) {
  if (countDecimals(num) <= 3) return num.toString();
  return num.toFixed(3).toString();
}

export function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

/** 
this functions will return a list with the incoming and the outgoing basic variables
* @param {list[string]} current: the current basic variables 
* @param {list[string]} anterior: the previous basic variables 
* @returns {{incoming: string, outgoing: string}}: the incoming and the outgoing basic variables
**/
export function getIncomingAndOutgoingBasicVariables(current, anterior) {
  const incoming = current.find((variable) => !anterior.includes(variable));
  const outgoing = anterior.find((variable) => !current.includes(variable));
  return { incoming, outgoing };
}

/**
 * this function will return a list with the used resources
 * @param {list[number]} solution: the solution vector
 * @param {list[list[number]]} matrix: the matrix
 * @returns {list[number]}: the used resources
 */
export function getUsedResources(solution, matrix) {
  if (solution.length !== matrix.length) return null;

  return matrix.map((row) => pointProduct(row, solution));
}

/**
 * this function will return the point product of two vectors
 * @param {list[number]} first: the first vector
 * @param {list[number]} second: the second vector
 * @returns {number}: the point product of the two vectors
 */
function pointProduct(first, second) {
  return first.reduce((acc, value, index) => acc + value * second[index], 0);
}
