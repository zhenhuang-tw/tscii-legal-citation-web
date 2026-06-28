<template>
  <details class="rule-tree-container">
    <summary>
      <span class="rule-code">{{ rule.code }}</span>
      <span v-if="rule.name" class="rule-name">{{ rule.name }}</span>
      <span v-else-if="rule.description" class="rule-desc">
        {{ Array.isArray(rule.description) ? rule.description[0] : rule.description }}
      </span>
    </summary>

    <!-- Description for container nodes -->
    <p v-if="rule.description && rule.rule">
      <template v-if="Array.isArray(rule.description)">
        <template v-for="(line, i) in rule.description" :key="i">
          {{ line }}<br v-if="i < rule.description.length - 1" />
        </template>
      </template>
      <template v-else>{{ rule.description }}</template>
    </p>

    <!-- Recurse into children -->
    <template v-if="rule.rule">
      <RuleTree
        v-for="child in rule.rule"
        :key="child.code"
        :rule="child"
      />
    </template>

    <!-- Leaf node: no children, render as CitationCard -->
    <template v-else>
      <CitationCard :rule="rule" />
    </template>
  </details>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

defineProps<{ rule: CitationRule }>()
</script>
