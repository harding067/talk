
const $ = (selector) => {
    return document.querySelector(selector);
} 

const $$ = (selector) => {
    return document.querySelectorAll(selector);
}

const $$$ = (tagName) => {
    return document.createElement(tagName);
}