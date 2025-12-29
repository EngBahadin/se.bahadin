import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/#hero'
}, {
  label: 'About',
  icon: 'i-lucide-user',
  to: '/#about'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/#projects'
}, {
  label: 'Contact',
  icon: 'i-lucide-mail',
  to: '/#contact'
}]
