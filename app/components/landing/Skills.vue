<script setup lang="ts">
import type { IndexCollectionItem } from "@nuxt/content";

defineProps<{
  page: IndexCollectionItem;
}>();

const GRID_SIZE = 20; // Grid cells
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1920
);
const CELL_SIZE = computed(() => {
  // Smaller cells on mobile, larger on desktop
  return windowWidth.value < 640 ? 20 : 30; // 20px on mobile, 30px on desktop
});
const GAME_SPEED = 150; // Milliseconds per move

// Hide game on screens smaller than 340px
const isGameVisible = computed(() => windowWidth.value >= 340);

// Update window width on resize for responsive design - debounced for performance
let resizeTimeout: NodeJS.Timeout | null = null;
if (typeof window !== "undefined") {
  window.addEventListener("resize", () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      windowWidth.value = window.innerWidth;
    }, 150); // Debounce resize events
  });
}

// Snake game state
const snake = ref([{ x: 10, y: 10 }]);
const direction = ref({ x: 1, y: 0 });
const food = ref<{ x: number; y: number; skill: any } | null>(null);
const gameRunning = ref(false);
const score = ref(0);
const gameOver = ref(false);

// Available skills (shuffled)
const allSkills = [
  {
    name: "React.js",
    icon: "i-simple-icons-react",
    color: "cyan",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/50",
    textColor: "text-cyan-400",
  },
  {
    name: "Next.js",
    icon: "i-simple-icons-nextdotjs",
    color: "neutral",
    bgColor: "bg-neutral-500/20",
    borderColor: "border-neutral-500/50",
    textColor: "text-neutral-400",
  },
  {
    name: "Vue.js",
    icon: "i-simple-icons-vuedotjs",
    color: "emerald",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/50",
    textColor: "text-emerald-400",
  },
  {
    name: "Nuxt.js",
    icon: "i-simple-icons-nuxtdotjs",
    color: "emerald",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/50",
    textColor: "text-emerald-400",
  },
  {
    name: "TypeScript",
    icon: "i-simple-icons-typescript",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "JavaScript",
    icon: "i-simple-icons-javascript",
    color: "yellow",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/50",
    textColor: "text-yellow-400",
  },
  {
    name: "HTML",
    icon: "i-simple-icons-html5",
    color: "orange",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/50",
    textColor: "text-orange-400",
  },
  {
    name: "CSS",
    icon: "i-simple-icons-css3",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "SCSS",
    icon: "i-simple-icons-sass",
    color: "pink",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/50",
    textColor: "text-pink-400",
  },
  {
    name: "Tailwind CSS",
    icon: "i-simple-icons-tailwindcss",
    color: "cyan",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/50",
    textColor: "text-cyan-400",
  },
  {
    name: "React Router",
    icon: "i-simple-icons-reactrouter",
    color: "red",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/50",
    textColor: "text-red-400",
  },
  {
    name: "React Hook Form",
    icon: "i-simple-icons-reacthookform",
    color: "pink",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/50",
    textColor: "text-pink-400",
  },
  {
    name: "Vite",
    icon: "i-simple-icons-vite",
    color: "yellow",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/50",
    textColor: "text-yellow-400",
  },
  {
    name: "jQuery",
    icon: "i-simple-icons-jquery",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "EJS",
    icon: "i-lucide-file-code",
    color: "amber",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/50",
    textColor: "text-amber-400",
  },
  {
    name: "React Native",
    icon: "i-simple-icons-react",
    color: "cyan",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/50",
    textColor: "text-cyan-400",
  },
  {
    name: "Expo",
    icon: "i-simple-icons-expo",
    color: "neutral",
    bgColor: "bg-neutral-500/20",
    borderColor: "border-neutral-500/50",
    textColor: "text-neutral-400",
  },
  {
    name: "Framer Motion",
    icon: "i-simple-icons-framer",
    color: "purple",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-400",
  },
  {
    name: "Shadcn UI",
    icon: "i-simple-icons-shadcnui",
    color: "neutral",
    bgColor: "bg-neutral-500/20",
    borderColor: "border-neutral-500/50",
    textColor: "text-neutral-400",
  },
  {
    name: "Headless UI",
    icon: "i-simple-icons-headlessui",
    color: "purple",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-400",
  },
  {
    name: "Material-UI",
    icon: "i-simple-icons-mui",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "Axios",
    icon: "i-simple-icons-axios",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "Zod",
    icon: "i-simple-icons-zod",
    color: "indigo",
    bgColor: "bg-indigo-500/20",
    borderColor: "border-indigo-500/50",
    textColor: "text-indigo-400",
  },
  {
    name: "Quill",
    icon: "i-lucide-pen-tool",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "i18n",
    icon: "i-lucide-languages",
    color: "green",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/50",
    textColor: "text-green-400",
  },
  {
    name: "Redux",
    icon: "i-simple-icons-redux",
    color: "purple",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-400",
  },
  {
    name: "Zustand",
    icon: "i-devicon-plain-zustand",
    color: "orange",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/50",
    textColor: "text-orange-400",
  },
  {
    name: "Pinia",
    icon: "i-simple-icons-pinia",
    color: "yellow",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/50",
    textColor: "text-yellow-400",
  },
  {
    name: "Tanstack Query",
    icon: "i-simple-icons-reactquery",
    color: "pink",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/50",
    textColor: "text-pink-400",
  },
  {
    name: "Node.js",
    icon: "i-simple-icons-nodedotjs",
    color: "emerald",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/50",
    textColor: "text-emerald-400",
  },
  {
    name: "Express.js",
    icon: "i-simple-icons-express",
    color: "neutral",
    bgColor: "bg-neutral-500/20",
    borderColor: "border-neutral-500/50",
    textColor: "text-neutral-400",
  },
  {
    name: "PostgreSQL",
    icon: "i-simple-icons-postgresql",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "Git",
    icon: "i-simple-icons-git",
    color: "orange",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/50",
    textColor: "text-orange-400",
  },
  {
    name: "GitHub",
    icon: "i-simple-icons-github",
    color: "neutral",
    bgColor: "bg-neutral-500/20",
    borderColor: "border-neutral-500/50",
    textColor: "text-neutral-400",
  },
  {
    name: "Postman",
    icon: "i-simple-icons-postman",
    color: "orange",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/50",
    textColor: "text-orange-400",
  },
  {
    name: "Cypress",
    icon: "i-simple-icons-cypress",
    color: "emerald",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/50",
    textColor: "text-emerald-400",
  },
  {
    name: "Vitest",
    icon: "i-simple-icons-vitest",
    color: "yellow",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/50",
    textColor: "text-yellow-400",
  },
  {
    name: "Webpack",
    icon: "i-simple-icons-webpack",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "ESLint",
    icon: "i-simple-icons-eslint",
    color: "purple",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-400",
  },
  {
    name: "Prettier",
    icon: "i-simple-icons-prettier",
    color: "neutral",
    bgColor: "bg-neutral-500/20",
    borderColor: "border-neutral-500/50",
    textColor: "text-neutral-400",
  },
  {
    name: "npm",
    icon: "i-simple-icons-npm",
    color: "red",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/50",
    textColor: "text-red-400",
  },
  {
    name: "Yarn",
    icon: "i-simple-icons-yarn",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "pnpm",
    icon: "i-simple-icons-pnpm",
    color: "orange",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/50",
    textColor: "text-orange-400",
  },
  {
    name: "Scrum",
    icon: "i-lucide-users",
    color: "blue",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/50",
    textColor: "text-blue-400",
  },
  {
    name: "Agile",
    icon: "i-lucide-zap",
    color: "purple",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/50",
    textColor: "text-purple-400",
  },
];

