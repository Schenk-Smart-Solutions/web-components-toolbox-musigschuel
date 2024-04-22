// @ts-check
/* global fetch */
/* global AbortController */
/* global location */
/* global sessionStorage */
/* global CustomEvent */
/* global history */
/* global self */

/** @typedef {{ teacherId: number, lat?: number, lon?: number, title: string, text: string, imageUrl: string, link: string, street?: string, zipCode?:number, city?:string, instruments: string[], imageSources: string }} teacher */

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
              "teacherId": "0a830605-7815-44e9-9829-32651944aa21",
              "lat": 0,
              "lon": 0,
              "title": "Peter Gasser",
              "text": "<strong>Privatunterricht</strong>\r\nNiederhelfenschwil\r\n<br />\r\nE-Bass, Kontrabass\r\n<br />\r\n<br />",
              "imageUrl": "/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=1450&height=1450&format=webp&quality=80&v=1da9303078fcae0",
              "link": "/schuluebersicht/peter-gasser/",
              "street": "Neudorfgass 6",
              "zipCode": "9527",
              "city": "Niederhelfenschwil",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=652&height=652&format=webp&quality=80&v=1da9303078fcae0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=971&height=971&format=webp&quality=80&v=1da9303078fcae0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=1943&height=1943&format=webp&quality=80&v=1da9303078fcae0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=3625&height=3625&format=webp&quality=80&v=1da9303078fcae0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1f51051d-365b-48b3-a09e-7a469b5f313f",
                  "9cf284bf-8be8-4a5a-90a9-bdaeb2035d43"
              ]
          },
          {
              "teacherId": "0a830605-7815-44e9-9829-32651944aa21",
              "lat": 0,
              "lon": 0,
              "title": "Peter Gasser",
              "text": "<strong>Musikschule Hinterthurgau</strong>\r\nEschlikon\r\n<br />\r\nE-Bass, Kontrabass\r\n<br />\r\n<br />",
              "imageUrl": "/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=1450&height=1450&format=webp&quality=80&v=1da9303078fcae0",
              "link": "/schuluebersicht/peter-gasser/",
              "street": "Blumenaustrasse 8",
              "zipCode": "8360",
              "city": "Eschlikon",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=652&height=652&format=webp&quality=80&v=1da9303078fcae0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=971&height=971&format=webp&quality=80&v=1da9303078fcae0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=1943&height=1943&format=webp&quality=80&v=1da9303078fcae0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/wwzfg4ji/img_1853.jpg?rxy=0.5112781954887218,0.19231954206648028&width=3625&height=3625&format=webp&quality=80&v=1da9303078fcae0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1f51051d-365b-48b3-a09e-7a469b5f313f",
                  "9cf284bf-8be8-4a5a-90a9-bdaeb2035d43"
              ]
          },
          {
              "teacherId": "d767b659-ec3b-43ec-a930-4e0828331d11",
              "lat": 0,
              "lon": 0,
              "title": "Davide De Perota",
              "text": "<strong>Privatunterricht</strong>\r\nRickenbach\r\n<br />\r\nKlavier, Schlagzeug\r\n<br />\r\n<br />",
              "imageUrl": "/media/mo1pq20c/davide_de_perota.jpg?width=1450&height=1450&format=webp&quality=80&v=1da71f380793670",
              "link": "/schuluebersicht/davide-de-perota/",
              "street": "Toggenburgerstrasse 4",
              "zipCode": "9532",
              "city": "Rickenbach",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mo1pq20c/davide_de_perota.jpg?width=652&height=652&format=webp&quality=80&v=1da71f380793670','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mo1pq20c/davide_de_perota.jpg?width=971&height=971&format=webp&quality=80&v=1da71f380793670','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mo1pq20c/davide_de_perota.jpg?width=1943&height=1943&format=webp&quality=80&v=1da71f380793670','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mo1pq20c/davide_de_perota.jpg?width=3625&height=3625&format=webp&quality=80&v=1da71f380793670','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "4dc8975d-ff82-4633-a9c9-cf494c36a746",
                  "15f388b2-d526-44c8-8c15-e2c4de644221"
              ]
          },
          {
              "teacherId": "216ab4a0-ab3d-4b67-b350-da403a1f2e4b",
              "lat": 0,
              "lon": 0,
              "title": "Eric Fürst",
              "text": "<strong>Privatunterricht</strong>\r\nRickenbach\r\n<br />\r\nE-Gitarre, Gitarre\r\n<br />\r\n<br />",
              "imageUrl": "/media/whwh4buq/eric_fuerst.jpg?width=1450&height=1450&format=webp&quality=80&v=1da74c72eec4140",
              "link": "/schuluebersicht/eric-fuerst/",
              "street": "Toggenburgerstr.4 ",
              "zipCode": "9532",
              "city": "Rickenbach",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/whwh4buq/eric_fuerst.jpg?width=652&height=652&format=webp&quality=80&v=1da74c72eec4140','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/whwh4buq/eric_fuerst.jpg?width=971&height=971&format=webp&quality=80&v=1da74c72eec4140','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/whwh4buq/eric_fuerst.jpg?width=1943&height=1943&format=webp&quality=80&v=1da74c72eec4140','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/whwh4buq/eric_fuerst.jpg?width=3625&height=3625&format=webp&quality=80&v=1da74c72eec4140','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b"
              ]
          },
          {
              "teacherId": "216ab4a0-ab3d-4b67-b350-da403a1f2e4b",
              "lat": 0,
              "lon": 0,
              "title": "Eric Fürst",
              "text": "<strong>Privatunterricht</strong>\r\nLaupen\r\n<br />\r\nE-Gitarre, Gitarre\r\n<br />\r\n<br />",
              "imageUrl": "/media/whwh4buq/eric_fuerst.jpg?width=1450&height=1450&format=webp&quality=80&v=1da74c72eec4140",
              "link": "/schuluebersicht/eric-fuerst/",
              "street": "Brüelstrasse 14",
              "zipCode": "8637",
              "city": "Laupen",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/whwh4buq/eric_fuerst.jpg?width=652&height=652&format=webp&quality=80&v=1da74c72eec4140','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/whwh4buq/eric_fuerst.jpg?width=971&height=971&format=webp&quality=80&v=1da74c72eec4140','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/whwh4buq/eric_fuerst.jpg?width=1943&height=1943&format=webp&quality=80&v=1da74c72eec4140','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/whwh4buq/eric_fuerst.jpg?width=3625&height=3625&format=webp&quality=80&v=1da74c72eec4140','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b"
              ]
          },
          {
              "teacherId": "23def285-a55c-460b-9a64-7fa4ca5e5fe0",
              "lat": 0,
              "lon": 0,
              "title": "Christian Blaser",
              "text": "<strong>Privatunterricht</strong>\r\nWinterthur\r\n<br />\r\nE-Gitarre, Gitarre, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/l2ibphso/christian_blaser.jpg?width=1450&height=1450&format=webp&quality=80&v=1da714af6f08f50",
              "link": "/schuluebersicht/christian-blaser/",
              "street": "Stadthausstrasse 137",
              "zipCode": "8400",
              "city": "Winterthur",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=652&height=652&format=webp&quality=80&v=1da714af6f08f50','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=971&height=971&format=webp&quality=80&v=1da714af6f08f50','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=1943&height=1943&format=webp&quality=80&v=1da714af6f08f50','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=3625&height=3625&format=webp&quality=80&v=1da714af6f08f50','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "23def285-a55c-460b-9a64-7fa4ca5e5fe0",
              "lat": 0,
              "lon": 0,
              "title": "Christian Blaser",
              "text": "<strong>Musikschule Hinterthurgau</strong>\r\nMünchwilen\r\n<br />\r\nE-Gitarre, Gitarre, Bandcoaching, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/l2ibphso/christian_blaser.jpg?width=1450&height=1450&format=webp&quality=80&v=1da714af6f08f50",
              "link": "/schuluebersicht/christian-blaser/",
              "street": "Weinfelderstrasse 21",
              "zipCode": "9542",
              "city": "Münchwilen",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=652&height=652&format=webp&quality=80&v=1da714af6f08f50','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=971&height=971&format=webp&quality=80&v=1da714af6f08f50','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=1943&height=1943&format=webp&quality=80&v=1da714af6f08f50','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=3625&height=3625&format=webp&quality=80&v=1da714af6f08f50','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "7c992e61-c403-4d56-ac43-4366d63829e2",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "23def285-a55c-460b-9a64-7fa4ca5e5fe0",
              "lat": 0,
              "lon": 0,
              "title": "Christian Blaser",
              "text": "<strong>Musikschule Hinterthurgau</strong>\r\nWängi\r\n<br />\r\nE-Gitarre, Gitarre, Bandcoaching, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/l2ibphso/christian_blaser.jpg?width=1450&height=1450&format=webp&quality=80&v=1da714af6f08f50",
              "link": "/schuluebersicht/christian-blaser/",
              "street": "Dorfstrass 22",
              "zipCode": "9545",
              "city": "Wängi",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=652&height=652&format=webp&quality=80&v=1da714af6f08f50','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=971&height=971&format=webp&quality=80&v=1da714af6f08f50','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=1943&height=1943&format=webp&quality=80&v=1da714af6f08f50','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=3625&height=3625&format=webp&quality=80&v=1da714af6f08f50','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "7c992e61-c403-4d56-ac43-4366d63829e2",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "23def285-a55c-460b-9a64-7fa4ca5e5fe0",
              "lat": 0,
              "lon": 0,
              "title": "Christian Blaser",
              "text": "<strong>Musikschule Hinterthurgau</strong>\r\nEschlikon\r\n<br />\r\nE-Gitarre, Gitarre, Bandcoaching, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/l2ibphso/christian_blaser.jpg?width=1450&height=1450&format=webp&quality=80&v=1da714af6f08f50",
              "link": "/schuluebersicht/christian-blaser/",
              "street": "Blumenaustrasse 7",
              "zipCode": "8360",
              "city": "Eschlikon",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=652&height=652&format=webp&quality=80&v=1da714af6f08f50','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=971&height=971&format=webp&quality=80&v=1da714af6f08f50','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=1943&height=1943&format=webp&quality=80&v=1da714af6f08f50','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=3625&height=3625&format=webp&quality=80&v=1da714af6f08f50','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "7c992e61-c403-4d56-ac43-4366d63829e2",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "23def285-a55c-460b-9a64-7fa4ca5e5fe0",
              "lat": 0,
              "lon": 0,
              "title": "Christian Blaser",
              "text": "<strong>Musikschule Hinterthurgau</strong>\r\nWilen\r\n<br />\r\nE-Gitarre, Gitarre, Bandcoaching, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/l2ibphso/christian_blaser.jpg?width=1450&height=1450&format=webp&quality=80&v=1da714af6f08f50",
              "link": "/schuluebersicht/christian-blaser/",
              "street": "Schulstrasse 7",
              "zipCode": "9535",
              "city": "Wilen",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=652&height=652&format=webp&quality=80&v=1da714af6f08f50','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=971&height=971&format=webp&quality=80&v=1da714af6f08f50','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=1943&height=1943&format=webp&quality=80&v=1da714af6f08f50','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/l2ibphso/christian_blaser.jpg?width=3625&height=3625&format=webp&quality=80&v=1da714af6f08f50','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "7c992e61-c403-4d56-ac43-4366d63829e2",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "aa07a726-81d8-438d-9f73-13908d9c27cc",
              "lat": 0,
              "lon": 0,
              "title": "Karin Wolfensberger",
              "text": "<strong>Privatunterricht</strong>\r\nGähwil\r\n<br />\r\nKeyboard, Klavier\r\n<br />\r\n<br />",
              "imageUrl": "/media/tp5avxga/karin_wolfensberger.jpg?width=1450&height=1450&format=webp&quality=80&v=1da71874aa0d970",
              "link": "/schuluebersicht/karin-wolfensberger/",
              "street": "Neuhus 1953",
              "zipCode": "9534",
              "city": "Gähwil",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/tp5avxga/karin_wolfensberger.jpg?width=652&height=652&format=webp&quality=80&v=1da71874aa0d970','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/tp5avxga/karin_wolfensberger.jpg?width=971&height=971&format=webp&quality=80&v=1da71874aa0d970','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/tp5avxga/karin_wolfensberger.jpg?width=1943&height=1943&format=webp&quality=80&v=1da71874aa0d970','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/tp5avxga/karin_wolfensberger.jpg?width=3625&height=3625&format=webp&quality=80&v=1da71874aa0d970','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "eaa746b0-d68a-4576-948b-eda970db60a5",
                  "4dc8975d-ff82-4633-a9c9-cf494c36a746"
              ]
          },
          {
              "teacherId": "a192f180-61e9-48f4-87b5-d9657294bcfb",
              "lat": 0,
              "lon": 0,
              "title": "Madeleine Rascher",
              "text": "<strong>Privatunterricht</strong>\r\nRorschach\r\n<br />\r\nGesang, Klavier\r\n<br />\r\n<br />",
              "imageUrl": "/media/gfremkja/madeleine_rascher.jpg?width=1450&height=1450&format=webp&quality=80&v=1da7467f2dd64e0",
              "link": "/schuluebersicht/madeleine-rascher/",
              "street": "Promenadenstrasse 21",
              "zipCode": "9400",
              "city": "Rorschach",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/gfremkja/madeleine_rascher.jpg?width=652&height=652&format=webp&quality=80&v=1da7467f2dd64e0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/gfremkja/madeleine_rascher.jpg?width=971&height=971&format=webp&quality=80&v=1da7467f2dd64e0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/gfremkja/madeleine_rascher.jpg?width=1943&height=1943&format=webp&quality=80&v=1da7467f2dd64e0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/gfremkja/madeleine_rascher.jpg?width=3625&height=3625&format=webp&quality=80&v=1da7467f2dd64e0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1a3f7dfc-ca0c-43e3-96e6-e084927e718f",
                  "4dc8975d-ff82-4633-a9c9-cf494c36a746"
              ]
          },
          {
              "teacherId": "f76c80aa-6887-4bb6-907c-193b629e4439",
              "lat": 0,
              "lon": 0,
              "title": "Fabian Sonderegger",
              "text": "<strong>Privatunterricht</strong>\r\nHeiden\r\n<br />\r\nE-Gitarre\r\n<br />\r\n<br />",
              "imageUrl": "/media/jisfnjzb/fabian_sonderegger.jpg?width=1450&height=1450&format=webp&quality=80&v=1da765299ddd9a0",
              "link": "/schuluebersicht/fabian-sonderegger/",
              "street": "Sägewiesstrasse 17",
              "zipCode": "9410",
              "city": "Heiden",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/jisfnjzb/fabian_sonderegger.jpg?width=652&height=652&format=webp&quality=80&v=1da765299ddd9a0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/jisfnjzb/fabian_sonderegger.jpg?width=971&height=971&format=webp&quality=80&v=1da765299ddd9a0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/jisfnjzb/fabian_sonderegger.jpg?width=1943&height=1943&format=webp&quality=80&v=1da765299ddd9a0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/jisfnjzb/fabian_sonderegger.jpg?width=3625&height=3625&format=webp&quality=80&v=1da765299ddd9a0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8"
              ]
          },
          {
              "teacherId": "2e4349d7-6d91-4f3e-8233-725997e4ec60",
              "lat": 0,
              "lon": 0,
              "title": "Peter  Haas ",
              "text": "<strong>Privatunterricht</strong>\r\nWinterthur\r\n<br />\r\nSchlagzeug\r\n<br />\r\n<br />",
              "imageUrl": "/media/uiwkxv3r/peter_haas.jpg?width=1450&height=1450&format=webp&quality=80&v=1da77a59126cfc0",
              "link": "/schuluebersicht/peter-haas/",
              "street": "Schaffhauserstrasse 42",
              "zipCode": "8400",
              "city": "Winterthur",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/uiwkxv3r/peter_haas.jpg?width=652&height=652&format=webp&quality=80&v=1da77a59126cfc0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/uiwkxv3r/peter_haas.jpg?width=971&height=971&format=webp&quality=80&v=1da77a59126cfc0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/uiwkxv3r/peter_haas.jpg?width=1943&height=1943&format=webp&quality=80&v=1da77a59126cfc0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/uiwkxv3r/peter_haas.jpg?width=3625&height=3625&format=webp&quality=80&v=1da77a59126cfc0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "15f388b2-d526-44c8-8c15-e2c4de644221"
              ]
          },
          {
              "teacherId": "46d1f45d-e0fa-4976-a095-fd178c384921",
              "lat": 0,
              "lon": 0,
              "title": "Rolf Egger",
              "text": "<strong>Privatunterricht</strong>\r\nRickenbach bei Wil \r\n<br />\r\nAkkordeon, Keyboard, Klavier, Orgel, Saxophon, Schwyzerörgeli\r\n<br />\r\n<br />",
              "imageUrl": "/media/bznolwff/rolf_egger.jpg?width=1450&height=1450&format=webp&quality=80&v=1da77127e5b24b0",
              "link": "/schuluebersicht/rolf-egger/",
              "street": "Toggenburgerstrasse 4",
              "zipCode": "9532",
              "city": "Rickenbach bei Wil ",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/bznolwff/rolf_egger.jpg?width=652&height=652&format=webp&quality=80&v=1da77127e5b24b0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/bznolwff/rolf_egger.jpg?width=971&height=971&format=webp&quality=80&v=1da77127e5b24b0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/bznolwff/rolf_egger.jpg?width=1943&height=1943&format=webp&quality=80&v=1da77127e5b24b0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/bznolwff/rolf_egger.jpg?width=3625&height=3625&format=webp&quality=80&v=1da77127e5b24b0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "9040c08d-a23b-4f85-99ae-e88922de5ed6",
                  "eaa746b0-d68a-4576-948b-eda970db60a5",
                  "4dc8975d-ff82-4633-a9c9-cf494c36a746",
                  "ee4d4e2f-e321-45fa-b885-e7bc12714491",
                  "11137004-64e1-4fc8-92bb-c1b7df0a0de2",
                  "ea30b351-ae63-415a-b88d-b631f6191486"
              ]
          },
          {
              "teacherId": "2cebc648-fec9-414c-a267-01f6100a0294",
              "lat": 0,
              "lon": 0,
              "title": "Anna Indelicato",
              "text": "<strong>Privatunterricht</strong>\r\nWidnau\r\n<br />\r\nGesang\r\n<br />\r\n<br />",
              "imageUrl": "/media/vclcb0kv/avatar-1577909_640.png?format=webp&quality=80&v=1da6f3bc388d890",
              "link": "/schuluebersicht/anna-indelicato/",
              "street": "Nöllenstrasse",
              "zipCode": "9443",
              "city": "Widnau",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/vclcb0kv/avatar-1577909_640.png?format=webp&quality=80&v=1da6f3bc388d890','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/vclcb0kv/avatar-1577909_640.png?format=webp&quality=80&v=1da6f3bc388d890','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/vclcb0kv/avatar-1577909_640.png?format=webp&quality=80&v=1da6f3bc388d890','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/vclcb0kv/avatar-1577909_640.png?format=webp&quality=80&v=1da6f3bc388d890','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1a3f7dfc-ca0c-43e3-96e6-e084927e718f"
              ]
          },
          {
              "teacherId": "307ce8c8-0cbe-4774-a38f-98bc54dbb679",
              "lat": 0,
              "lon": 0,
              "title": "Benjamin Kissola Gonçalves",
              "text": "<strong>Privatunterricht</strong>\r\nWinterthur\r\n<br />\r\nE-Bass, E-Gitarre, Gitarre, Gitalele, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/nlbpabpf/benjamin_kissola_gonçalves.jpg?width=1450&height=1450&format=webp&quality=80&v=1da8a861f1e9680",
              "link": "/schuluebersicht/benjamin-kissola-goncalves/",
              "street": "Wülflingenstrasse 118",
              "zipCode": "8408",
              "city": "Winterthur",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/nlbpabpf/benjamin_kissola_gonçalves.jpg?width=652&height=652&format=webp&quality=80&v=1da8a861f1e9680','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/nlbpabpf/benjamin_kissola_gonçalves.jpg?width=971&height=971&format=webp&quality=80&v=1da8a861f1e9680','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/nlbpabpf/benjamin_kissola_gonçalves.jpg?width=1943&height=1943&format=webp&quality=80&v=1da8a861f1e9680','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/nlbpabpf/benjamin_kissola_gonçalves.jpg?width=3625&height=3625&format=webp&quality=80&v=1da8a861f1e9680','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1f51051d-365b-48b3-a09e-7a469b5f313f",
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "d2d88d66-c8fa-4d9e-9bb7-0534aa38dce5",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "b8d48862-4d30-4e89-8e21-d71bfa7cb90d",
              "lat": 0,
              "lon": 0,
              "title": "Patrick Vido",
              "text": "<strong>Privatunterricht</strong>\r\nBern\r\n<br />\r\nE-Bass, E-Gitarre, Gitarre, Bandcoaching, Gitalele, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/mk4ijdc0/patrick_vido.jpg?width=1450&height=1450&format=webp&quality=80&v=1da8aa7cb588ac0",
              "link": "/schuluebersicht/patrick-vido/",
              "street": "Rathausgasse 47",
              "zipCode": "3011",
              "city": "Bern",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=652&height=652&format=webp&quality=80&v=1da8aa7cb588ac0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=971&height=971&format=webp&quality=80&v=1da8aa7cb588ac0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=1943&height=1943&format=webp&quality=80&v=1da8aa7cb588ac0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=3625&height=3625&format=webp&quality=80&v=1da8aa7cb588ac0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1f51051d-365b-48b3-a09e-7a469b5f313f",
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "7c992e61-c403-4d56-ac43-4366d63829e2",
                  "d2d88d66-c8fa-4d9e-9bb7-0534aa38dce5",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "b8d48862-4d30-4e89-8e21-d71bfa7cb90d",
              "lat": 0,
              "lon": 0,
              "title": "Patrick Vido",
              "text": "<strong>School Of Rock</strong>\r\nMünchenstein\r\n<br />\r\nE-Bass, E-Gitarre, Gitarre, Gitalele, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/mk4ijdc0/patrick_vido.jpg?width=1450&height=1450&format=webp&quality=80&v=1da8aa7cb588ac0",
              "link": "/schuluebersicht/patrick-vido/",
              "street": "Helsinki-Strasse 7",
              "zipCode": "4142",
              "city": "Münchenstein",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=652&height=652&format=webp&quality=80&v=1da8aa7cb588ac0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=971&height=971&format=webp&quality=80&v=1da8aa7cb588ac0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=1943&height=1943&format=webp&quality=80&v=1da8aa7cb588ac0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=3625&height=3625&format=webp&quality=80&v=1da8aa7cb588ac0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1f51051d-365b-48b3-a09e-7a469b5f313f",
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "d2d88d66-c8fa-4d9e-9bb7-0534aa38dce5",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "b8d48862-4d30-4e89-8e21-d71bfa7cb90d",
              "lat": 0,
              "lon": 0,
              "title": "Patrick Vido",
              "text": "<strong>Privatunterricht</strong>\r\nSteffisburg\r\n<br />\r\nE-Bass, E-Gitarre, Gitarre, Gitalele, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/mk4ijdc0/patrick_vido.jpg?width=1450&height=1450&format=webp&quality=80&v=1da8aa7cb588ac0",
              "link": "/schuluebersicht/patrick-vido/",
              "street": "Schulgässli 20",
              "zipCode": "3612",
              "city": "Steffisburg",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=652&height=652&format=webp&quality=80&v=1da8aa7cb588ac0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=971&height=971&format=webp&quality=80&v=1da8aa7cb588ac0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=1943&height=1943&format=webp&quality=80&v=1da8aa7cb588ac0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/mk4ijdc0/patrick_vido.jpg?width=3625&height=3625&format=webp&quality=80&v=1da8aa7cb588ac0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1f51051d-365b-48b3-a09e-7a469b5f313f",
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "d2d88d66-c8fa-4d9e-9bb7-0534aa38dce5",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "fd720ee4-7c33-4238-a7fb-e41d02220a68",
              "lat": 0,
              "lon": 0,
              "title": "Duncan Hogg",
              "text": "<strong>Privatunterricht</strong>\r\nMeilen\r\n<br />\r\nE-Gitarre, Gitarre\r\n<br />\r\n<br />",
              "imageUrl": "/media/zyvoajtk/duncan_hogg.jpg?rxy=0.470375,0.181325&width=1450&height=1450&format=webp&quality=80&v=1da930378c4cf80",
              "link": "/schuluebersicht/duncan-hogg/",
              "street": "Bünishoferstrasse 174",
              "zipCode": "8706",
              "city": "Meilen",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/zyvoajtk/duncan_hogg.jpg?rxy=0.470375,0.181325&width=652&height=652&format=webp&quality=80&v=1da930378c4cf80','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/zyvoajtk/duncan_hogg.jpg?rxy=0.470375,0.181325&width=971&height=971&format=webp&quality=80&v=1da930378c4cf80','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/zyvoajtk/duncan_hogg.jpg?rxy=0.470375,0.181325&width=1943&height=1943&format=webp&quality=80&v=1da930378c4cf80','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/zyvoajtk/duncan_hogg.jpg?rxy=0.470375,0.181325&width=3625&height=3625&format=webp&quality=80&v=1da930378c4cf80','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b"
              ]
          },
          {
              "teacherId": "22b8dfcf-1fa2-431b-b917-285e997fbcf7",
              "lat": 0,
              "lon": 0,
              "title": "Josias Ming",
              "text": "<strong>Privatunterricht</strong>\r\nSursee\r\n<br />\r\nE-Bass, E-Gitarre, Gitarre\r\n<br />\r\n<br />",
              "imageUrl": "/media/g5efhsmn/josias_ming.jpg?width=1450&height=1450&format=webp&quality=80&v=1da8aa6a19435a0",
              "link": "/schuluebersicht/josias-ming/",
              "street": "Wassergrabe 4",
              "zipCode": "6210",
              "city": "Sursee",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/g5efhsmn/josias_ming.jpg?width=652&height=652&format=webp&quality=80&v=1da8aa6a19435a0','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/g5efhsmn/josias_ming.jpg?width=971&height=971&format=webp&quality=80&v=1da8aa6a19435a0','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/g5efhsmn/josias_ming.jpg?width=1943&height=1943&format=webp&quality=80&v=1da8aa6a19435a0','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/g5efhsmn/josias_ming.jpg?width=3625&height=3625&format=webp&quality=80&v=1da8aa6a19435a0','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "1f51051d-365b-48b3-a09e-7a469b5f313f",
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b"
              ]
          },
          {
              "teacherId": "f2250be6-caee-4a84-8d64-253f80e00d5c",
              "lat": 0,
              "lon": 0,
              "title": "Julian Lehmann",
              "text": "<strong>Privatunterricht</strong>\r\nSumiswald\r\n<br />\r\nE-Gitarre, Gitarre, Ukulele\r\n<br />\r\n<br />",
              "imageUrl": "/media/cvla5py5/julian_lehmann.jpg?width=1450&height=1450&format=webp&quality=80&v=1da8f5afdce3830",
              "link": "/schuluebersicht/julian-lehmann/",
              "street": "Hofackerstrasse 8",
              "zipCode": "3454",
              "city": "Sumiswald",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/cvla5py5/julian_lehmann.jpg?width=652&height=652&format=webp&quality=80&v=1da8f5afdce3830','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/cvla5py5/julian_lehmann.jpg?width=971&height=971&format=webp&quality=80&v=1da8f5afdce3830','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/cvla5py5/julian_lehmann.jpg?width=1943&height=1943&format=webp&quality=80&v=1da8f5afdce3830','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/cvla5py5/julian_lehmann.jpg?width=3625&height=3625&format=webp&quality=80&v=1da8f5afdce3830','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "2cdde3f2-a6d1-42b1-90d5-989c39e129d8",
                  "78110a53-a6bf-49cf-b0b0-5f3e3556a41b",
                  "5ef8f942-142c-4643-aa54-9787d74b70c8"
              ]
          },
          {
              "teacherId": "f962648c-02bb-4d32-adb0-8ccf29301c57",
              "lat": 0,
              "lon": 0,
              "title": "Dominik Schwarz",
              "text": "<strong>Privatunterricht</strong>\r\nTägerwilen\r\n<br />\r\nSchlagzeug\r\n<br />\r\n<br />",
              "imageUrl": "/media/4iybsan3/dominik_schwarz.jpg?width=1450&height=1450&format=webp&quality=80&v=1da90f88e946530",
              "link": "/schuluebersicht/dominik-schwarz/",
              "street": "Hauptstrasse 137",
              "zipCode": "8274",
              "city": "Tägerwilen",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/4iybsan3/dominik_schwarz.jpg?width=652&height=652&format=webp&quality=80&v=1da90f88e946530','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/4iybsan3/dominik_schwarz.jpg?width=971&height=971&format=webp&quality=80&v=1da90f88e946530','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/4iybsan3/dominik_schwarz.jpg?width=1943&height=1943&format=webp&quality=80&v=1da90f88e946530','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/4iybsan3/dominik_schwarz.jpg?width=3625&height=3625&format=webp&quality=80&v=1da90f88e946530','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "15f388b2-d526-44c8-8c15-e2c4de644221"
              ]
          },
          {
              "teacherId": "629177b9-4a32-4101-a2ed-7d5877aeba3c",
              "lat": 0,
              "lon": 0,
              "title": "Vsevolod  Antonov ",
              "text": "<strong>Privatunterricht</strong>\r\nWallisellen \r\n<br />\r\nKlavier\r\n<br />\r\n<br />",
              "imageUrl": "/media/2m4hlo1k/vsevolod__antonov_.jpg?width=1450&height=1450&format=webp&quality=80&v=1da910a93269250",
              "link": "/schuluebersicht/vsevolod-antonov/",
              "street": "Bützackerstrasse 12",
              "zipCode": "8304",
              "city": "Wallisellen ",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/2m4hlo1k/vsevolod__antonov_.jpg?width=652&height=652&format=webp&quality=80&v=1da910a93269250','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/2m4hlo1k/vsevolod__antonov_.jpg?width=971&height=971&format=webp&quality=80&v=1da910a93269250','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/2m4hlo1k/vsevolod__antonov_.jpg?width=1943&height=1943&format=webp&quality=80&v=1da910a93269250','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/2m4hlo1k/vsevolod__antonov_.jpg?width=3625&height=3625&format=webp&quality=80&v=1da910a93269250','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "4dc8975d-ff82-4633-a9c9-cf494c36a746"
              ]
          },
          {
              "teacherId": "88acad00-26b6-496d-a465-b0c348bcc55b",
              "lat": 0,
              "lon": 0,
              "title": "Simon Steiner",
              "text": "<strong>Privatunterricht</strong>\r\nStansstad\r\n<br />\r\nPerkussion, Schlagzeug\r\n<br />\r\n<br />",
              "imageUrl": "/media/i0jmv3wh/simon_steiner.jpg?width=1450&height=1450&format=webp&quality=80&v=1da9444ce985e30",
              "link": "/schuluebersicht/simon-steiner/",
              "street": "Dorfstrasse 7",
              "zipCode": "6362",
              "city": "Stansstad",
              "imageSources": "[{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/i0jmv3wh/simon_steiner.jpg?width=652&height=652&format=webp&quality=80&v=1da9444ce985e30','size':'small','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/i0jmv3wh/simon_steiner.jpg?width=971&height=971&format=webp&quality=80&v=1da9444ce985e30','size':'medium','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/i0jmv3wh/simon_steiner.jpg?width=1943&height=1943&format=webp&quality=80&v=1da9444ce985e30','size':'large','type':'image/webp'},{'src':'http://musigschuel-dev.schenk-smart-solutions.ch/media/i0jmv3wh/simon_steiner.jpg?width=3625&height=3625&format=webp&quality=80&v=1da9444ce985e30','size':'extra-large','type':'image/webp'}]",
              "instruments": [
                  "90f9fa99-c692-4568-8fd9-cf750cfda8f6",
                  "15f388b2-d526-44c8-8c15-e2c4de644221"
              ]
          }
        ]))).then(teachers => Teachers.filter(teachers, eventTarget, eventValue))
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }
}
