import { EventData, Page } from '@nativescript/core';
import { GameViewModel } from '../view-models/game-view-model';

export function navigatingTo(args: EventData) {
    try {
        const page = <Page>args.object;
        if (!page.bindingContext) {
            page.bindingContext = new GameViewModel();
        }
    } catch (error) {
        console.error('Navigation error:', error);
    }
}