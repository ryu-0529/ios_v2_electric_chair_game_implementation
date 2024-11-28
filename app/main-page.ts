import { NavigatedData, Page } from '@nativescript/core';
import { MainViewModel } from './main-view-model';

let viewModel: MainViewModel | null = null;

export function navigatingTo(args: NavigatedData) {
    try {
        const page = <Page>args.object;
        if (!viewModel) {
            viewModel = new MainViewModel();
        }
        page.bindingContext = viewModel;
    } catch (error) {
        console.error('Navigation error:', error);
    }
}

export function onNavigatingFrom(args: NavigatedData) {
    try {
        const page = <Page>args.object;
        page.bindingContext = null;
    } catch (error) {
        console.error('Navigation from error:', error);
    }
}