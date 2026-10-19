// src/lib/i18n/prefs.svelte.ts
class Prefs {
	saved = $state<string | null>(null);
	nav = $state.raw<string[]>([]); // replaced as a whole, so no deep proxy needed

	init() {
		try {
			this.saved = localStorage.getItem('locale');
		} catch {
			console.log('localstorage');
		}
		this.nav = [...navigator.languages]; // copy: readonly string[] -> string[]
	}

	choose(tag: string | null) {
		this.saved = tag;
		try {
			if (tag) localStorage.setItem('locale', tag);
			else localStorage.removeItem('locale');
		} catch {
			console.log('tag localstorage');
		}
	}
}
export const prefs = new Prefs();
