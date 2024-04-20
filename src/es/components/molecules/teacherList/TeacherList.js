// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class TeacherList
* @type {CustomElementConstructor}
*/
export default class TeacherList extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.teachersEventListener = event => {
      this.renderHTML(event.detail.fetch, event.detail.origin)
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('teachers', this.teachersEventListener)
  document.body.addEventListener('google-maps-teachers', this.teachersEventListener)
    this.dispatchEvent(new CustomEvent(this.getAttribute('request-teachers') || 'request-teachers', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('teachers', this.teachersEventListener)
    document.body.removeEventListener('google-maps-teachers', this.teachersEventListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host ul {
        --align-items: start;
        --ul-list-style: none;
        --ul-padding: 0;
        --ul-margin: 0;
        --ul-margin-mobile: 0;
        --ul-padding-left: 0;
      }
      :host ul li {
        margin-bottom: calc(var(--content-spacing) * 2);
      }
      :host ul li:last-child {
        margin-bottom: 0;
      }
      @media only screen and (max-width: _max-width_) {
        :host ul li {
          margin-bottom: calc(var(--content-spacing-mobile) * 2);
        }
        :host ul li:last-child {
          margin-bottom: 0;
        }
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   */
  fetchTemplate () {
    /** @type {import("../../web-components-toolbox/src/es/components/prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: true
      }
    ]
    switch (this.getAttribute('namespace')) {
      case 'teacher-list-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * renders the html
   *
   * @param {Promise<import("../../controllers/teachers/Teachers.js").teachers>} fetch
   * @param {string} origin
   * @return {Promise<void>}
   */
  renderHTML (fetch, origin) {
    return Promise.all([
      fetch,
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/picture/Picture.js`,
          name: 'a-picture'
        },
        {
          path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/organisms/wrapper/Wrapper.js`,
          name: 'o-wrapper'
        }
      ])
    ]).then(([teachers]) => {
      if (!this.hasAttribute('no-filter-teachers')) {
        const addedTeachers = []
        teachers = teachers.filter(teacher => {
          if (addedTeachers.includes(teacher.teacherId)) return false
          addedTeachers.push(teacher.teacherId)
          return true
        })
      }
      const htmlStr = /* html */`<ul>${teachers.reduce((acc, teacher) => /* html */`${acc}
          <li>
            <o-wrapper href="${origin}${teacher.link}">
              <a-picture
                picture-load
                no-bad-quality
                sources-keep-query-aspect-ratio
                sources-delete-query-keys="v"
                namespace="picture-cover-"
                defaultSource="${origin}${teacher.imageUrl}"
                width="20%"
              ></a-picture>
              <div>
                <h2>${teacher.title}</h2>
                <p>${teacher.text}</p>
                <a href="${origin}${teacher.link}">${this.getAttribute('label-more') || '...more'}</a>
              </div>
            </o-wrapper>
          </li>
        `, '')}
      </ul>`
      if (this.lastHtmlStr === htmlStr) return
      this.lastHtmlStr = htmlStr
      this.hidden = true
      this.html = ''
      this.html = htmlStr
      let counter = 0
      this.root.querySelectorAll('o-wrapper').forEach(wrapper => wrapper.root.querySelectorAll('a-picture').forEach(picture => picture.addEventListener('picture-load', event => {
        counter++
        if (counter === teachers.length) this.hidden = false
      }, { once: true })))
    })
  }
}
