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

    this.rankedTeachers = []
    this.renderTimeoutId = null

    this.teachersEventListener = event => {
      this.renderHTML(event.detail.fetch, event.detail.origin)
    }

    this.teacherClickEventListener = event => {
      let clickedTeacher
      if (this.teachers && event.detail.marker.id && (clickedTeacher = this.teachers.find(teacher => teacher.teacherId === event.detail.marker.id))) {
        this.rankedTeachers.push(clickedTeacher)
        this.renderHTML(Promise.resolve(this.teachers), this.origin || '')
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    document.body.addEventListener('teachers', this.teachersEventListener)
    document.body.addEventListener('google-maps-teachers', this.teachersEventListener)
    document.body.addEventListener('google-maps-teacher-click', this.teacherClickEventListener)
    this.dispatchEvent(new CustomEvent(this.getAttribute('request-teachers') || 'request-teachers', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('teachers', this.teachersEventListener)
    document.body.removeEventListener('google-maps-teachers', this.teachersEventListener)
    document.body.removeEventListener('google-maps-teacher-click', this.teacherClickEventListener)
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
   * @return {Promise<void> | void}
   */
  renderHTML (fetch, origin) {
    // @ts-ignore
    clearTimeout(this.renderTimeoutId)
    this.renderTimeoutId = setTimeout(() => Promise.all([
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
        this.teachers = teachers
        this.origin = origin
        // sort teachers by rank
        if (this.rankedTeachers.length > 0) {
          this.rankedTeachers.forEach(rankedTeacher => {
            let index
            if ((index = teachers.findIndex(teacher => teacher.teacherId === rankedTeacher.teacherId)) !== -1) {
              teachers.splice(index, 1)
              teachers.unshift(rankedTeacher)
            }
          })
        }
        if (!this.hasAttribute('no-filter-teachers')) {
          const addedTeachers = []
          teachers = teachers.filter(teacher => {
            if (addedTeachers.includes(teacher.teacherId)) return false
            addedTeachers.push(teacher.teacherId)
            return true
          })
        }
        const htmlStr = /* html */`<ul>${teachers.reduce((acc, teacher) => {
          const url = new URL(`${origin}${teacher.imageUrl}`)
          const height = url.searchParams.get('height')
          const width = url.searchParams.get('width')
          // @ts-ignore
          const aspectRatio = height && !isNaN(height) && width && !isNaN(width) ? height / width : null
          return /* html */`${acc}
            <li>
              <o-wrapper href="${origin}${teacher.link}">
                <a-picture
                  picture-load
                  no-bad-quality
                  sources-keep-query-aspect-ratio
                  sources-delete-query-keys="v"
                  namespace="picture-cover-"
                  defaultSource="${origin}${teacher.imageUrl}"
                  ${teacher.imageSources ? `sources="${teacher.imageSources}"` : ''}
                  width="20%"
                  ${aspectRatio ? `aspect-ratio="${aspectRatio}"` : ''}
                ></a-picture>
                <div>
                  <h2>${teacher.title}</h2>
                  <p>${teacher.text}</p>
                  <a href="${origin}${teacher.link}">${this.getAttribute('label-more') || '...more'}</a>
                </div>
              </o-wrapper>
            </li>
          `}, '')}
        </ul>`
        if (this.lastHtmlStr === htmlStr) return
        this.lastHtmlStr = htmlStr
        this.html = ''
        this.html = htmlStr
        this.root.querySelectorAll('o-wrapper').forEach(wrapper => {
          const pictures = Array.from(wrapper.root.querySelectorAll('a-picture'))
          if (pictures.every(picture => !picture.hasAttribute('loaded'))) {
            wrapper.hidden = true
            wrapper.root.querySelectorAll('a-picture').forEach(picture => picture.addEventListener('picture-load', event => (wrapper.hidden = false), { once: true }))
          }
        })
    }), 50)
  }
}
