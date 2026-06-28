<template>
  <!-- ===== DESKTOP: no collapse ===== -->
  <template v-if="!isMobile">
    <!-- x.x rule (non-pure-description) → CitationCard; sub-rules in slot -->
    <div v-if="isXx(rule.code) && !insideCard && !isPureDescription(rule)" :id="anchorId(rule.code)">
      <CitationCard :rule="rule">
        <RuleTree
          v-for="child in rule.rule"
          :key="child.code"
          :rule="child"
          :inside-card="true"
        />
      </CitationCard>
    </div>

    <!-- Non-x.x container, pure-desc x.x, or inside-card: render children -->
    <div v-else-if="rule.rule" :id="anchorId(rule.code)" data-rule-tree>
      <h3 v-if="!insideCard">{{ rule.code }} {{ rule.name }}</h3>
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
    </div>

    <!-- Inside a card or non-x.x: inline leaf content -->
    <div v-else-if="hasLeafContent(rule)" :id="anchorId(rule.code)">
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
      <!-- Inline examples -->
      <ul v-if="Array.isArray(rule.example)">
        <li v-for="(ex, i) in rule.example" :key="i">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ex" />
        </li>
      </ul>
      <blockquote v-else-if="typeof rule.example === 'string'">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="rule.example" />
      </blockquote>
      <template v-else-if="typeof rule.example === 'object'">
        <div v-for="(val, key) in rule.example" :key="key">
          <strong>{{ key }}</strong>
          <blockquote v-if="typeof val === 'string'">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="val" />
          </blockquote>
          <ul v-else-if="Array.isArray(val)">
            <li v-for="(ex, j) in val" :key="j">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="ex" />
            </li>
          </ul>
        </div>
      </template>
    </div>

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

  <!-- ===== MOBILE: collapsible ===== -->
  <template v-else>
    <!-- x.x rule (non-pure-description) → CitationCard in details -->
    <details v-if="isXx(rule.code) && !insideCard && !isPureDescription(rule)" :id="anchorId(rule.code)">
      <summary>{{ rule.code }} {{ rule.name }}</summary>
      <CitationCard :rule="rule">
        <RuleTree
          v-for="child in rule.rule"
          :key="child.code"
          :rule="child"
          :inside-card="true"
        />
      </CitationCard>
    </details>

    <!-- Non-x.x container, pure-desc x.x, or inside-card: render children in details -->
    <details v-else-if="rule.rule" :id="anchorId(rule.code)" data-rule-tree>
      <summary>{{ rule.code }} {{ rule.name }}</summary>
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
    </details>

    <!-- Inside a card or non-x.x: inline leaf content in details -->
    <details v-else-if="hasLeafContent(rule)" :id="anchorId(rule.code)">
      <summary>{{ rule.code }} {{ rule.name || '' }}</summary>
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
      <!-- Inline examples -->
      <ul v-if="Array.isArray(rule.example)">
        <li v-for="(ex, i) in rule.example" :key="i">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ex" />
        </li>
      </ul>
      <blockquote v-else-if="typeof rule.example === 'string'">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="rule.example" />
      </blockquote>
      <template v-else-if="typeof rule.example === 'object'">
        <div v-for="(val, key) in rule.example" :key="key">
          <strong>{{ key }}</strong>
          <blockquote v-if="typeof val === 'string'">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="val" />
          </blockquote>
          <ul v-else-if="Array.isArray(val)">
            <li v-for="(ex, j) in val" :key="j">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="ex" />
            </li>
          </ul>
        </div>
      </template>
    </details>

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
</script>
