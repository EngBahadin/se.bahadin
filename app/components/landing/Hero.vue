<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { footer, global } = useAppConfig()
const colorMode = useColorMode()

defineProps<{
  page: IndexCollectionItem
}>()

const downloadCV = () => {
  if (process.client && typeof document !== 'undefined') {
    const link = document.createElement('a')
    link.href = '/bahadin.pdf'
    link.download = 'Bahadin_Ali_CV.pdf'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Rotating technologies for hero description
const technologies = ['React.js', 'React Native', 'Next.js', 'Nuxt.js', 'Vue.js']
const currentTech = ref(technologies[0])
let techInterval: NodeJS.Timeout | null = null

onMounted(() => {
  let index = 0
  techInterval = setInterval(() => {
    index = (index + 1) % technologies.length
    currentTech.value = technologies[index]
  }, 3000) // Change every 3 seconds
})

onUnmounted(() => {
  if (techInterval) {
    clearInterval(techInterval)
  }
})

// Frontend technologies to display in hero
const frontendTechs = [
  { name: 'React', icon: 'i-simple-icons-react', color: 'cyan', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', textColor: 'text-cyan-400' },
  { name: 'Next.js', icon: 'i-simple-icons-nextdotjs', color: 'neutral', bgColor: 'bg-neutral-500/10', borderColor: 'border-neutral-500/30', textColor: 'text-neutral-400' },
  { name: 'Vue.js', icon: 'i-simple-icons-vuedotjs', color: 'emerald', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', textColor: 'text-emerald-400' },
  { name: 'Nuxt.js', icon: 'i-simple-icons-nuxtdotjs', color: 'emerald', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', textColor: 'text-emerald-400' },
  { name: 'React Native', icon: 'i-simple-icons-react', color: 'cyan', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', textColor: 'text-cyan-400' },
  { name: 'Expo', icon: 'i-simple-icons-expo', color: 'neutral', bgColor: 'bg-neutral-500/10', borderColor: 'border-neutral-500/30', textColor: 'text-neutral-400' },
  { name: 'Git', icon: 'i-simple-icons-git', color: 'orange', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', textColor: 'text-orange-400' },
  { name: 'GitHub', icon: 'i-simple-icons-github', color: 'neutral', bgColor: 'bg-neutral-500/10', borderColor: 'border-neutral-500/30', textColor: 'text-neutral-400' },
  { name: 'TypeScript', icon: 'i-simple-icons-typescript', color: 'blue', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', textColor: 'text-blue-400' },
  { name: 'JavaScript', icon: 'i-simple-icons-javascript', color: 'yellow', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', textColor: 'text-yellow-400' }
]
</script>

<template>
  <UPageHero
    id="hero"
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.05,
          opacity: 0
        }"
        :animate="{
          scale: 1,
          opacity: 1
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <div class="size-24 sm:size-28 lg:size-32 ring ring-default ring-offset-3 ring-offset-bg rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 cursor-pointer">
          <NuxtImg
            :src="colorMode.value === 'dark' ? global.picture?.dark : global.picture?.light"
            :alt="global.picture?.alt"
            class="w-full h-full object-cover transition-transform duration-300"
            style="image-rendering: crisp-edges; transform: translateZ(0);"
            loading="eager"
            fetchpriority="high"
            format="webp"
            quality="90"
          />
        </div>
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        {{ page.title }}
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3
        }"
      >
        {{ page.description }} With 
        <span class="inline-block min-w-[140px] text-left">
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <span :key="currentTech" class="inline-block font-bold text-black dark:text-white">{{ currentTech }}</span>
          </Transition>
        </span>
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div
          v-if="page.hero.links"
          class="flex items-center gap-2"
        >
          <UButton v-bind="page.hero.links[0]" />
          <UButton
            @click="downloadCV"
            color="primary"
            variant="ghost"
            class="gap-2"
            label="Download my CV"
          >
            <template #leading>
              <UIcon name="i-lucide-download" class="size-4" />
            </template>
          </UButton>
        </div>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          v-for="(link, index) of footer?.links"
          :key="index"

          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.5 + index * 0.1
          }"
        >
          <UButton
            v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
          />
        </Motion>
      </div>
    </template>

    <UMarquee
      pause-on-hover
      class="py-2 -mx-8 sm:-mx-12 lg:-mx-16 [--duration:40s]"
    >
      <Motion
        v-for="(tech, index) in frontendTechs"
        :key="tech.name"
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: index * 0.1
        }"
      >
        <div
          :class="[
            tech.bgColor,
            tech.borderColor,
            tech.textColor,
            'rounded-xl border-2 p-6 aspect-square flex flex-col items-center justify-center gap-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl',
            index % 2 === 0 ? '-rotate-2' : 'rotate-2'
          ]"
          style="min-width: 150px; min-height: 150px;"
        >
          <UIcon
            :name="tech.icon"
            class="size-16"
          />
          <span class="text-sm font-bold text-center">{{ tech.name }}</span>
        </div>
      </Motion>
    </UMarquee>
  </UPageHero>
</template>
