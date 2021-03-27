//sort array of objects by some filed
export function sortArrayOfObjectsByField(array, field, ascending, numeric) {
    if (!array || array.length === 0) return;
    let newArray = array.slice();
    newArray = newArray.sort(function (a, b) {
        let c = a[field];
        let d = b[field];
        if (numeric) {
            c = parseInt(c);
            d = parseInt(d);
        }
        if (ascending) {
            return c - d;
        }
        return d - c;
    });
    return newArray;
}