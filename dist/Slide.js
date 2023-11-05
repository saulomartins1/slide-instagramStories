import Timeout from "./Timeout.js";
export default class Slide {
    container;
    slides;
    controls;
    time;
    index;
    slide;
    timeout;
    paused;
    pausedTimeout;
    constructor(container, slides, controls, time = 5000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.index = 0;
        this.slide = slides[this.index];
        this.timeout = null;
        this.paused = false;
        this.pausedTimeout = null;
        this.init();
    }
    hide(element) {
        element.classList.remove("active");
        if (element instanceof HTMLVideoElement) {
            element.currentTime = 0;
            element.pause();
        }
    }
    show(index) {
        this.index = index;
        this.slide = this.slides[this.index];
        this.slides.forEach((element) => {
            if (element.classList.contains("active")) {
                this.hide(element);
            }
            ;
        });
        this.slide.classList.add("active");
        if (this.slide instanceof HTMLVideoElement) {
            this.autoVideo(this.slide);
        }
        else
            [
                this.auto(this.time)
            ];
    }
    autoVideo(video) {
        video.muted = true;
        video.play();
        let firstPlay = true;
        if (firstPlay) {
            video.addEventListener("playing", () => {
                this.auto(video.duration * 1000);
            });
            firstPlay = false;
        }
    }
    auto(time) {
        this.timeout?.clear();
        this.timeout = new Timeout(() => this.next(), time);
    }
    pause() {
        this.pausedTimeout = new Timeout(() => {
            this.paused = true;
            this.timeout?.pause();
            if (this.slide instanceof HTMLVideoElement)
                this.slide.pause();
        }, 300);
    }
    continue() {
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.timeout?.continue();
            if (this.slide instanceof HTMLVideoElement)
                this.slide.play();
        }
    }
    prev() {
        if (this.paused)
            return;
        const prev = (this.index > 0) ? this.index - 1 : this.slides.length - 1;
        this.show(prev);
    }
    next() {
        if (this.paused)
            return;
        const next = (this.index + 1) < this.slides.length ? this.index + 1 : 0;
        this.show(next);
    }
    addControls() {
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.innerText = "Slide Anterior"; //accessibility
        nextButton.innerText = "Próximo Slide"; //accessibility
        this.controls.appendChild(prevButton);
        this.controls.appendChild(nextButton);
        prevButton.addEventListener("pointerup", () => this.prev());
        nextButton.addEventListener("pointerup", () => this.next());
        this.controls.addEventListener("pointerdown", () => this.pause());
        this.controls.addEventListener("pointerup", () => this.continue());
    }
    init() {
        this.addControls();
        this.show(this.index);
    }
}
