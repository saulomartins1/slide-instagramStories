import Timeout from "./Timeout.js";

export default class Slide {
    container: Element;
    slides: Element[];
    controls: Element;
    time: number;

    index: number;
    slide: Element;

    timeout: Timeout | null;

    paused: boolean;
    pausedTimeout: Timeout | null;

    constructor(container: Element, slides: Element[], controls: Element, time: number = 5000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;

        this.index = localStorage.getItem("currentSlide") ? Number(localStorage.getItem("currentSlide")) : 0;
        this.slide = slides[this.index];

        this.timeout = null;

        this.paused = false;
        this.pausedTimeout = null;

        this.init()
    }

    hide(element: Element) {
        element.classList.remove("active");
        if (element instanceof HTMLVideoElement) {
            element.currentTime = 0;
            element.pause();
        }
    }

    show(index: number) {
        this.index = index;
        this.slide = this.slides[this.index];

        this.slides.forEach((element) => {
            if (element.classList.contains("active")) {
                this.hide(element);
            };
        })
        this.slide.classList.add("active");

        if (this.slide instanceof HTMLVideoElement) {
            this.autoVideo(this.slide);
        } else[
            this.auto(this.time)
        ]

        localStorage.setItem("currentSlide", String(this.index));
    }

    autoVideo(video: HTMLVideoElement) {
        video.muted = true;
        video.play();

        let firstPlay = true;
        if (firstPlay) {
            video.addEventListener("playing", () => {
                this.auto(video.duration * 1000);
            })
            firstPlay = false;
        }

    }

    auto(time: number) {
        this.timeout?.clear();
        this.timeout = new Timeout(() => this.next(), time);
    }

    pause() {
        this.pausedTimeout = new Timeout(() => {
            this.paused = true;
            this.timeout?.pause();
            if (this.slide instanceof HTMLVideoElement) this.slide.pause();
        }, 300);
    }
    continue() {
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.timeout?.continue();
            if (this.slide instanceof HTMLVideoElement) this.slide.play();
        }
    }

    prev() {
        if (this.paused) return;
        const prev = (this.index > 0) ? this.index - 1 : this.slides.length - 1;
        this.show(prev);
    }
    next() {
        if (this.paused) return;
        const next = (this.index + 1) < this.slides.length ? this.index + 1 : 0;
        this.show(next);
    }

    private addControls() {
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

    private addThumbItems() {
        const thumbContainer = document.createElement("div");
        thumbContainer.id = "slide-thumb";
        console.log(this.slides.length)
        for (let i = 0; i < this.slides.length; i++) {
            thumbContainer.innerHTML += `
                <span>
                    <span class="thumb-item">
                    </span>
                </span>
            `
        }
        this.controls.appendChild(thumbContainer);
    }

    private init() {
        this.addControls();
        this.addThumbItems();
        this.show(this.index);
    }

}