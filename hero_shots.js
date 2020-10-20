import { combineLatest, fromEvent, interval, merge } from "rxjs";
import { filter, sample, timestamp } from "rxjs/operators";
import { canvas, spaceShip } from "./starfield_1";



var playerFiring = merge(
    fromEvent(canvas, 'click'),
    fromEvent(canvas, 'keydown')
).pipe(
    filter(event => event.keycode === 32),
    sample(interval(200)),
    timestamp(),
 );

 var HeroShots = combineLatest(
     playerFiring, spaceShip,
     (shotEvents, spaceship) => {
         return { x: spaceShip.x }
 }).scan((shortArray, shot){
     shortArray.push({ x: shot.x, y: HERO_Y });
     return shortArray;
 }, []);