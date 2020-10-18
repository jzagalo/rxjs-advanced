import { combineLatest, fromEvent } from "rxjs";
import { map, pipe, startWith } from "rxjs/operators";

let HERO_Y = canvas.height - 30;
let mouseMove = fromEvent(canvas, "mousemove");
let spaceShip = mouseMove.pipe(
    map((event) => {
        return  {
            x: event.clientX,
            y: HERO_Y
        };
    }),
    startWith({
        x: canvas.width/2,
        y: HERO_Y
    })
);

function drawTriangle(x, y, width, color, direction){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x-width, y);
    ctx.lineTo(x, direction === "up" ? y - width: y + width);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x - width, y);
    ctx.fill();
}

function paintSpaceShip(x, y){
    drawTriangle(x, y, 20, 'xff0000', 'up');
}

function renderScene(actors){
    paintStars(actors.stars);
    paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
}

var Game = combineLatest(
    StarStream, spaceShip,
    (stars, spaceship) => {
       return { stars, spaceship };
    }
);

Game.subscribe(renderScene);