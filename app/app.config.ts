export default defineAppConfig({
  global: {
    picture: {
      dark: '/hero/myPic.png',
      light: '/hero/myPic.png',
      alt: 'Bahadin Ali - Frontend Developer'
    },
    meetingLink: 'https://cal.com/',
    email: 'se.bahauddin@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    button: {
      default: {
        class: 'ios-glass-button'
      }
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Built with Nuxt UI • © ${new Date().getFullYear()} Bahadin Ali`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/EngBahadin',
      'target': '_blank',
      'aria-label': 'GitHub Profile'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/bahadin-ali/',
      'target': '_blank',
      'aria-label': 'LinkedIn Profile'
    }]
  }
})
