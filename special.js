import * as psys from "./particle_system";

export function barrage(width, height, color) {
    for (let x = 0; x <= width; x += 30) {
        psys.fusers.push(new psys.Fuser(
            [ x, height + 2 ],
            [ 0, -500 * Math.random() - 300 ],
            Math.random()*1000 + 1000,
            Object.create(color)
        ));
    }
}

// unfinished
export function sides(width, height, color) {
    let theta = -Math.PI / 6;
    for (let i = 0; i < 3; i++, theta -= Math.PI / 4) {
        psys.fusers.push(new psys.Fuser(
            [ 0, height ],
            [ 500 * Math.cos(theta), 500 * Math.sin(theta) ],
            1500,
            Object.create(color)
        ));
        psys.fusers.push(new psys.Fuser(
            [ width, height ],
            [ 500 * Math.cos(theta - Math.PI), 500 * Math.sin(theta - Math.PI) ],
            1500,
            Object.create(color)
        ));
    }
}

export function radius(width, height, color) {
    for (let theta = 0; theta > -Math.PI; theta -= Math.PI / 10) {
        for (let abs = 400; abs <= 600; abs += 100) {
            psys.fusers.push(new psys.Fuser(
                [ width / 2, height ],
                [ abs * Math.cos(theta), abs * Math.sin(theta) ],
                1500,
                Object.create(color)
            ));
        }
    }
}

const list = [ barrage, radius ];

export function random(width, height, color) {
    list[~~(Math.random() * list.length)](width, height, color);
}