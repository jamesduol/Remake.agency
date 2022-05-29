/* eslint-disable no-use-before-define */
/* eslint-disable no-empty */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const path = require('path')
const port = 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const UAParser = require('ua-parser-js')

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

const handleLinkResolver = doc => {
  if (doc.type === 'work') {
    return '/work'
  }

  if (doc.type === 'study') {
    return `/case/${doc.uid}`
  }

  if (doc.type === 'contact') {
    return '/contact'
  }

  if (doc.type === 'about') {
    return '/about'
  }

  return '/'
}

// Middleware
app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = handleLinkResolver

  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest = async api => {
  const about = await api.getSingle('about')
  const contact = await api.getSingle('contact')
  const home = await api.getSingle('home')
  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')
  const study = await api.getSingle('study')
  const work = await api.getSingle('work')

  // const study = await api.getByUID('study', req.params.uid, {
  //   fetchLinks: 'home.title'
  // })

  // console.log(about, contact, home)

  const assets = []

  home.data.gallery.forEach(item => {
    // console.log(item)
    assets.push(item.image.url)
  })

  about.data.body.forEach(section => {
    if (section.slice_type === 'media') {
      // console.log(about.data.body)
      assets.push(section.primary.image.url)
    }
  })

  contact.data.body.forEach(section => {
    if (section.slice_type === 'leaders') {
      // console.log(contact.data.body)
      assets.push(section.primary.image.url)
    }
  })

  study.data.body.forEach(section => {
    if (section.slice_type === 'highlight') {
      section.items.forEach(media => {
        assets.push(media.image.url)
      })
    }
  })

  work.data.body.forEach(section => {
    if (section.slice_type === 'study') {
      section.items.forEach(media => {
        // console.log(work.data.body)
        assets.push(media.image.url)
      })
    }
  })

  return {
    about,
    assets,
    contact,
    home,
    meta,
    navigation,
    preloader,
    study,
    work
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('base', {
    ...defaults
  })
})

// Deconstructing the backend data
app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('base', {
    ...defaults
  })
})

app.get('/case/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  const study = await api.getByUID('study', req.params.uid, {
    fetchLinks: 'home.title'
  })

  // console.log(study.data.body)

  res.render('base', {
    ...defaults,
    study
  })
})

app.get('/contact', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('base', {
    ...defaults
  })
})

// Deconstructing the backend data
app.get('/work', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('base', {
    ...defaults
  })
})

app.listen(port, () => {
  console.log(`App Server listening at http://localhost:${port}`)
})
