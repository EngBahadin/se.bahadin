<script setup lang="ts">
</script>

<template>
  <div class="w-full overflow-x-hidden">
    <UContainer class="sm:border-x border-default pt-10 max-w-full">
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter />
    </UContainer>
  </div>
</template>
