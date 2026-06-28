<template>
  <li>
    <a :href="`#${anchorId(rule.code)}`">{{ rule.name || rule.code }}</a>
    <ol v-if="rule.rule && rule.rule.length > 0">
      <TocItem
        v-for="child in rule.rule"
        :key="child.code"
        :rule="child"
        :depth="depth + 1"
      />
    </ol>
  </li>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

defineProps<{
  rule: CitationRule
  depth: number
}>()

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}
</script>
