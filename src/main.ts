import Slide from "./Slide.js";

const container = document.querySelector("#slide");
const elements = document.querySelector("#slide-elements");
const controls = document.querySelector("#slide-controls");


if (container && elements && controls && elements.children.length) {
    const slide = new Slide(container, Array.from(elements.children), controls, 3000);

    slide.show(2);
}
