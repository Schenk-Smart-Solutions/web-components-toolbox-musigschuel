// @ts-check
/* global fetch */
/* global AbortController */
/* global location */
/* global sessionStorage */
/* global CustomEvent */
/* global history */
/* global self */

/** @typedef {{ lat: number, lon: number, title: string, text: string, imageUrl: string, link: string, instruments: string[] }} teacher */

/** @typedef {teacher[]} teachers */

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
      const lang = this.getAttribute('lang') || document.documentElement.getAttribute('lang') || 'de-CH'
      const endpoint = this.getAttribute('endpoint')
        ? `${this.getAttribute('endpoint')}?lang=${lang}`
        : `http://musigschuel-dev.schenk-smart-solutions.ch/api/teachers?lang=${lang}`
      this.dispatchEvent(new CustomEvent(this.getAttribute('teachers') || 'teachers',
        {
          detail: {
            origin: (new URL(endpoint)).origin,
            fetch: fetch(endpoint,
              {
                method: 'GET',
                signal: this.abortController.signal
              }).then(
              /**
           * @param {Response} response
           * @return {Promise<teachers>}
           */
              async response => {
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
