import { Component } from '@angular/core';

enum TapeType {
  RECOMMENDATION,
  FOLLOW,
  SELF,
}

interface TapeData {
  type: TapeType;
  
}

@Component({
  selector: 'app-tape-widget',
  imports: [],
  templateUrl: './tape-widget.html',
})
export class TapeWidget {}
