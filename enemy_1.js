import { interval }  from "rxjs";
import { scan, pipe }  from "rxjs/operators";
import { canvas } from "/starfield_1.js";

let ENEMY_FREQ = 1500;

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + 1;
}

function paintEnemies(enemies){
    enemies.forEach((enemies) => {
        console.log(enemies);
        enemy.y += 5;
        enemy.x += getRandomInt(-15, 15);
        drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');

        /* enemy.shots.forEach((shot) => {
            shot.y += SHOOTING_SPEED;
            drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down');
        }); */
    });
}

let Enemies = interval(ENEMY_FREQ)
        .pipe(
            scan((enemyArray) => {                
                var enemy = {
                    x: parseInt(Math.random() * canvas.width),
                    y: -30
                };
                enemyArray.push(enemy);
                return enemyArray;
            }, [])
        );

export default Enemies;
   