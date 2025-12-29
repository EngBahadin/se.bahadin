<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: aboutPage } = await useAsyncData('about', () => {
  return queryCollection('about').first()
})

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

// Image error states
const aboutImageError = ref(false)
const projectImageErrors = ref<Record<string, boolean>>({})

useSeoMeta({
  title: page.value?.seo.title || page.value?.title,
  ogTitle: page.value?.seo.title || page.value?.title,
  description: page.value?.seo.description || page.value?.description,
  ogDescription: page.value?.seo.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    
    <UPageSection id="about" :ui="{ container: '!pt-0' }">
      <div class="max-w-3xl mx-auto px-4">
        <UPageHero
          :title="aboutPage?.title"
          :description="aboutPage?.description"
          orientation="horizontal"
          :ui="{
            container: 'flex flex-col sm:flex-row items-center gap-4',
            title: '!mx-0 text-left text-xl sm:text-2xl',
            description: '!mx-0 text-left text-sm text-muted',
            links: 'justify-start',
          }"
        >
          <div class="sm:rotate-4 size-20 sm:size-24 rounded-lg ring ring-default ring-offset-3 ring-offset-bg overflow-hidden transition-transform duration-300 hover:scale-110 cursor-pointer relative">
            <NuxtImg
              src="/hero/myPic2.png"
              alt="Bahadin Ali - Frontend Developer"
              class="w-full h-full object-cover transition-transform duration-300"
              style="image-rendering: crisp-edges; transform: translateZ(0);"
              loading="lazy"
              format="webp"
              quality="90"
              @error="aboutImageError = true"
            />
            <div
              v-if="aboutImageError"
              class="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground font-bold text-xl sm:text-2xl rounded-lg"
            >
              B
            </div>
          </div>
        </UPageHero>
        <div class="mt-4">
          <MDC v-if="aboutPage?.content" :value="aboutPage.content" unwrap="p" />
        </div>
      </div>
    </UPageSection>
    
    <UPageSection id="experience" :ui="{ container: '!pt-0' }">
      <LandingWorkExperience :page />
    </UPageSection>
    
    <ClientOnly>
      <LandingSkills :page />
      <template #fallback>
        <UPageSection id="skills" title="Tech Stack" description="Loading..." :ui="{ container: 'px-0 !pt-0 gap-8' }" />
      </template>
    </ClientOnly>
    <LandingTestimonials :page />
    
    <UPageSection id="projects" title="Projects" description="A collection of my recent work and projects" :ui="{ container: '!pt-0' }">
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="project.title"
          :description="project.description"
          :to="project.url === '#' || project.url === '' ? undefined : project.url"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last'
          }"
        >
          <template #leading>
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted">
                {{ new Date(project.date).getFullYear() }}
              </span>
              <UButton
                v-if="project.tags && project.tags.includes('In Progress')"
                size="xs"
                variant="ghost"
                color="amber"
                disabled
                class="cursor-default pointer-events-none border-0 bg-transparent text-amber-500 dark:text-amber-400"
              >
                In Progress
              </UButton>
            </div>
          </template>
          <template #description>
            <div class="space-y-2">
              <p>{{ project.description }}</p>
              <div
                v-if="project.tags && project.tags.filter(tag => tag !== 'In Progress').length > 0"
                class="space-y-3 mt-3"
              >
                <!-- Special layout for UniFood with React/Vue stacks -->
                <template v-if="project.title === 'UniFood'">
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-semibold text-muted">React Stack:</span>
                      <div class="flex flex-wrap gap-1.5">
                        <UBadge
                          v-for="tag in ['React', 'Next.js', 'Framer Motion']"
                          :key="tag"
                          size="xs"
                          color="neutral"
                          variant="soft"
                          class="dark:bg-white dark:text-gray-900 bg-gray-900 text-white border dark:border-white/30 border-gray-900/30"
                        >
                          {{ tag }}
                        </UBadge>
                      </div>
                    </div>
                    <USeparator />
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-semibold text-muted">Vue Stack:</span>
                      <div class="flex flex-wrap gap-1.5">
                        <UBadge
                          v-for="tag in ['Vue.js', 'Pinia']"
                          :key="tag"
                          size="xs"
                          color="neutral"
                          variant="soft"
                          class="dark:bg-white dark:text-gray-900 bg-gray-900 text-white border dark:border-white/30 border-gray-900/30"
                        >
                          {{ tag }}
                        </UBadge>
                      </div>
                    </div>
                    <USeparator />
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-semibold text-muted">Shared:</span>
                      <div class="flex flex-wrap gap-1.5">
                        <UBadge
                          v-for="tag in ['TypeScript', 'Tailwind CSS', 'Tanstack Query', 'Zod']"
                          :key="tag"
                          size="xs"
                          color="neutral"
                          variant="soft"
                          class="dark:bg-white dark:text-gray-900 bg-gray-900 text-white border dark:border-white/30 border-gray-900/30"
                        >
                          {{ tag }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- Default layout for other projects -->
                <div
                  v-else
                  class="flex flex-wrap gap-1.5"
                >
                  <UBadge
                    v-for="(tag, tagIndex) in project.tags.filter(tag => tag !== 'In Progress')"
                    :key="`${project.title}-tag-${tagIndex}`"
                    size="xs"
                    color="neutral"
                    variant="soft"
                    class="dark:bg-white dark:text-gray-900 bg-gray-900 text-white border dark:border-white/30 border-gray-900/30"
                  >
                    {{ tag }}
                  </UBadge>
                </div>
              </div>
            </div>
          </template>
          <div class="relative w-full h-48 rounded-lg overflow-hidden">
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="object-cover w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer"
              loading="lazy"
              format="webp"
              quality="85"
              @error="projectImageErrors[project.title] = true"
            />
            <div
              v-if="projectImageErrors[project.title]"
              class="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground font-bold text-4xl rounded-lg"
            >
              B
            </div>
          </div>
        </UPageCard>
      </Motion>
    </UPageSection>

    <UPageSection id="contact" title="Get in Touch" description="Have a project in mind or want to collaborate? I'd love to hear from you!" :ui="{ container: '!pt-0' }">
      <div class="flex flex-col items-center justify-center gap-6 py-8">
        <div class="text-center space-y-4">
          <p class="text-lg text-muted">Feel free to reach out via email</p>
          <UButton
            to="mailto:se.bahauddin@gmail.com"
            variant="outline"
            size="lg"
            class="gap-2"
          >
            <UIcon name="i-lucide-mail" class="size-5" />
            se.bahauddin@gmail.com
          </UButton>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
