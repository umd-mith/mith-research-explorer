let splitUp = function (a, n) {
    let len = a.length, out = [];
    
    while (a.length > 0) {
        out.push(a.splice(0, n));        
    }
    return out;
}

export default splitUp;