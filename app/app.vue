<script setup lang="ts">
const colorMode = useColorMode();
const { isInitialLoading, setLoading } = useInitialLoading();

const color = computed(() =>
  colorMode.value === "dark" ? "#020618" : "white",
);

useHead({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [
    { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", href: "/favicon.ico", sizes: "any" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
  ],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  titleTemplate: "%s - Bahadin Ali",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <LoadingScreen />
    <NuxtLayout
      :class="[
        'transition-opacity duration-500',
        isInitialLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      ]"
    >
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
