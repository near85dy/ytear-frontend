import { lv } from './lv'
import { en } from './en'

const LANG_KEY = 'ytear:lang'

function readStored() {
	try {
		const v = localStorage.getItem(LANG_KEY)
		return v === 'en' ? 'en' : 'lv'
	} catch {
		return 'lv'
	}
}

const langs: Record<string, any> = { lv, en }

export const t = langs[readStored()] as typeof lv

export function setLanguage(code: 'lv' | 'en') {
	try {
		localStorage.setItem(LANG_KEY, code)
	} catch {}
	// reload to apply translations across the app
	if (typeof window !== 'undefined') window.location.reload()
}

export function getLanguage(): 'lv' | 'en' {
	return readStored() as 'lv' | 'en'
}

