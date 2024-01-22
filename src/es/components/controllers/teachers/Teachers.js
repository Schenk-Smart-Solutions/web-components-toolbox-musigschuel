// @ts-check
/* global fetch */
/* global AbortController */
/* global location */
/* global sessionStorage */
/* global CustomEvent */
/* global history */
/* global self */

/** @typedef {{ teacherId: number, lat: number, lon: number, title: string, text: string, imageUrl: string, link: string, instruments: string[] }} teacher */

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
      if (this.hasAttribute('mock')) return this.dispatchMock(event)
      const eventTarget = event.composedPath()[0]
      const eventValue = event.detail?.value
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
            fetch: (this._fetch || (this._fetch = fetch(endpoint,
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
              }))).then(teachers => Teachers.filter(teachers, eventTarget, eventValue))
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

  /**
   *
   *
   * @param {teachers} teachers
   * @param {HTMLElement} eventTarget
   * @param {string} value
   * @return {teachers}
   */
  static filter (teachers, eventTarget, value) {
    if (!teachers || !eventTarget || !value) return teachers
    if (eventTarget.getAttribute('render-event-name') === 'instruments') return teachers.filter(teacher => !teacher.instruments.length || teacher.instruments.includes(value))
    return teachers
  }

  dispatchMock (event) {
    const eventTarget = event.composedPath()[0]
    const eventValue = event.detail?.value
    return this.dispatchEvent(new CustomEvent(this.getAttribute('teachers') || 'teachers', {
      detail: {
        origin: (new URL('http://musigschuel-dev.schenk-smart-solutions.ch/api/teachers')).origin,
        /** @type {Promise<teachers>} */
        fetch: (this._fetch || (this._fetch = Promise.resolve([
          {
            teacherId: "ef169e1f-9638-4a1c-a6f8-2838090eff91",
            lat: 47.464275,
            lon: 9.040814,
            title: "Davide de Perota",
            text: "Klavier und Keyboard, Songwriting, Begleitung von Gesang, Programmieren von Synthesizer-Sounds und die Arbeit mit Musiksoftware<br />Klavier und Keyboard, Songwriting, Begleitung von Gesang, Programmieren von Synthesizer-Sounds und die Arbeit mit Musiksoftware",
            imageUrl: "/media/qj0fulap/teacher1.jpg?width=145&height=145&format=png&quality=80&v=1da05014c952580",
            link: "/schuluebersicht/davide-de-perota/",
            instruments: ["106b2535-65ad-4d73-9af4-d0eb069f6c50"]
          },
          {
            teacherId: "3fc8487a-2ebf-46be-9fb0-1e19d3b18c03",
            lat: 47.480576,
            lon: 9.18872,
            title: "Peter Gasser",
            text: "Jazz\nRock\nPop<br />Ich unterrichte E-Bass und Kontrabass an der Musikschule Hinterthurgau und in meiner Musikschule in Niederhelfenschwil unterrichte ich zusätzlich Gitarrenschüler.",
            imageUrl: "/media/ukvf1at2/1690352754.jpg?width=145&height=145&format=png&quality=80&v=1da05014ca77500",
            link: "/schuluebersicht/peter-gasser/",
            instruments: ["6147254d-24c1-4930-bf92-ca5ca3942e32"]
          },
          {
            teacherId: "5a3df905-3bf2-4353-acc9-4793689daebb",
            lat: 47.272167,
            lon: 8.100057,
            title: "Roland Schenk",
            text: "Jazz, Rock, Klassik<br />Fritz Frosch",
            imageUrl: "/media/emvfow0c/roland_schenk.jpg?width=145&height=145&format=png&quality=80&v=1da0cde5acedb70",
            link: "/schuluebersicht/fritz-frosch/",
            instruments: []
          },
          {
            teacherId: "fe80cd86-363d-4759-ac58-28ce9129aba8",
            lat: 47.241154,
            lon: 8.720361,
            title: "Billy Wirz",
            text: "Billy Wirz",
            imageUrl: "/media/xeady4hf/1688561251.jpg?width=145&height=145&format=png&quality=80&v=1da0cdaa0122b00",
            link: "/schuluebersicht/billy-wirz/",
            instruments: ["6147254d-24c1-4930-bf92-ca5ca3942e32", "d9b4d8fc-0a89-4ac5-96a8-bb9fd8050073"]
          },
          {
            teacherId: "620813fa-c3f9-43c3-92ff-48582c9c1178",
            lat: 47.478367,
            lon: 9.479398,
            title: "Madeleine Rascher",
            text: "Madeleine Rascher",
            imageUrl: "/media/kbgaytj2/1669882401.jpg?width=145&height=145&format=png&quality=80&v=1da0cdcccf074e0",
            link: "/schuluebersicht/madeleine-rascher/",
            instruments: ["b50a92cc-9954-4d3f-9404-7e7ee89eaace"]
          }
        ]))).then(teachers => Teachers.filter(teachers, eventTarget, eventValue))
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
