// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class SimpleFormAdd
* @type {CustomElementConstructor}
*/
export default class SimpleFormAdd extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      this.input.click()
      this.setAttribute('hidden', 'true')
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
    this.icon = '<div>(+)</div>'
    this.html = this.icon
    if (this.inputAtRoot) return this.appendChild(this.inputAtRoot)
    const div = document.createElement('div')
    div.innerHTML = /* html */`<input
      slot="1"
      id="${this.getAttribute('id') || 'addMore'}"
      name="${this.getAttribute('name') || 'addMore'}"
      type="${this.getAttribute('type') || 'checkbox'}"
      multiply="${this.getAttribute('multiply') || 'section[name=instrumentLocations]'}"
      multiply-text-selector="${this.getAttribute('multiply-text-selector') || 'multiply-text'}"
      multiply-condition="${this.getAttribute('multiply-condition') || 'true'}"
      multiply-max="${this.getAttribute('multiply-max') || '5'}"
      counter-placeholder="${this.getAttribute('counter-placeholder') || '$count$'}"
    />`
    this.appendChild(div.children[0])
  }

  get input () {
    return this.querySelector('input')
  }

  get inputAtRoot () {
    return this.root.querySelector('input')
  }
}
