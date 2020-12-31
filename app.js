/**
 * Happy New Year!
 */

// Goal for next year: make many types of fireworks, resembling more real life, and have an FSM

import * as psys from "./particle_system";
import * as font from "./font";
import * as special from "./special";
import * as countdown from "./countdown";

let time = performance.now();
let timer = 0;

// Setup
const world = document.getElementById('world');
const ctx = world.getContext('2d', { alpha: true });
let width = document.documentElement.clientWidth || window.innerWidth;
let height = document.documentElement.clientHeight || window.innerHeight;
world.width = width;
world.height = height;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, width, height);

window.addEventListener('resize', function () {
    world.width = width = document.documentElement.clientWidth || window.innerWidth;
    world.height = height = document.documentElement.clientHeight || window.innerHeight;

    // Fun fact! This could possibly execute intertwined with some other drawing function, thus drawing a black particle, for example
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
});

font.normalize();

const randomColor = () => ({
    h: Math.random() * 360,
    s: 75,
    l: 70 + font.noise(5)
});

function print(n) {
    if (n < 0) return "print() doesn't accept n < 0";

    const translate = o => p => [ p[0] + o[0], p[1] + o[1] ];

    const max_ = (a, b) => a > b ? a : b;
    const maxvec = (a, b) => [ max_(a[0], b[0]), max_(a[1], b[1]) ];

    let max = [0, 0];
    let points = [];

    let hack = 0;
    function push(n) {
        const p = font.glyphs[n]
                  .map (translate([ max[0] + 10, 0 ]));
        points.push(...p);
        max = p.reduce(maxvec, max);

        if (hack % 2 == 1)
            max[0] += 60;
        hack--;
    }

    let digits = [];
    if (n == 0) digits.push(0);
    while (n > 0) {
        digits.push(n % 10);
        n = ~~(n / 10);
    }

    hack = digits.length;
    digits.reverse().forEach(push);

    const color = randomColor();
    psys.lerpers.push(
        ...points
        .map (translate([ width/2 - max[0]/2, height/2 - max[1]/2 ])) // translate to center
        .map (point => psys.Lerper(
            // [ width / 2 + font.noise(width / 2), height ],
            [ width / 2, height ],
            // [ width / 2, height / 2 ],
            point,
            Object.create(color)
        ))
    );
}

let delay = 0;

// TODO: review this
let targetDate = new Date(2021, 0, 1); // why the fuck are months 0-indexed?
targetDate = new Date(2021, 0, 1, 0, 0, 0);
let isBeforeTarget = new Date() < targetDate;
let lastSTo = -1;

function ny() {
    for (let i = 0; i < 20; i++)
        console.log(`%c Happy New Year!${' '.repeat(i % 2)}`, 'font-size: 2em; font-family: cursive; font-weight: bold; color: red;');
}

if (!isBeforeTarget) ny();

countdown.init();
setInterval(countdown.init, 30000);

function maybeTriggerSpecial() {
    let msTo = targetDate - countdown.date();
    let sTo = ~~Math.floor(msTo / 1000);
    if (isBeforeTarget && sTo >= 1) return;

    let roll = ~~(Math.random()*100);
    if (roll > 70) {
        special.random(width, height, randomColor());
        delay = 1500;
    }
}
setInterval(maybeTriggerSpecial, 500);

function update(delta) {
    // TODO: transform this into a state machine
    // Update: yeah, I really need an FSM for this
    let msTo = targetDate - countdown.date();
    let sTo = ~~Math.floor(msTo / 1000);
    if (!isBeforeTarget || sTo < 1) {
        if (isBeforeTarget) {
            special.barrage(width, height, randomColor());
            ny();
            isBeforeTarget = false;
        }

        if (timer >= delay) {
            timer -= delay;
            delay = ~~(Math.random() * 100) + 20;
            psys.fusers.push(psys.Fuser(
                [ width / 2 + font.noise(width / 2), height + 2 ],
                [ font.noise(100), -400 * Math.random() - 300 ],
                randomColor(),
                Math.random()*1000 + 1000,
            ));
        }
    } else if (sTo != lastSTo) {
        timer -= 1000;
        lastSTo = sTo;
        // if (sTo > 61) {
        //     const d = countdown.date();
        //     print(d.getHours()*10000 + d.getMinutes()*100 + d.getSeconds());
        // } else {
        //     print(sTo);
        // }
        // lastSTo = sTo;

        // Double Dabble for time!
        // kind of
        // not really
        let mTo = 0, hTo = 0;
        if (sTo >= 60) {
            mTo = ~~(sTo / 60);
            sTo %= 60;
        }
        if (mTo >= 60) {
            hTo = ~~(mTo / 60);
            mTo %= 60;
        }

        print(hTo*10000 + mTo*100 + sTo);
    }

    psys.update(delta);
}

function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, width, height);

    psys.draw(ctx);
}

let displayFPS = false;
let deltaSum = 0;
let frameCount = 0;
let fps = 0;

function drawFPS(delta) {
    deltaSum += delta;
    frameCount++;

    if (deltaSum >= 1000) {
        fps = 1000.0 * frameCount / deltaSum;
        frameCount = 0;
        deltaSum = 0;
    }

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`FPS: ${~~(fps * 100.0) / 100.0}`, 10, 20);
}

(function loop() {
    const lastTime = time;
    time = performance.now();
    const delta = time - lastTime;
    timer += delta;

    update(delta);
    draw();

    if (displayFPS) {
        drawFPS(delta);
    }

    requestAnimationFrame(loop);
})();

export default {
    print,
    psys, special,
    rec: font.recording,
    width, height,
    randomColor,
    toggleFPS() { displayFPS = !displayFPS; }
};
