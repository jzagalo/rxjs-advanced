import {range, fromEvent,  combineLatest } from 'rxjs';
import { flatMap, map, pipe, take, toArray, startWith } from 'rxjs/operators';

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SPEED = 40;
const STAR_NUMBER = 250;
const StarStream = range(1, STAR_NUMBER)
                    .pipe(                     
                      map((val, index) => {
                          const data = {
                              x: parseInt(Math.random() * canvas.width),
                              y: parseInt(Math.random() * canvas.height),
                              size: (Math.random() * 3) + 1
                          };
                         
                          return data;
                      }),  
                      toArray(),                      
                      flatMap((starArray) => {
                          starArray.forEach(star => {
                              if(star.y >= canvas.height){
                                  star.y = 0;
                              }
                              star.y += 3; 
                          });
                          return starArray;
                      }),
                      toArray(),  
                    );

function paintStars(stars){  
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';

    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    })
}

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

let Game = combineLatest(
    StarStream, spaceShip,
    (stars, spaceship) => {
       return { stars, spaceship };
    }
).subscribe(renderScene);