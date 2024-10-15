import { writable } from "svelte/store";

export const boardStore = writable({
    boardUrl: null,
    from: 0,
    total: 0
});