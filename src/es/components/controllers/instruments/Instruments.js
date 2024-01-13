// @ts-check
/* global fetch */
/* global AbortController */
/* global location */
/* global sessionStorage */
/* global CustomEvent */
/* global history */
/* global self */

/** @typedef {{ label: string, id: string }} instrument */

/** @typedef {instrument[]} instruments */

import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Instruments retrieves instruments via the corresponding endpoint as set as an attribute
 * As a controller, this component communicates exclusively through events
 * Example: http://musigschuel-dev.schenk-smart-solutions.ch/swagger/index.html
 *
 * @export
 * @class Instruments
 * @type {CustomElementConstructor}
 */
export default class Instruments extends Shadow() {
  constructor (options = {}, ...args) {
    super({
      importMetaUrl: import.meta.url,
      mode: 'false',
      ...options
    }, ...args)

    this.abortController = null
    this.requestListInstrumentsListener = async event => {
      if (this.abortController) this.abortController.abort()
      this.abortController = new AbortController()
      const lang = this.getAttribute('lang') || document.documentElement.getAttribute('lang') || 'de-CH'
      const endpoint = this.getAttribute('endpoint')
        ? `${this.getAttribute('endpoint')}?lang=${lang}`
        : `http://musigschuel-dev.schenk-smart-solutions.ch/api/instruments?lang=${lang}`
      this.dispatchEvent(new CustomEvent(this.getAttribute('instruments') || 'instruments',
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
           * @return {Promise<{options: instruments}>}
           */
          async response => {
            if (response.status >= 200 && response.status <= 299) {
              const instruments = await response.json()
              return {options: instruments.map(instrument => ({value: instrument.id, textContent: instrument.label}))}
            }
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
    this.addEventListener(this.getAttribute('request-instruments') || 'request-instruments', this.requestListInstrumentsListener)
  }

  disconnectedCallback () {
    this.removeEventListener(this.getAttribute('request-instruments') || 'request-instruments', this.requestListInstrumentsListener)
  }
}
