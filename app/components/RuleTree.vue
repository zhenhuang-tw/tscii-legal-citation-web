<template>
  <!-- x.x rule (non-pure-description) → CitationCard; sub-rules in slot -->
  <component
    :is="isMobile ? 'details' : 'div'"
    v-if="isXx(rule.code) && !insideCard && !isPureDescription(rule)"
    :id="anchorId(rule.code)"
    data-rule-tree
  >
    <summary v-if="isMobile">{{ rule.code }} {{ rule.name }}</summary>
    <CitationCard :rule="rule">
      <RuleTree
        v-for="child in rule.rule"
        :key="child.code"
        :rule="child"
        :inside-card="true"
      />
    </CitationCard>
  </component>

  <!-- Non-x.x container, pure-desc x.x, or inside-card: render children -->
  <component
    :is="isMobile ? 'details' : 'div'"
    v-else-if="rule.rule"
    :id="anchorId(rule.code)"
    data-rule-tree
  >
    <summary v-if="isMobile">{{ rule.code }} {{ rule.name }}</summary>
    <h3 v-if="rule.name && !isMobile">{{ rule.code }} {{ rule.name }}</h3>
    <p v-if="rule.description && rule.rule">
      <template v-if="Array.isArray(rule.description)">
        <template v-for="(line, i) in rule.description" :key="i">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="line" /><br v-if="i < rule.description.length - 1" />
        </template>
      </template>
      <template v-else>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="rule.description" />
      </template>
    </p>
    <RuleTree
      v-for="child in rule.rule"
      :key="child.code"
      :rule="child"
      :inside-card="insideCard"
    />
  </component>

  <!-- Inside a card or non-x.x: inline leaf content -->
  <component
    :is="isMobile ? 'details' : 'div'"
    v-else-if="hasLeafContent(rule)"
    :id="anchorId(rule.code)"
    data-rule-leaf
  >
    <summary v-if="isMobile">{{ rule.code }} {{ rule.name || '' }}</summary>
    <h4 v-if="rule.name">{{ rule.code }} {{ rule.name }}</h4>
    <p v-if="rule.description">
      <template v-if="Array.isArray(rule.description)">
        <template v-for="(line, i) in rule.description" :key="i">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="line" /><br v-if="i < rule.description.length - 1" />
        </template>
      </template>
      <template v-else>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="rule.description" />
      </template>
    </p>
    <blockquote v-if="rule.format && !rule.description">
      <template v-if="Array.isArray(rule.format)">
        <p v-for="(f, i) in rule.format" :key="i">
          <CitationFormatBlock :format="f" />
        </p>
      </template>
      <template v-else>
        <CitationFormatBlock :format="rule.format" />
      </template>
    </blockquote>
    <blockquote v-for="(ex, i) in asArray(rule.example)" :key="i">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="ex" />
    </blockquote>
    <template v-if="typeof rule.example === 'object'">
      <div v-for="(val, key) in (rule.example as Record<string, string | string[]>)" :key="key">
        <strong>{{ key }}</strong>
        <blockquote v-for="(ex, j) in asArray(val)" :key="j">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ex" />
        </blockquote>
      </div>
    </template>
  </component>

  <!-- Pure description -->
  <p v-else-if="rule.description" :id="anchorId(rule.code)">
    {{ rule.code }}
    <template v-if="Array.isArray(rule.description)">
      <template v-for="(line, i) in rule.description" :key="i">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="line" /><br v-if="i < rule.description.length - 1" />
      </template>
    </template>
    <template v-else>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="rule.description" />
    </template>
  </p>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

const props = withDefaults(defineProps<{ rule: CitationRule; insideCard?: boolean }>(), {
  insideCard: false,
})

const isMobile = ref(false)

onMounted(() => {
  const mq = window.matchMedia('(max-width: 1023px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', (e) => {
    isMobile.value = e.matches
  })
})

function isXx(code: string): boolean {
  return /^\d+\.\d+$/.test(code)
}

function isPureDescription(rule: CitationRule): boolean {
  return !rule.name && !!rule.description
}

function hasLeafContent(rule: CitationRule): boolean {
  return (
    rule.format !== undefined ||
    rule.example !== undefined ||
    (rule.multipleTypeExample && rule.multipleTypeExample.length > 0)
  )
}

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}

function asArray(val: string | string[]): string[] {
  return Array.isArray(val) ? val : [val]
}
</script>
