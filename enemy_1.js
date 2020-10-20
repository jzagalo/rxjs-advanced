import { interval }  from "rxjs";
import { scan, pipe }  from "rxjs/operators";
import { canvas, drawTriangle } from "/starfield_1.js";


let ENEMY_FREQ = 1500;
let ENEMY_SHOOTING_FREQ = 750;

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + 1;
}

export function paintEnemies(enemies){
    enemies.forEach((enemy) => {    
        enemy.y += 5;
        enemy.x += getRandomInt(-15, 15);
        drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');

         enemy.shots.forEach((shot) => {
            shot.y += SHOOTING_SPEED;
            drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down');
        }); 
    });
}

export let Enemies = interval(ENEMY_FREQ)
        .pipe(
            scan((enemyArray) => {                
                var enemy = {
                    x: parseInt(Math.random() * canvas.width),
                    y: -30,
                    shots: []
                };
                enemyArray.push(enemy);
                return enemyArray;
            }, [])
        );

export default Enemies;
   