/**
 * Note: all vectors are represented as two-element arrays in the form [x coordinate, y coordinate]
 * Note2: all instances of array.slice() and Object.create() are here to copy all of the object, instead of copying a reference. Fuck implicit references.
 */

const g = 300;
const Tau = 2.0*Math.PI;

export function Lerper(from, to, color) {
    this.pos = from;
    this.from = from;
    this.to = to;
    this.color = color;
    this.t = 0;
}

export function Fuser(pos, vel, fuse, color) {
    this.pos = pos;
    this.vel = vel;
    this.fuse = fuse;
    this.color = color;
}

export function Roamer(pos, vel, color) {
    this.pos = pos;
    this.vel = vel;
    this.color = color;
}

export let lerpers = []; // Particles that lerp towards a point
export let fusers  = []; // Particles that roam free until they explode
export let roamers = []; // Particles that just move until they dissapear

function explode(pos, color, n) {
    for (let i = 0; i < n; i++) {
        let abs = Math.random() * 500;
        let theta = Math.random() * Tau;
        let vel = [ abs * Math.cos(theta), abs * Math.sin(theta) - 20 ];
        roamers.push(new Roamer(
            pos.slice(),
            vel,
            Object.create(color)
        ));
    }
}

function removeAt(list, index) {
    list[index] = list[list.length-1];
    list.pop();
}

const lerp = (from, to, perc) => [
    perc * (to[0] - from[0]) + from[0],
    perc * (to[1] - from[1]) + from[1]
];

function qerp(from, to, perc) {
    const x = 1 - perc;
    return lerp(from, to, 1 - x*x);
}

// Side-effecty
function roam(pos, vel, dt) {
    // Euler's method for the x-axis
    // Just linear motion, no need for better numerical stability
    // I think
    pos[0] += vel[0] * dt;

    // Velocity-Verlet integration for the y-axis
    const a2 = 0.5 * g * dt * dt;
    pos[1] += vel[1]*dt + a2*a2;
    vel[1] += g * dt;
}

export function update(dt) {
    const dts = dt / 1000.0;

    // roamers.map (dimBy(80*dts))
    //        .filter (p.color.l > 0)
    //        .map (roam)
    //        .map (scaleVelocity(0.95))

    // Roamers
    for (let i = roamers.length-1; i >= 0; i--) {
        let p = roamers[i];

        p.color.l -= 80 * dts;
        if (p.color.l <= 0) {
            removeAt(roamers, i);
        } else {
            roam(p.pos, p.vel, dts);
            p.vel[0] *= 0.95;
            p.vel[1] *= 0.95;
        }
    }

    // Lerpers
    for (let i = lerpers.length-1; i >= 0; i--) {
        let p = lerpers[i];

        p.t += dt;

        // Could remove these kinds of ifs by using maps and filters, but nah
        if (p.t >= 1000) {
            explode(p.pos, p.color, 1);
            removeAt(lerpers, i);
        } else {
            p.pos = qerp(p.from, p.to, p.t / 1000.0);
        }
    }

    // Fusers
    for (let i = fusers.length-1; i >= 0; i--) {
        let p = fusers[i];

        p.fuse -= dt;
        if (p.fuse <= 0) {
            explode(p.pos, p.color, 60);
            removeAt(fusers, i);
        } else {
            roam(p.pos, p.vel, dts);
        }
    }
}

export function draw(ctx) {
    ctx.strokeStyle = '';

    for (let list of [lerpers, fusers, roamers]) {
        for (let i = 0; i < list.length; i++) {
            const p = list[i];
            ctx.fillStyle = `hsl(${p.color.h}deg, ${p.color.s}%, ${p.color.l}%)`; // TODO: consider precomputing this string for lerpers and fusers
            // ctx.beginPath();
            // ctx.arc(p.pos[0], p.pos[1], 1, 0, Tau);
            // ctx.fill();
            ctx.fillRect(p.pos[0], p.pos[1], 1, 1);
        }
    }
}