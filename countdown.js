// Thanks, StackOverflow
let offset = 0;

let getOffset = () => new Promise((res, rej) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://worldtimeapi.org/api/timezone/Etc/UTC");
    xhr.responseType = 'json';

    xhr.onload = () => {
        let server = new Date(xhr.response.utc_datetime);
        res(server - new Date());
    };

    xhr.onerror = rej;

    xhr.send();
});

export function init() {
    getOffset()
        .then(o => offset = o)
        .then(() => console.log('offset found: ', offset))
        .catch(() => console.log('getOffset() failed'));
}

export function date() {
    let d = new Date();
    d.setTime(d.getTime() + offset);
    return d;
}