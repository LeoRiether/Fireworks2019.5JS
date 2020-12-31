import * as psys from "./particle_system";

export function barrage(width, height, color) {
    for (let x = 0; x <= width; x += 30) {
        psys.fusers.push(psys.Fuser(
            [ x, height + 2 ],
            [ 0, -500 * Math.random() - 300 ],
            Object.create(color),
            Math.random()*1000 + 1000,
        ));
    }
}

export function sides(width, height, color) {
    const abs = 100 * (2 * Math.abs() - 1) + 500;
    const spawn = theta => () => {
        psys.fusers.push(psys.Fuser(
            [ 0, height ],
            [ abs * Math.cos(theta), abs * Math.sin(theta) ],
            Object.create(color),
            1500,
        ));
        psys.fusers.push(psys.Fuser(
            [ width, height ],
            [ -abs * Math.cos(theta), abs * Math.sin(theta) ],
            Object.create(color),
            1500,
        ));
    };

    let n = 20;
    for (let i = 0; i < n; i++) {
        let deg = 10 + i * 80 / n;
        setTimeout(spawn(-deg * Math.PI / 180), i * 500 / n);
    }
}

export function radius(width, height, color) {
    for (let theta = 0; theta > -Math.PI; theta -= Math.PI / 10) {
        const spawn = abs => () => {
            psys.fusers.push(psys.Fuser(
                [ width / 2, height ],
                [ abs * Math.cos(theta), abs * Math.sin(theta) ],
                Object.create(color),
                1500,
            ));
        };

        let abs = 50 * (2 * Math.random() - 1) + 400;
        for (let i = 0; i < 3; i++) {
            setTimeout(spawn(abs + 100 * i), i * 200);
        }
    }
}

export function doubleFusers(width, height, color) {
    let n = ~~(Math.random() * 3) + 2;
    for (let i = 0; i < n; i++) {
        let x = width*0.1 + i * width*0.8 / (n-1);
        let abs = Math.random();
        psys.doubleFusers.push(psys.Fuser(
            [ x, height ],
            [ 0, -500 * Math.random() - 250 ],
            Object.create(color),
            Math.random()*1000 + 1000,
        ));
    }
}

export function radius_n_sides(width, height, color) {
    radius(width, height, color);
    sides(width, height, color);
}

// this can also trigger `combo` itself!
export function combo(width, height, color) {
    random(width, height, Object.create(color));

    // There's some chance it doesn't actually combo
    if (Math.random() > 0.6) {
        color.h = Math.random() * 360;
        setTimeout(() => random(width, height, color), 500);
    }
}

const list = [ barrage, radius, sides, doubleFusers, radius_n_sides, combo ];

export function random(width, height, color) {
    list[~~(Math.random() * list.length)](width, height, color);
}