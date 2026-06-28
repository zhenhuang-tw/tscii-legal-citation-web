const STORAGE_KEY = 'citation-languages'

const ALL_LANGUAGE_CODES = ['2.', '3.', '4.', '5.', '6.'] as const

export function useLanguageFilter() {
  const enabledCodes = ref<Set<string>>(new Set(ALL_LANGUAGE_CODES))

  function load() {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const arr: string[] = JSON.parse(raw)
        enabledCodes.value = new Set(arr.filter(c => ALL_LANGUAGE_CODES.includes(c as typeof ALL_LANGUAGE_CODES[number])))
      }
    } catch {
      enabledCodes.value = new Set(ALL_LANGUAGE_CODES)
    }
  }

  function save() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...enabledCodes.value]))
  }

  function toggle(code: string) {
    if (enabledCodes.value.has(code)) {
      enabledCodes.value.delete(code)
    } else {
      enabledCodes.value.add(code)
    }
    enabledCodes.value = new Set(enabledCodes.value) // trigger reactivity
    save()
  }

  function isVisible(code: string): boolean {
    // "1" (通則) is always visible
    if (code === '1' || code === '1.') return true
    return enabledCodes.value.has(code)
  }

  load()

  return { enabledCodes, toggle, isVisible }
}
