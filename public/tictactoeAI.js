function rand(items) {
    // "|" for a kinda "int div"
    return items[items.length * Math.random() | 0];
}

function randomAI(squaresTaken, shapesArray) {
    let difference = [0,1,2,3,4,5,6,7,8].filter(element => !squaresTaken.includes(element));
    if (difference.length === 0) {
        return;
    }
    shapesArray['line'].push(rand(difference));
    return rand(difference);
}
