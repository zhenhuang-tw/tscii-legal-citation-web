<template>
  <nav aria-label="頁面大綱">
    <ol>
      <template v-for="cat in rules" :key="cat.code">
        <li v-if="languageFilter.isVisible(cat.code)">
          <a :href="`#${anchorId(cat.code)}`">{{ cat.code }} {{ cat.name || '' }}</a>
          <ol v-if="cat.rule && cat.rule.length > 0">
            <TocItem
              v-for="child in cat.rule"
              :key="child.code"
              :rule="child"
            />
          </ol>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

defineProps<{
  rules: CitationRule[]
  languageFilter: { isVisible: (code: string) => boolean }
}>()

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}
</script>
