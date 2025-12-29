<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const { isInitialLoading } = useInitialLoading()
</script>

<template>
  <div v-if="!isInitialLoading" class="fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-fit px-4">
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
      :ui="{
        link: 'px-1.5 sm:px-2 py-1 text-xs sm:text-sm',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #list-trailing>
        <ColorModeButton />
      </template>
    </UNavigationMenu>
  </div>
</template>
