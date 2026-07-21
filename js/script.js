import { Viewer } from '@photo-sphere-viewer/core';

const viewer = new Viewer({

    container: document.querySelector('#viewer'),

    panorama: 'images/livingroom.jpg',

    defaultYaw: 0,

    defaultPitch: 0,

    defaultZoomLvl: 0,

    mousewheel: true,

    touchmoveTwoFingers: false,

    navbar: [

        'zoom',

        'move',

        'fullscreen'

    ],

    loadingImg: null

});
