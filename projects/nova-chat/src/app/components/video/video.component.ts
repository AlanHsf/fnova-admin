import {
    Component, OnInit, Input, Output, EventEmitter, ViewChild,
    AfterViewInit, ChangeDetectorRef, OnDestroy
} from '@angular/core';

@Component({
    selector: 'video-component',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})

export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('videoTag') private videoTag;
    @Input()
    url;
    @Output()
    private closeVideo: EventEmitter<any> = new EventEmitter();
    state = 'play';
    private timer = null;
    currentTime = 0;
    constructor(
        private cdr: ChangeDetectorRef
    ) { }
    public ngOnInit() {
        // pass
    }
    public ngAfterViewInit() {
        this.cdr.detectChanges();
    }
    public ngOnDestroy() {
        clearInterval(this.timer);
    }
    closeModal() {
        this.closeVideo.emit();
    }
    private play() {
        this.videoTag.nativeElement.play();
        this.state = 'play';
        this.timer = setInterval(() => {
            this.currentTime = this.videoTag.nativeElement.currentTime;
        }, 100);
    }
    private pause() {
        this.videoTag.nativeElement.pause();
        this.state = 'pause';
        clearInterval(this.timer);
    }
    videoEnd() {
        this.state = 'pause';
        clearInterval(this.timer);
    }
    changeCurrentTime(event) {
        this.currentTime = this.videoTag.nativeElement.currentTime =
            event.offsetX / 438 * this.videoTag.nativeElement.duration;
    }
    videoCanplay() {
        this.timer = setInterval(() => {
            this.currentTime = this.videoTag.nativeElement.currentTime;
        }, 100);
    }
}
