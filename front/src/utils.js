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
