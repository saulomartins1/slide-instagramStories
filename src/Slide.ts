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

        this.index = 0;
        this.slide = slides[this.index];

        this.timeout = null;

        this.paused = false;
        this.pausedTimeout = null;

        this.init()
    }

    hide(element: Element) {
        element.classList.remove("active");
    }

    show(index: number) {
        this.index = index;
        this.slide = this.slides[this.index];

        this.slides.forEach((element) => {
            if (element.classList.contains("active")) {
                this.hide(element);
            };
            this.slide.classList.add("active");
        })
        this.auto(this.time);
    }

    auto(time: number) {
        this.timeout?.clear();
        this.timeout = new Timeout(() => this.next(), time);
    }

    pause() {
        this.pausedTimeout = new Timeout(() => {
            this.paused = true;
        }, 300);
    }
    continue() {
        this.pausedTimeout?.clear();
        if (this.paused) {
            this.paused = false;
            this.auto(this.time);
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

    private init() {
        this.addControls();
        this.show(this.index);
    }

}