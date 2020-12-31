// Thanks, StackOverflow
let offset = 0;

const worldTimeAPI = {
    url: "https://worldtimeapi.org/api/timezone/Etc/UTC",
    timeParam: "utc_datetime",
};

const worldClockAPI = {
    url: "http://worldclockapi.com/api/json/utc/now",
    timeParam: "currentDateTime",
};

const anotherWorldTimeAPI = {
    url: "https://myworldtimeapi.herokuapp.com/Antarctica/Troll",
    timeParam: "utc_datetime",
};

const getOffsetWith = API => new Promise((res, rej) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", API.url);
    xhr.responseType = 'json';

    xhr.onload = () => {
        let server = new Date(xhr.response[API.timeParam]);
        res(server - new Date());
    };

    xhr.onerror = rej;

    xhr.send();
});

const getOffset = () =>
    getOffsetWith(anotherWorldTimeAPI)
        .catch(() => {
            console.log("myworldtimeapi query failed! Trying worldclocktime instead");
            return getOffsetWith(worldTimeAPI);
        })
        .catch(() => {
            console.log("worldtimeapi query failed! Trying worldclockapi instead");
            return getOffsetWith(worldClockAPI);
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