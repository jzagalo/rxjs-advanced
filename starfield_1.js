import {range } from 'rxjs';
import { flatMap, map, pipe, take, toArray } from 'rxjs/operators';

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
                          console.log(data);
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
                    ).subscribe(starArray => {
                        paintStars(starArray);
                    })
function paintStars(stars){
  
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';

    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    })
}