<script setup lang="ts">
const { isInitialLoading, setLoading } = useInitialLoading()
const router = useRouter()

onMounted(async () => {
  // Wait for router to be ready
  await router.isReady()
  await nextTick()
  
  // Show for minimum 1 second
  setTimeout(() => {
    setLoading(false)
  }, 1000)
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isInitialLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
    >
      <div class="text-center animate-welcome">
        <h1 class="text-5xl sm:text-7xl font-bold text-foreground tracking-tight">
          Welcome
        </h1>
      </div>
    </div>
  </Transition>
</template>
