<template>
  <Html :lang="'zh-Hant-TW'">
    <Head>
      <Script
        innerHTML="(function(){var t=localStorage.getItem('theme')||'auto';var d=t==='auto'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',d)})()"
      />
    </Head>
  </Html>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
