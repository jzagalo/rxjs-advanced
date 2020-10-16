import { AsyncSubject, BehaviorSubject, from, interval, Observable, of, range, Subject, using } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { startWith, take, scan, map, tap, catchError, timestamp, 
        concatMap, mergeMap, bufferCount, switchMap, delay } from 'rxjs/operators';
import moment from 'moment';
import { emit } from 'pouchdb-browser';
let async = require("async");
let PouchDB = require('pouchdb-browser');
let pouchdb = PouchDB.default.defaults();
let txDb = new pouchdb('transactions');
txDb.info().then(info => console.log(info));
/* txDb.on('error', function (err) {
    console.log(err);
    debugger; }); */

/*
 * Any code samples you want to play with can go in this file.
 * Updates will trigger a live reload on http://localhost:1234/
 * after running npm start.
 */
/* of('Hello', 'RxJS').subscribe(console.log);

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

$countDownSession.subscribe(console.log); */

/* class Transaction {
    constructor(name, type, amount, from, to = null){
        this.name = name;
        this.type = type;
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

function getTransactionsArray(){
    return [
        new Transaction('Brendan Eich', 'withdraw', 500, 'checking'),
        new Transaction('George Lucas', 'deposit', 800, 'savings'),
        new Transaction('Emmet Brown', 'transfer', 2000, 'checking', 'savings'),
        new Transaction('Bjarne Stroustrup', 'transfer', 1000, 'savings', 'CD'),
    ];
}

const writeTx$ = tx => of(tx).pipe(
    bufferCount(20),
    timestamp(),    
    map(obj => Object.assign({}, obj.value, { date: obj.timestamp })),
    tap(tx => console.log(`Processing transaction for: ${tx.name}`)),
    mergeMap(datedTx => from(txDb.post(datedTx)))
);

const count = {
    map: function(doc){
        emit(doc.name);
    },
    reduce: '_count'
};


from(getTransactionsArray()).pipe(
    switchMap(writeTx$),
    mergeMap(() => from(
       txDb.query(count, {reduce: true }) 
    ))
).subscribe(
        recs => console.log(`Total:  ${recs.rows[0].value}`),
        err => console.log('Error: ' + err),
        () => console.log('Database Populated')
);  */

let subject = new Subject();
let source = interval(300)
                .pipe(
                    map(v => `Interval message #` + v ),
                   // take(5)
         );


const onNext = x => console.log('onNext '+ x);
const onError = e => console.log('onError '+ e);
const onCompleted = x => console.log('onCompleted');

let subscription = subject.subscribe({
    next: onNext,
    error: onError,
    complete: onCompleted
});

source.subscribe(subject);

//subject.next('Our message #1');
//subject.next('Our message #2');

setTimeout(() => {
    subject.complete();
}, 1000);

let delayedRange = range(0, 5).pipe(
    delay(1000)
);

let asyncSubject = new AsyncSubject();
delayedRange.subscribe(asyncSubject);
asyncSubject.subscribe({
    next: onNext,
    error: onError,
    complete: onCompleted
});

function getProducts(url){
    let subject;
    return Observable.create((observer) => {
        if(!subject){
            subject = new BehaviorSubject("Waiting for Content");
            ajax('https://jsonplaceholder.typicode.com/users')
                .subscribe(subject)
        }

        return subject.subscribe(observer);
    });
}

var products = getProducts('/products');
products.subscribe({
    next: (result) => console.log('Result 1: ', result.response? result.response : result),
    error: (error) => console('ERROR ', error),
    complete: () => console.log('Completed')
});

setTimeout(() => {
    products.subscribe({
        next: (result) => console.log('Result 2: ', result.response? result.response : result),
        error: (error) => console('ERROR ', error),
        complete: () => console.log('Completed')
    });
})