// Shuffle skills - only on client
const shuffledSkills = ref<typeof allSkills>([]);
const remainingSkills = ref<typeof allSkills>([]);

// Center element - rotating tech stacks
const currentCenterSkill = ref(0);
const centerRotationInterval = ref<NodeJS.Timeout | null>(null);

onMounted(() => {
  // Use requestIdleCallback for non-critical initialization
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      initializeGame();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(initializeGame, 100);
  }
});

function initializeGame() {
  // Shuffle skills only on client
  shuffledSkills.value = [...allSkills].sort(() => Math.random() - 0.5);
  remainingSkills.value = [...shuffledSkills.value];

  window.addEventListener("keydown", handleKeyPress);
  generateFood();

  // Start center rotation
  centerRotationInterval.value = setInterval(() => {
    currentCenterSkill.value =
      (currentCenterSkill.value + 1) % allSkills.length;
  }, 2000); // Change every 2 seconds
}

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
  stopGame();
  if (centerRotationInterval.value) {
    clearInterval(centerRotationInterval.value);
  }
});

// Generate random food position
function generateFood() {
  if (remainingSkills.value.length === 0) {
    // All stacks eaten - victory!
    gameOver.value = true;
    gameRunning.value = true; // Keep running state to show victory message
    return;
  }

  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      skill: remainingSkills.value[0],
    };
  } while (
    snake.value.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    )
  );

  remainingSkills.value.shift();
  food.value = newFood;
}

