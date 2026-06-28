<template>
  <article class="citation-card">
    <header>
      <h3>{{ rule.code }} {{ rule.name }}</h3>
    </header>

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

    <!-- Examples: string / string[] -->
    <section v-if="typeof rule.example === 'string' || Array.isArray(rule.example)">
      <!--<h4>範例</h4>-->
      <blockquote v-for="(ex, i) in asArray(rule.example)" :key="i">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="ex" />
      </blockquote>
    </section>

    <!-- Examples: Record<string, string | string[]> -->
    <section v-else-if="typeof rule.example === 'object'">
      <h4>範例</h4>
      <div v-for="(val, key) in rule.example" :key="key">
        <strong>{{ key }}</strong>
        <blockquote v-for="(ex, j) in asArray(val)" :key="j">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ex" />
        </blockquote>
      </div>
    </section>

    <!-- Multiple type examples -->
    <section v-if="rule.multipleTypeExample && rule.multipleTypeExample.length > 0">
      <h4>範例</h4>
      <template v-for="(group, gi) in rule.multipleTypeExample" :key="gi">
        <h5>{{ group.type }}</h5>
        <blockquote v-for="(ex, ei) in group.example" :key="ei">{{ ex }}</blockquote>
      </template>
    </section>

    <slot />

    <footer v-if="rule.webNote">
      <small>📝 {{ rule.webNote }}</small>
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

defineProps<{ rule: CitationRule }>()

function asArray(val: string | string[]): string[] {
  return Array.isArray(val) ? val : [val]
}
</script>
