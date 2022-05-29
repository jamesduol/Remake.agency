// // /* eslint-disable brace-style */
// // /* eslint-disable no-useless-constructor */
// // import EventEmitter from 'events'

// // import each from 'lodash/each'

// // export default class Component extends EventEmitter {
// //   /**
// //    * A Constructor () {) is basically a function.
// //    */
// //   constructor ({
// //     element,
// //     elements
// //   }) {
// //     /**
// //    * super() is basically a Function that calls the parent constructor.
// //    */
// //     super()

// //     /**
// //    * Properties.
// //    */
// //     this.selector = element
// //     this.selectorChildren = {
// //       ...elements
// //     }

// //     /**
// //    * Methods.
// //    */
// //     this.create()

// //     this.addEventListeners()
// //   }

// //   /**
// //    * Functions.
// //    */
// //   create () {
// //     if (this.selector instanceof window.HTMLElement) {
// //       this.element = this.selector
// //     } else {
// //       this.element = document.querySelector(this.selector)
// //     }

// //     this.elements = {}

// //     each(this.selectorChildren, (entry, key) => {
// //       if (
// //         entry instanceof window.HTMLElement ||
// //         entry instanceof window.NodeList ||
// //         Array.isArray(entry))
// //       {
// //         this.elements[key] = entry
// //       } else {
// //         this.elements[key] = document.querySelectorAll(entry)

// //         if (this.elements[key].length === 0) {
// //           this.elements[key] = null
// //         } else if (this.elements[key].length === 1) {
// //           this.elements[key] = document.querySelector(entry)
// //         }
// //       }
// //     })
// //   }

// //   /**
// //    * Animations.
// //    */
// //   addEventListeners () {

// //   }

// //   removeEventListeners () {

// //   }
// // }

// // From Bizarro
// import AutoBind from 'auto-bind'
// import EventEmitter from 'events'

// import each from 'lodash/each'

// export default class extends EventEmitter {
//   constructor ({ classes, element, elements, elementsForceArray }) {
//     super()

//     AutoBind(this)

//     this.classes = classes

//     this.element = element instanceof window.HTMLElement ? element : document.querySelector(element)
//     this.elements = {}

//     each(elements, (selector, key) => {
//       if (selector instanceof window.HTMLElement || selector instanceof window.NodeList) {
//         this.elements[key] = selector
//       } else if (Array.isArray(selector)) {
//         this.elements[key] = selector
//       } else {
//         this.elements[key] = this.element.querySelectorAll(selector)

//         if (this.elements[key].length === 0) {
//           this.elements[key] = null
//         } else if (this.elements[key].length === 1) {
//           this.elements[key] = this.element.querySelector(selector)
//         }
//       }
//     })

//     each(elementsForceArray, (selector, key) => {
//       this.elements[selector] = [this.elements[selector]]
//     })

//     this.addEventListeners()
//   }

//   addEventListeners () {

//   }

//   removeEventListeners () {

//   }

//   // destroy () {
//   //   this.removeEventListeners()
//   // }
// }

// From Floema
import AutoBind from 'auto-bind'
import EventEmitter from 'events'

import each from 'lodash/each'

export default class Component extends EventEmitter {
  constructor ({
    classes,
    element,
    elements
  }) {
    super()

    AutoBind(this)

    this.classes = classes
    this.selector = element
    this.selectorChildren = {
      ...elements
    }

    this.create()

    this.addEventListeners()
  }

  create () {
    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector
    } else {
      this.element = document.querySelector(this.selector)
    }

    this.elements = {}

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry
      } else {
        this.elements[key] = this.element.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(entry)
        }
      }
    })
  }

  addEventListeners () {

  }

  removeEventListeners () {

  }
}