// Move snake
function moveSnake() {
  if (!gameRunning.value || gameOver.value) return;

  const head = { ...snake.value[0] };
  head.x += direction.value.x;
  head.y += direction.value.y;

  // Check wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver.value = true;
    gameRunning.value = false;
    return;
  }

  // Check self collision
  if (
    snake.value.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver.value = true;
    gameRunning.value = false;
    return;
  }

  snake.value.unshift(head);

  // Check food collision
  if (food.value && head.x === food.value.x && head.y === food.value.y) {
    score.value++;
    // Show eaten label
    showEatenLabel(food.value.skill);
    generateFood();
  } else {
    snake.value.pop();
  }
}

// Game loop
let gameInterval: NodeJS.Timeout | null = null;

function startGame() {
  snake.value = [{ x: 10, y: 10 }];
  direction.value = { x: 1, y: 0 };
  score.value = 0;
  gameOver.value = false;
  remainingSkills.value = [...shuffledSkills.value].sort(
    () => Math.random() - 0.5
  );
  generateFood();
  gameRunning.value = true;

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(moveSnake, GAME_SPEED);
}

function stopGame() {
  gameRunning.value = false;
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

// Change direction helper
function changeDirection(newDirection: { x: number; y: number }) {
  if (!gameRunning.value || gameOver.value) {
    if (!gameRunning.value && !gameOver.value) {
      startGame();
    } else if (gameOver.value) {
      startGame();
    }
    return;
  }

  // Prevent reversing into itself
  if (
    newDirection.x === -direction.value.x &&
    newDirection.y === -direction.value.y
  ) {
    return;
  }

  if (newDirection.x !== 0 && direction.value.x === 0) {
    direction.value = newDirection;
  } else if (newDirection.y !== 0 && direction.value.y === 0) {
    direction.value = newDirection;
  }
}

// Keyboard controls
function handleKeyPress(event: KeyboardEvent) {
  // Prevent default behavior for arrow keys to stop page scrolling
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
  }

  if (!gameRunning.value && !gameOver.value) {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      startGame();
    }
    return;
  }

  if (gameOver.value) {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      startGame();
    }
    return;
  }

  switch (event.key) {
    case "ArrowUp":
      changeDirection({ x: 0, y: -1 });
      break;
    case "ArrowDown":
      changeDirection({ x: 0, y: 1 });
      break;
    case "ArrowLeft":
      changeDirection({ x: -1, y: 0 });
      break;
    case "ArrowRight":
      changeDirection({ x: 1, y: 0 });
      break;
  }
}

