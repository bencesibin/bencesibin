import { Component, OnInit } from '@angular/core';
import { from, Subscription, interval, of } from 'rxjs';
import { take, distinct, partition, concatMapTo, filter, mergeMap, takeUntil, map, every, takeWhile } from 'rxjs/operators';

import { trigger, state, style, animate, transition, group } from '@angular/animations';

function* generator(min, max) {
  // console.log('out', i);
  // i++;

  while (true) {
    yield Math.round(Math.random() * (max - min) + min);
    // i++;
    // console.log('in', i);
  }
}

@Component({
  selector: 'app-name-generate',
  templateUrl: './name-generate.component.html',
  styleUrls: ['./name-generate.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({
        width: 25,
        transform: 'translateX(0)', opacity: 1
      })),
      transition('void => *', [
        style({ width: 25, transform: 'translateX(50px)', opacity: 0 }),
        group([
          animate('0.3s 0.1s ease', style({
            transform: 'translateX(0)',
            width: 25
          })),
          animate('0.3s ease', style({
            opacity: 1
          }))
        ])
      ]),
      transition('* => void', [
        group([
          animate('0.3s ease', style({
            transform: 'translateX(50px)',
            width: 25
          })),
          animate('0.3s 0.2s ease', style({
            opacity: 0
          }))
        ])
      ])
    ]),
    trigger('selected', [
      state('selected',
        style({
          backgroundColor: 'whitesmoke',
          transform: 'scale(1.2)',
        })
      ),
      // 3 - Comment this and Uncomment GROUPED ANIMATIONS to see them in action.
      transition('selected <=> *', [
        animate('300ms ease-in')
      ]),
      // GROUPED ANIMATIONS
      /* transition('selected => *', [
        group([
          // Apply pink color to the item and
          animate('1s ease',
            style({
              backgroundColor: '#ff4081'
            })
          ),
          // after a second, fade it to the background
          animate('2s 1.5s ease',
            style({
              opacity: 0.2,
              transform: 'scale(0.5)'
            })
          ),
        ])
      ])*/
    ])
  ]
})

export class NameGenerateComponent implements OnInit {
  RandNum: any[] = [];
  mySubscription: Subscription;
  chosenRandNum: string[] = [];
  selectedIndex: any[] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];
  playSubscribe: Subscription;

  ngOnInit(): void { }

  generateRandomNumber(minn = 1, maxx = 75) {
    if (this.mySubscription) { this.mySubscription.unsubscribe(); }
    this.chosenRandNum = [];
    this.RandNum = [];
    const i = 1;
    this.mySubscription = from(generator(minn, maxx))
      .pipe(
        distinct(),
        take(25)
      )
      .subscribe(
        value => this.RandNum.push(value),
        error => console.log(error),
        () => {
          this.RandNum = this.array_chunks(this.RandNum, 5);
        }
      );
  }

  array_chunks(array, chunkSize) {
    const arr = [];
    let i;
    let j;
    for (i = 0, j = array.length; i < j; i += chunkSize) {
      arr.push(
        array.slice(i, i + chunkSize)
      );

    }
    return arr;
  }
  play() {
    if (this.playSubscribe) { this.playSubscribe.unsubscribe(); }
    const v = ['B', 'I', 'N', 'G', 'O'];
    // this.chosenRandNum.push('B11');


    // const mySubscription: Subscription<number> = Observable.interval(3000)
    //   .map(data => generateRandomNumber(...))
    //   .subscribe(
    //     data => console.log(data),
    //     error => console.log(error),
    //     () => console.log('complete')
    //   );
    // * const interval = interval(1000);
    // * const clicks = fromEvent(document, 'click');
    // * const result = interval.pipe(takeUntil(clicks));
    // * result.subscribe(x => console.log(x));
    const check = of(this.selectedIndex).pipe(
      // every(arr => arr.every(val => val === 1)),
      map(data => false)
      // map(data => data.some(arr => arr.every(val => val === 1)))
    );
    const interval$ = interval(1000).pipe(
      take(10),
      takeWhile(che => !this.selectedIndex.some(arr => arr.every(val => val === 1)))
      // takeUntil(check)
    );
    // emit value every second for 5 seconds
    // const source = interval(1000).pipe(take(5));
    /*
      ***Be Careful***: In situations like this where the source emits at a faster pace
      than the inner observable completes, memory issues can arise.
      (interval emits every 1 second, basicTimer completes every 5)
    */
    // basicTimer will complete after 5 seconds, emitting 0,1,2,3,4
    const example = interval$.pipe(
      // take(100),
      mergeMap(
        iv => from(generator(1, 75)).pipe(
          distinct(),
          filter(x => !this.chosenRandNum.find(val => val === String(v[x % 5] + x))),
          take(1)
        ),
        (iv, valuegenerator) => {
          return valuegenerator;
        }
      )
      // mergeMap(iv => of(
      //   from(generator(1, 75)).pipe(
      //     distinct(),
      //     filter(x => !this.chosenRandNum.find(val => val === String(v[x % 5] + x))),
      //     take(1)
      //   ).subscribe(data => this.chosenRandNum.push(String(v[data % 5] + data)))
      // ))
    );
    //     from(generator(1, 75)).pipe(
    //     distinct(),
    //     filter(x => !this.chosenRandNum.find(val => val === String(v[x % 5] + x))),
    //     take(1)
    //   ),
    //   (intervalSub, genSub) => genSub
    // )
    // );
    /*
      output: 0 0
              0 1
              0 2
              0 3
              0 4
              1 0
              1 1
              continued...

    */
    this.playSubscribe = example.subscribe(
      val =>
        this.chosenRandNum.push(String(v[val % 5] + val))
      // console.log(val)
    );
    // const mySubscription: Subscription = interval(10)
    //   .from(generator(1, 25))
    //   .pipe(
    //     // distinctUntilChanged(),
    //     take(25)
    //   )
    //   .subscribe(
    //     data => {
    //       console.log(data);

    //       this.RandNum.push(data);
    //     },
    //     error => console.log(error),
    //     () => {
    //       console.log('complete');
    //       // this.RandNum.sort();
    //     }
    //   );

  }
}
