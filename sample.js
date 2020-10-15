import { interval, of, using } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { startWith, take, scan, map, tap } from 'rxjs/operators';
import moment from 'moment';
var async = require("async");

/*
 * Any code samples you want to play with can go in this file.
 * Updates will trigger a live reload on http://localhost:1234/
 * after running npm start.
 */
of('Hello', 'RxJS').subscribe(console.log);

class DisposableReasource{
    constructor(value){
        this.value = value;
        this.disposed = false;
    }

    getValue(){
        if(this.disposed){
            throw new Error('Object is disposed');
        }
        return this.value
    }

    unsubscribe(){
        if(!this.disposed){
            this.disposed = true;
            this.value = null;
        }
        console.log("Disposed");
    }
}

const source$ = using(
    () => new DisposableReasource(42),
    resource => interval(1000).pipe(take(10))
);

const subscription = source$.subscribe(
    next => console.log(`Next: ${next}`),
    err => console.log(`Error: ${err}`),
    () => console.log('Completed')
);

subscription.unsubscribe();

class SessionDisposable {
    constructor(sessionToken){
        this.token = sessionToken;
        this.disposed = false;
        let expiration = moment().add(1, 'days').toDate();
        document.cookie = `session_token=${sessionToken}expires=${expiration.toUTCString()}`
    }

    getToken(){
        return this.token;
    }

    unsubscribe(){
        if(!this.disposed){
            this.disposed = true;
            this.token = null;
            document.cookie = 'session_token=; expires=Thu, 01 Jan 1979 00:00:00 GMT';
            console.log('Ended session! This object has been disposed');
        }
    }
}

function generateSession(){
    return 'xyxyxyxy'.replace(/[xy]/g, c => {
        return Math.floor(Math.random() * 10);
    })
}

const $countDownSession = using(
    () => new SessionDisposable(generateSession()),
    () => interval(1000).pipe(
        startWith(10),
        scan(val => val - 1 ),
        take(10)
    )
);

$countDownSession.subscribe(console.log);

const buttonLoader = document.getElementById('data-loader');
buttonLoader.addEventListener('click', () => {

    async.parallel([
         callback => {
             fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(doc => callback(null, doc));
        },
         callback =>  {
             fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(doc => callback(null, doc));
        }
    ], function(err, results) {
        console.log(results);
    });

    /* async.parallel([
         (callback) =>  fetch('https://jsonplaceholder.typicode.com/posts')
         .then(res => res.json())
         .then(res => callback(res)),
         (callback) =>  fetch('https://jsonplaceholder.typicode.com/users')
         .then(res => res.json())
         .then(res => callback(res))
    ],
    (err, result) => {
        console.log("Entered");
        console.log(result);
    }); */
});