// Touch/Swipe controls
const touchStart = ref<{ x: number; y: number } | null>(null);

function handleTouchStart(event: TouchEvent) {
  const touch = event.touches[0];
  touchStart.value = { x: touch.clientX, y: touch.clientY };
}

function handleTouchEnd(event: TouchEvent) {
  if (!touchStart.value) return;

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStart.value.x;
  const deltaY = touch.clientY - touchStart.value.y;
  const minSwipeDistance = 30;

  // Determine swipe direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        changeDirection({ x: 1, y: 0 }); // Right
      } else {
        changeDirection({ x: -1, y: 0 }); // Left
      }
    }
  } else {
    // Vertical swipe
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        changeDirection({ x: 0, y: 1 }); // Down
      } else {
        changeDirection({ x: 0, y: -1 }); // Up
      }
    }
  }

  touchStart.value = null;
}

// Calculate food size based on remaining skills and screen size
const foodSize = computed(() => {
  const total = allSkills.length;
  const remaining = remainingSkills.value.length;
  const ratio = remaining / total;

  // Responsive base size
  const baseSize = CELL_SIZE.value < 25 ? 16 : 20;
  const maxSize = CELL_SIZE.value < 25 ? 24 : 30;

  // Start at maxSize, shrink to baseSize as skills are eaten
  return baseSize + ratio * (maxSize - baseSize);
});

// Eaten labels - show temporarily when snake eats a stack
const eatenLabels = ref<Array<{ id: number; skill: any; timestamp: number }>>(
  []
);
let labelIdCounter = 0;

function showEatenLabel(skill: any) {
  const id = labelIdCounter++;
  eatenLabels.value.push({
    id,
    skill,
    timestamp: Date.now(),
  });

  // Remove label after 3 seconds
  setTimeout(() => {
    const index = eatenLabels.value.findIndex((label) => label.id === id);
    if (index !== -1) {
      eatenLabels.value.splice(index, 1);
    }
  }, 3000);
}
</script>

