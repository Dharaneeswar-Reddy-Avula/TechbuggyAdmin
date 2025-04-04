export function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('appState', serializedState);
    } catch (err) {
        console.error('Could not save state', err);
    }
}

export function loadState() {
    try {
        const serializedState = localStorage.getItem('appState');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Could not load state', err);
        return undefined;
    }
}