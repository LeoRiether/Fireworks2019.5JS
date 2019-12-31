// Thanks, StackOverflow
let offset = 0;

let getOffset = () => new Promise((res, rej) => {
    if (location.protocol == 'file:')
        return rej();

    // var xhr = new ActiveXObject("Msxml2.XMLHTTP");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", location.href);
    xhr.send();

    xhr.onload = () => {
        var dateStr = xhr.getResponseHeader('Date');
        var serverTimeMillisGMT = Date.parse(new Date(Date.parse(dateStr)).toUTCString());
        var localMillisUTC = Date.parse(new Date().toUTCString());

        res(serverTimeMillisGMT -  localMillisUTC);
    };

    xhr.onerror = rej;
});

export function init() {
    getOffset()
        .then(o => offset = o)
        .then(() => console.log('offset found: ', offset))
        .catch(() => {
            offset = 0;
            console.log('getOffset() failed, defauting to zero');
        });
}

export function date() {
    let d = new Date();
    d.setTime(d.getTime() + offset);
    return d;
}