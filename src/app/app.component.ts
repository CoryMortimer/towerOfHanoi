import { Component } from '@angular/core';

import {ServiceWorkerService} from './shared/service-worker.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tower of Hanoi';
  pegs = 3;
  disks = 6;
  instructions = [];
  instructionsString;

  constructor(private serviceWorker: ServiceWorkerService) {
    serviceWorker.startServiceWorker();
  }
  

  formatAndAddInstructions(disk, source, destination) {
    source = String.fromCharCode(65 + source);
    destination = String.fromCharCode(65 + destination);
    this.instructions.push(
      {
        disk: disk,
        source: source,
        destination: destination
      }
    );
  }

  wrapAddition(num, max, options) {
    if (!!options && !!options.reverse) {
      return num - 1 < 0 ? max - 1 : num - 1;
    }
    return num + 1 >= max ? 0 : num + 1;
  }

  move(pegs, oldLoc, newLoc) {
    pegs[newLoc].unshift(pegs[oldLoc].shift());
    this.formatAndAddInstructions(pegs[newLoc][0], oldLoc, newLoc);
  }

  moveSmall(pegs, loc, numOfPegs, options) {
    let newLoc = this.wrapAddition(loc, numOfPegs, options);
    this.move(pegs, loc, newLoc);
    return newLoc;
  }

  getMoveLocation(pegs, smallPeg) {
    let availablePegs = [];
    for (let i = 0; i < Object.keys(pegs).length; i++) {
      if (i !== smallPeg) {
        availablePegs.push(i);
      }
    }
    var lowestNumber = Number.POSITIVE_INFINITY;
    var availablePegIndex;
    var to;
    for (let i = 0; i < availablePegs.length; i++) {
      let currentPeg = pegs[availablePegs[i]];
      if (currentPeg.length && currentPeg[0] < lowestNumber) {
        lowestNumber = currentPeg[0];
        if (!isNaN(availablePegIndex)) {
          to = availablePegIndex;
        }
        availablePegIndex = i;
      } else {
        to = i;
      }
    }
    return {from: availablePegs[availablePegIndex], to: availablePegs[to]}
  }

  printTower() {
    this.instructions = [];
    let numberOfDisks = this.disks;
    if (numberOfDisks < 1) {
      console.log('this.instructions', this.instructions);
      return;
    }
    let reverse = numberOfDisks % 2 > 0;
    var pegs = {};

    for (let i = 0; i < this.pegs; i++) {
      pegs[i] = [];
    }

    var disks = [];

    for (let i = 1; i <= numberOfDisks; i++) {
      disks.push(i);
    }

    pegs[0] = disks;

    let smallMoved = false;
    var smallPegLocation = 0;
    do {
      if (smallMoved) {
        smallMoved = false;
        let moveObj = this.getMoveLocation(pegs, smallPegLocation);
        this.move(pegs, moveObj.from, moveObj.to);
      } else {
        smallMoved = true;
        smallPegLocation = this.moveSmall(pegs, smallPegLocation, this.pegs, {reverse: reverse});
      }
    } while (pegs[smallPegLocation].length !== numberOfDisks);
    this.instructionsString = JSON.stringify(this.instructions);
  }
}
