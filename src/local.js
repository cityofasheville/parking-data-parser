import {handler} from './index.js';

// Set forceCsvCapture: true in the event object to test CSV writing regardless of time
let event = {
  forceCsvCapture: true
};

handler(event).then(() => {
    console.log('done');
}).catch((err) => {
    console.error(err);
});