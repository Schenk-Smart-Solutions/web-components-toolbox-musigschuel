// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class SimpleFormTrash
* @type {CustomElementConstructor}
*/
export default class SimpleFormTrash extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      const section = SimpleFormTrash.walksUpDomQueryMatches(this, this.getAttribute('trash'))
      const simpleForm = SimpleFormTrash.walksUpDomQueryMatches(this, 'm-simple-form')
      if (section) {
        if (simpleForm) {
          simpleForm.hide(section)
        } else {
          section.setAttribute('hidden', 'true')
        }
      }
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    this.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
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
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldRenderHTML () {
    return !this.icon
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host {}
      @media only screen and (max-width: _max-width_) {
        :host {}
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
      case 'simple-form-trash-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }, ...styles])
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  renderHTML () {
    this.html = (this.icon = '<a-icon-mdx icon-url="../../../../../../../img/trash.svg" size="2em"></a-icon-mdx>')
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  /**
   * matches html element by selector
   * ends and returns root when stepped up all the way but nothing found
   *
   * @param {HTMLElement | any} el
   * @param {string} selector
   * @param {HTMLElement} [root=document.documentElement]
   * @return {any}
   */
  static walksUpDomQueryMatches (el, selector, root = document.documentElement) {
    if (el.matches(selector)) return el
    while ((el = el.parentNode || el.host || root) && el !== root) { // eslint-disable-line
      if (typeof el.matches === 'function' && el.matches(selector)) return el
    }
    return el
  }
}
