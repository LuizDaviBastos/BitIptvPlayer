import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'container-loading',
  templateUrl: './container-loading.component.html',
  styleUrls: ['./container-loading.component.scss'],
})
export class ContainerLoadingComponent implements OnInit {

  @Input('showLoading') showLoading: boolean = true;
  @Input('percent')
  public set percent(value: number) {
    this.setLoadingState(1 - value);
    this.percentLabel = `${Math.floor(value * 100)}%`;
  }
  @ViewChild('loadingContainer') public loadingStyle?: ElementRef<HTMLDivElement>;

  public percentLabel: string = '0%';

  constructor() { }


  ngOnInit() { }

  public setLoadingState(percent: number) {
    if (this.loadingStyle?.nativeElement) {
      this.loadingStyle!.nativeElement.style.transform = `scaleX(${percent})`;
    }

  }
}
