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
      if (this.hasAttribute('mock')) return this.dispatchMock()
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
                  return { options: instruments.map(instrument => ({ value: instrument.id, textContent: instrument.label })) }
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

  dispatchMock () {
    return this.dispatchEvent(new CustomEvent(this.getAttribute('instruments') || 'instruments', {
      detail: {
        origin: (new URL('http://musigschuel-dev.schenk-smart-solutions.ch/api/instruments')).origin,
        /** @type {Promise<{options: any}>} */
        fetch: Promise.resolve({ options: [
          {
              label: "Bass",
              id: "6147254d-24c1-4930-bf92-ca5ca3942e32"
          },
          {
              label: "Gittare",
              id: "d9b4d8fc-0a89-4ac5-96a8-bb9fd8050073"
          },
          {
              label: "Schlagzeug",
              id: "106b2535-65ad-4d73-9af4-d0eb069f6c50"
          },
          {
              label: "Drehleiher",
              id: "3c7787c9-d2d2-4fa6-b12b-cb4323fc4af3"
          },
          {
              label: "Klavier",
              id: "b50a92cc-9954-4d3f-9404-7e7ee89eaace"
          },
          {
              label: "Keyboard",
              id: "0aaf914b-18b9-4ef2-8ac6-e868c29fe485"
          },
          {
              label: "Gesang",
              id: "d26a5bca-cac4-49a9-a1fb-94084bcfce80"
          },
          {
              label: "Geige",
              id: "4059c8ff-2a96-4c6f-9ca8-629adfa5219f"
          },
          {
              label: "E-Gitarre",
              id: "6a4718d0-8ee0-4954-84ef-5bb42595f9f5"
          },
          {
              label: "E-Bass",
              id: "c4ff7874-7c8f-4067-ac82-d1cbdd6d4bbe"
          }
        ].map(instrument => ({ value: instrument.id, textContent: instrument.label }))})
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
