const STORAGE_KEY = 'citation-languages'

const ALL_LANGUAGE_CODES = ['2.', '3.', '4.', '5.', '6.'] as const

export function useLanguageFilter() {
  const enabledCodes = ref<string[]>([...ALL_LANGUAGE_CODES])
  let loaded = false

  function load() {
    if (import.meta.server || loaded) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const arr: string[] = JSON.parse(raw)
        const filtered = arr.filter((c) =>
          ALL_LANGUAGE_CODES.includes(c as (typeof ALL_LANGUAGE_CODES)[number]),
        )
        if (filtered.length > 0) {
          enabledCodes.value = filtered
        }
      }
    } catch {
      // keep defaults
    }
    loaded = true
  }

  function save() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledCodes.value))
  }

  function toggle(code: string) {
    const idx = enabledCodes.value.indexOf(code)
    if (idx >= 0) {
      enabledCodes.value.splice(idx, 1)
    } else {
      enabledCodes.value.push(code)
    }
    save()
  }

  function isVisible(code: string): boolean {
    if (code === '1' || code === '1.') return true
    return enabledCodes.value.includes(code)
  }

  // Defer localStorage read until after hydration to avoid SSR mismatch
  onMounted(load)

  return { enabledCodes, toggle, isVisible }
}
