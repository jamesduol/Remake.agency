/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-new */

/**
 * Modules.
 * using ES6 import in Node.js.
 *
 */

import NormalizeWheel from 'normalize-wheel'

import each from 'lodash/each'

import Canvas from 'components/Canvas'

import Navigation from 'components/Navigation'
import Preloader from 'components/Preloader'
import Transition from 'components/Transition'

import About from 'pages/About'
import Case from 'pages/Case'
import Contact from 'pages/Contact'
import Home from 'pages/Home'
import Work from 'pages/Work'

class App {
  /**
   * A Constructor () {) is basically a function.
   */
  constructor () {
    this.template = window.location.pathname

    /**
   * Methods.
   */
    this.createCanvas()
    this.createPreloader()
    // this.createContent()
    this.createTransition()
    this.createNavigation()
    this.createPages()

    this.addEventListeners()
    this.addLinkListeners()

    this.onResize()

    this.update()
  }

  /**
   * Functions.
   */
  createCanvas () {
    this.canvas = new Canvas({
      template: this.template
    })
  }

  createNavigation () {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPreloader () {
    this.preloader = new Preloader({
      canvas: this.canvas
    })

    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  // createContent () {
  //   this.content = document.querySelector('.content')
  //   this.template = this.content.getAttribute('data-template')
  // }

  createTransition () {
    this.transition = new Transition()
  }

  createPages () {
    this.about = new About()
    this.case = new Case()
    this.contact = new Contact()
    this.home = new Home()
    this.work = new Work()

    this.pages = {
      '/': this.home,
      '/about': this.about,
      '/cases': this.cases,
      '/contact': this.contact,
      '/work': this.work
    }

    this.page = this.pages[this.template]
    // this.page.create()

    // this.pages = {
    //   about: new About(),
    //   case: new Case(),
    //   contact: new Contact(),
    //   home: new Home(),
    //   work: new Work()
    // }

    // this.page = this.pages[this.template]
    // this.page.create()
  }

  /**
   * Events.
   */
  onPreloaded () {
    this.onResize()

    this.canvas.onPreloaded()

    this.page.show()
  }

  onPopState () {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  // The initialize the onChange function
  async onChange ({ url, push = true }) {
    url = url.replace(window.location.origin, '')

    const page = this.pages[url]

    await this.transition.show({
      color: page.element.getAttribute('data-color')
    })

    if (push) {
      window.history.pushState({}, '', url)
    }

    this.template = window.location.pathname

    this.page.hide()

    this.navigation.onChange(this.template)
    this.canvas.onChange(this.template)

    this.page = page
    this.page.show()

    this.onResize()

    this.transition.hide()
  }

  /**
   * Events.
   */
  onResize () {
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }

    window.requestAnimationFrame(_ => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize()
      }
    })
  }

  onTouchDown (event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event)
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event)
    }
  }

  onTouchMove (event) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event)
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchMove(event)
    }
  }

  onTouchUp (event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event)
    }

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchUp(event)
    }
  }

  onWheel (event) {
    const normalizedWheel = NormalizeWheel(event)

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel)
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel)
    }
  }

  /**
   * Loop.
   */
  update () {
    if (this.page && this.page.update) {
      this.page.update()
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll)
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('mousewheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      const isLocal = link.href.indexOf(window.location.origin) > -1

      const isNotEmail = link.href.indexOf('mailto') === -1
      const isNotPhone = link.href.indexOf('tel') === -1

      if (isLocal) {
        link.onclick = event => {
          event.preventDefault()

          const { href } = link

          this.onChange({ url: href })
        }

        // link.onmouseenter = event => this.onLinkMouseEnter(link)
        // link.onmouseleave = event => this.onLinkMouseLeave(link)
      } else if (isNotEmail && isNotPhone) {
        link.rel = 'noopener'
        link.target = '_blank'
      }
    })
  }
}

new App()
