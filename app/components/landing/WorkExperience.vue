<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()

const logoImageError = ref(false)
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{
      container: '!p-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2'
    }"
  >
    <template #description>
      <div class="flex flex-col gap-2">
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="text-muted flex flex-wrap items-center gap-1 sm:flex-nowrap"
        >
          <p class="text-sm">
            {{ experience.date }}
          </p>
          <USeparator />
          <ULink
            class="flex items-center gap-2"
            :to="experience.company.url"
            target="_blank"
          >
            <span class="text-sm">
              {{ experience.position }}
            </span>
            <div
              class="inline-flex items-center gap-1.5"
              :style="{ color: experience.company.color }"
            >
              <span class="font-medium">{{ experience.company.name }}</span>
              <div
                v-if="experience.company.logo && experience.company.logo.startsWith('/')"
                class="rotate-3 size-12 rounded-lg bg-white dark:bg-gray-100 p-2 ring ring-default ring-offset-2 ring-offset-bg overflow-hidden transition-transform duration-300 hover:scale-110 cursor-pointer relative"
              >
                <NuxtImg
                  :src="experience.company.logo"
                  :alt="experience.company.name"
                  class="w-full h-full object-contain transition-transform duration-300"
                  format="webp"
                  quality="90"
                  @error="logoImageError = true"
                />
                <div
                  v-if="logoImageError"
                  class="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs rounded-lg"
                >
                  B
                </div>
              </div>
              <UIcon v-else-if="experience.company.logo" :name="experience.company.logo" class="size-4" />
            </div>
          </ULink>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>