<template>
  <UPageSection
    id="skills"
    title="Tech Stack"
    description="These are the technologies I work with. Use arrow keys to control the snake and devour tech stacks! The more you eat, the more powerful you become! 🚀"
    :ui="{
      container: 'px-0 !pt-0 gap-8',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted',
    }"
  >
    <div class="relative w-full flex flex-col items-center gap-4">
      <!-- All Tech Stacks Icons -->
      <div class="w-full max-w-4xl px-4 mb-4 flex items-center justify-center">
        <div class="relative" style="width: 400px; height: 400px">
          <ClientOnly>
            <!-- Center Element -->
            <div
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div
                :class="[
                  allSkills[currentCenterSkill].bgColor,
                  allSkills[currentCenterSkill].borderColor,
                  allSkills[currentCenterSkill].textColor,
                  'rounded-full border-2 backdrop-blur-sm shadow-lg shadow-neutral-950/5 flex flex-col items-center justify-center transition-all duration-500 p-4 min-w-[120px]',
                ]"
                :title="allSkills[currentCenterSkill].name"
              >
                <UIcon
                  :name="allSkills[currentCenterSkill].icon"
                  class="size-8 mb-2 transition-all duration-500"
                />
                <span
                  class="text-xs font-semibold text-center transition-all duration-500"
                >
                  {{ allSkills[currentCenterSkill].name }}
                </span>
              </div>
            </div>

            <div
              v-for="(skill, index) in allSkills"
              :key="index"
              :class="[
                skill.bgColor,
                skill.borderColor,
                skill.textColor,
                'absolute rounded-full border border-opacity-50 p-1.5 backdrop-blur-sm transition-transform duration-300 hover:scale-110 cursor-pointer flex items-center justify-center',
              ]"
              :title="skill.name"
              :style="{
                left: `calc(50% + ${
                  150 * Math.cos((2 * Math.PI * index) / allSkills.length)
                }px)`,
                top: `calc(50% + ${
                  150 * Math.sin((2 * Math.PI * index) / allSkills.length)
                }px)`,
                transform: 'translate(-50%, -50%)',
              }"
            >
              <UIcon :name="skill.icon" class="size-3.5" />
            </div>

            <template #fallback>
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div
                  class="size-24 rounded-full bg-muted/80 backdrop-blur-sm border border-muted/50 shadow-lg shadow-neutral-950/5 flex items-center justify-center"
                >
                  <div class="text-center">
                    <div class="text-2xl font-bold">Tech</div>
                    <div class="text-xs text-muted">Stack</div>
                  </div>
                </div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Eaten Labels - Temporary display at top -->
      <div class="relative w-full max-w-[600px] h-12 overflow-hidden">
        <TransitionGroup
          name="eaten-label"
          tag="div"
          class="flex flex-wrap items-center justify-center gap-2 px-4"
        >
          <div
            v-for="label in eatenLabels"
            :key="label.id"
            :class="[
              label.skill.bgColor,
              label.skill.borderColor,
              label.skill.textColor,
              'eaten-label-item px-3 py-1.5 rounded-lg border-2 backdrop-blur-sm flex items-center gap-2 shadow-lg',
            ]"
          >
            <UIcon :name="label.skill.icon" class="size-4" />
            <span class="text-xs font-bold whitespace-nowrap">
              {{ label.skill.name }}
            </span>
          </div>
        </TransitionGroup>
      </div>

      <!-- Score -->
      <div class="flex items-center justify-center w-full max-w-[600px] px-4">
        <div class="flex items-center gap-4">
          <div class="text-sm font-medium">
            Score: <span class="text-primary">{{ score }}</span>
          </div>
          <div class="text-sm text-muted">
            Remaining:
            <span class="text-primary">{{ remainingSkills.length }}</span>
          </div>
        </div>
      </div>

      <!-- Game Board -->
      <div
        v-if="isGameVisible"
        class="w-full max-w-[600px] flex items-center justify-center px-4"
        :style="{
          minWidth: `${GRID_SIZE * CELL_SIZE}px`,
        }"
      >
        <div
          class="relative rounded-2xl border-2 border-default/50 bg-elevated/30 overflow-hidden touch-none select-none"
          :style="{
            width: `${GRID_SIZE * CELL_SIZE}px`,
            height: `${GRID_SIZE * CELL_SIZE}px`,
            minWidth: `${GRID_SIZE * CELL_SIZE}px`,
            minHeight: `${GRID_SIZE * CELL_SIZE}px`,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
          @selectstart.prevent
          @dragstart.prevent
        >
          <!-- Grid Background -->
          <div
            class="absolute inset-0 opacity-10"
            style="
              background-image: linear-gradient(
                  to right,
                  currentColor 1px,
                  transparent 1px
                ),
                linear-gradient(to bottom, currentColor 1px, transparent 1px);
              background-size: 30px 30px;
            "
          />

          <!-- Snake -->
          <div
            v-for="(segment, index) in snake"
            :key="`snake-${index}`"
            class="absolute rounded-md bg-primary border-2 border-primary/50 transition-all duration-75 ease-linear flex items-center justify-center"
            :style="{
              left: `${segment.x * CELL_SIZE}px`,
              top: `${segment.y * CELL_SIZE}px`,
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              zIndex: 10 + index,
            }"
          >
            <UIcon
              v-if="index === 0"
              name="i-lucide-circle"
              class="size-3 text-primary-foreground"
            />
          </div>

          <!-- Food (Tech Stack) -->
          <div
            v-if="food"
            :class="[
              food.skill.bgColor,
              food.skill.borderColor,
              food.skill.textColor,
              'absolute rounded-lg border-2 backdrop-blur-sm flex items-center justify-center transition-all duration-300 animate-pulse select-none pointer-events-none',
            ]"
            :style="{
              left: `${food.x * CELL_SIZE + (CELL_SIZE - foodSize) / 2}px`,
              top: `${food.y * CELL_SIZE + (CELL_SIZE - foodSize) / 2}px`,
              width: `${foodSize}px`,
              height: `${foodSize}px`,
              zIndex: 5,
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }"
          >
            <UIcon
              :name="food.skill.icon"
              :style="{ fontSize: `${foodSize * 0.6}px` }"
            />
          </div>

          <!-- Victory Message (All stacks eaten) -->
          <div
            v-if="gameOver && remainingSkills.length === 0"
            class="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div class="text-center space-y-4 px-4">
              <div class="text-5xl mb-2 animate-bounce">🎉</div>
              <h3
                class="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                Congratulations!
              </h3>
              <p class="text-xl font-semibold text-primary">
                You've mastered all the tech stacks!
              </p>
              <p class="text-muted">
                Your snake devoured all {{ allSkills.length }} technologies
              </p>
              <p class="text-sm text-muted italic">
                "A true full-stack developer in the making! 🚀"
              </p>
              <UButton
                @click="startGame"
                color="primary"
                size="lg"
                class="mt-4"
              >
                Play Again
              </UButton>
            </div>
          </div>

          <!-- Game Over Overlay (Collision) -->
          <div
            v-else-if="gameOver"
            class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div class="text-center space-y-4 px-4">
              <div class="text-5xl mb-2">💥</div>
              <h3 class="text-2xl font-bold">Oops! Game Over</h3>
              <p class="text-muted">
                Final Score:
                <span class="text-primary font-bold text-xl">{{ score }}</span>
              </p>
              <p class="text-sm text-muted italic">
                "The snake got a bit too hungry... 😅"
              </p>
              <p class="text-xs text-muted mb-4">
                Swipe or use arrow keys to restart
              </p>
              <UButton @click="startGame" color="primary" size="lg">
                Try Again
              </UButton>
            </div>
          </div>

          <!-- Start Message -->
          <div
            v-if="!gameRunning && !gameOver"
            class="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-40"
          >
            <div class="text-center space-y-4">
              <h3 class="text-xl font-bold">Snake Game</h3>
              <p class="text-sm text-muted">
                Use arrow keys to control the snake
              </p>
              <p class="text-xs text-muted">Eat tech stacks to grow longer!</p>
              <UButton
                @click="startGame"
                color="primary"
                size="lg"
                class="mt-4"
              >
                Start Game
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div
        v-if="isGameVisible"
        class="text-xs text-muted text-center max-w-[600px] px-4"
      >
        <p class="hidden md:block">
          Use <kbd class="px-2 py-1 bg-default rounded">↑</kbd>
          <kbd class="px-2 py-1 bg-default rounded">↓</kbd>
          <kbd class="px-2 py-1 bg-default rounded">←</kbd>
          <kbd class="px-2 py-1 bg-default rounded">→</kbd> arrow keys to
          control the snake
        </p>
        <p class="md:hidden">Swipe on the game board to control the snake</p>
      </div>

      <!-- Message for small screens -->
      <div
        v-else
        class="text-sm text-muted text-center max-w-[600px] px-4 py-8"
      >
        <p>
          Game is not available on screens smaller than 340px. Please use a
          larger device to play.
        </p>
      </div>
    </div>
  </UPageSection>
</template>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
    "Liberation Mono", monospace;
}

/* Prevent selection on game board */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

/* Responsive grid background */
@media (max-width: 640px) {
  .game-board-grid {
    background-size: 20px 20px;
  }
}

/* Eaten label animations */
.eaten-label-enter-active {
  transition: all 0.3s ease-out;
}

.eaten-label-leave-active {
  transition: all 0.3s ease-in;
}

.eaten-label-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}

.eaten-label-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}

.eaten-label-move {
  transition: transform 0.3s ease;
}

.eaten-label-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
</style>
