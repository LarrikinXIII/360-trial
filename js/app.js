import { Viewer } from '@photo-sphere-viewer/core';

console.log("App loaded");

const viewer = new Viewer({
    container: document.querySelector('#viewer'),
    panorama: 'images/livingroom.jpg'
});

console.log(viewer);
