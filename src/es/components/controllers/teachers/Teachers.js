// @ts-check
/* global fetch */
/* global AbortController */
/* global location */
/* global sessionStorage */
/* global CustomEvent */
/* global history */
/* global self */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Teachers retrieves teachers via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: http://musigschuel-dev.schenk-smart-solutions.ch/swagger/index.html
 *
 * @export
 * @class Teachers
 * @type {CustomElementConstructor}
 */
export default class Teachers extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.abortController = null
    this.requestListTeachersListener = async event => {
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      this.dispatchEvent(new CustomEvent(this.getAttribute('teachers') || 'teachers', {
        detail: {
          fetch: fetch(this.getAttribute('endpoint'), {
            method: 'GET',
            signal: this.abortController.signal
          }).then(async response => {
            if (response.status >= 200 && response.status <= 299) return await response.json()
            throw new Error(response.statusText)
          })
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
  }

  connectedCallback () {
    this.addEventListener(this.getAttribute('request-teachers') || 'request-teachers', this.requestListTeachersListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-teachers') || 'request-teachers', this.requestListTeachersListener)
  }
}
