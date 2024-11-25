import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { faTv, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { XtreamService } from 'src/services/xtream-service';
import { ChannelService } from 'src/services/channel-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  public faTv = faTv;
  public LIVEpercent: number = 0;
  public LIVEShowLoading: boolean = true;
  constructor(private route: Router, private platform: Platform, private xtreamService: XtreamService,
    private channelService: ChannelService) {

  }

  ngAfterViewInit(): void {
    this.platform.ready().then(async () => {
      this.selectDefaultIndex();
      this.channelService.login().then(async () => {
        if (!(await this.channelService.hasLIVEChannels())) {
          this.channelService.downloadLIVEChannels().subscribe((percent) => {
            this.LIVEpercent = percent / 100;
            //console.log(`LIVE Channels Downloading: ${percent}%`);
          }, () => { }, () => {
            this.LIVEShowLoading = false;
          });
        } else {
          this.LIVEShowLoading = false;
        }
      });
    });
  }

  public navigate(path: string) {
    if (this.LIVEShowLoading) return;
    this.route.navigate(['home', path]);
  }

  public getLiveInformation() {
    this.xtreamService.getLineInformation().subscribe((r) => {
      console.log(r);
    }, (e) => console.log(e));
  }

  private focusIndex = 0;
  private rows = 2;
  private cols = 3;
  private element?: HTMLElement;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const focusableElements = Array.from(document.querySelectorAll('.focusable')) as HTMLElement[];

    switch (event.key) {
      case 'ArrowRight':
        this.changeFocusGrid(focusableElements, 'ArrowRight');
        break;
      case 'ArrowLeft':
        this.changeFocusGrid(focusableElements, 'ArrowLeft');
        break;
      case 'ArrowDown':
        this.changeFocusGrid(focusableElements, 'ArrowDown');
        break;
      case 'ArrowUp':
        this.changeFocusGrid(focusableElements, 'ArrowUp');
        break;
      case 'Enter':
        this.element?.click();
        break;
    }
  }

  private changeFocusGrid(elements: HTMLElement[], direction: string) {
    const currentRow = Math.floor(this.focusIndex / this.cols);
    const currentCol = this.focusIndex % this.cols;

    let newRow = currentRow;
    let newCol = currentCol;

    switch (direction) {
      case 'ArrowRight':
        newCol = (currentCol + 1) % this.cols;
        break;
      case 'ArrowLeft':
        newCol = (currentCol - 1 + this.cols) % this.cols;
        break;
      case 'ArrowDown':
        newRow = (currentRow + 1) % this.rows;
        break;
      case 'ArrowUp':
        newRow = (currentRow - 1 + this.rows) % this.rows;
        break;
    }

    const newIndex = newRow * this.cols + newCol;
    elements[this.focusIndex]?.classList.remove('focused');
    this.focusIndex = newIndex;
    elements[this.focusIndex]?.classList.add('focused');
    elements[this.focusIndex]?.focus();
    console.log(this.focusIndex)
    this.element = elements[this.focusIndex];
  }

  private selectDefaultIndex() {
    setTimeout(() => {
      const focusableElements = Array.from(document.querySelectorAll('.focusable')) as HTMLElement[];
      focusableElements[0]?.focus();
      this.element = focusableElements[0];
    }, 1000)
  }
}
