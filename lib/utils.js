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

export function formatDate(date) {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formatted = new Date(date);
    return formatted.toLocaleDateString("en-US", options)
}

//sort array of objects by some date field
export function sortArrayOfObjectsByDate(array, field, ascending) {
    if (!array || array.length === 0) return;
    let newArray = array.slice();
    newArray = newArray.sort(function (a, b) {
        let c = new Date(a[field]);
        let d = new Date(b[field]);
        if (ascending) {
            return d - c;
        }
        return c - d;
    });
    return newArray;
}


//cart utilities
export const addTocart = (book) => {
    if (!book) return;
    let items = JSON.parse(window.localStorage.getItem('cart'));
    let isItemOnCart = false;
    if (!items) {
        items = [];
    }

    if (items && items.length > 0 && items.some(item => item.id === book.id)) {
        isItemOnCart = true;
    }

    if (!isItemOnCart) {
        items.push(book);
    }

    window.localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
}

export const deleteFromCart = (book) => {
    if (!book) return;
    let items = JSON.parse(window.localStorage.getItem('cart'));
    if (items && items.length > 0) {
        items = items.filter(item => item.id !== book.id);
    }
    window.localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
}