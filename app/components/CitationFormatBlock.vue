<template>
  <span v-if="formattedParts.length === 0">{{ format }}</span>
  <template v-else v-for="(part, i) in formattedParts" :key="i">
    <mark v-if="part.highlight">{{ part.text }}</mark>
    <template v-else>{{ part.text }}</template>
  </template>
</template>

<script setup lang="ts">
const props = defineProps<{ format: string }>()

interface Part {
  text: string
  highlight: boolean
}

const formattedParts = computed<Part[]>(() => {
  const parts: Part[] = []
  const regex = /\{\$(\w+)\}/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(props.format)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: props.format.slice(lastIndex, match.index), highlight: false })
    }
    parts.push({ text: match[1], highlight: true })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < props.format.length) {
    parts.push({ text: props.format.slice(lastIndex), highlight: false })
  }

  return parts
})
</script>
