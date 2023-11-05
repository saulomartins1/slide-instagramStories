export default class Slide {
    container;
    slides;
    controls;
    time;
    index;
    slide;
    constructor(container, slides, controls, time = 5000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.index = 0;
        this.slide = slides[this.index];
        this.show(this.index);
    }
    hide(element) {
        element.classList.remove("active");
    }
    show(index) {
        this.index = index;
        this.slide = this.slides[this.index];
        this.slides.forEach((element) => {
            if (element.classList.contains("active")) {
                this.hide(element);
            }
            ;
            this.slide.classList.add("active");
        });
    }
}
