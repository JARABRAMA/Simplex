function countDecimals(num) {
    const str = num.toString();
    if (!str.includes(".")) return 0
    return str.split(".")[1].length;
}


// this function return a fixed number to 3 decimals if number 
// has more than 3 digits after the decimal dot 
export function formatNumber(num) {
    if (countDecimals(num) <= 3) return num.toString()
    return num.toFixed(3).toString()
}

export function chunkArray(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}