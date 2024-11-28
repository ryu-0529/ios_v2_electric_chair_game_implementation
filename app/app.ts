import { Application } from '@nativescript/core';

Application.on(Application.uncaughtErrorEvent, (args) => {
    console.error('Uncaught error:', args.error);
});

Application.on(Application.discardedErrorEvent, (args) => {
    console.error('Discarded error:', args.error);
});

Application.run({ moduleName: 'app/main-page' });