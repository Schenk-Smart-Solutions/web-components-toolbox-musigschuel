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
      setTimeout(() => {
        this.input.checked = false
      }, 1);
      //this.setAttribute('hidden', 'true')
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
    if (this.hasAttribute('removed-child')) return this.remove()
    this.icon = '<a-icon-mdx icon-url="../../../../../../../img/pencil-plus.svg" size="2em"></a-icon-mdx>'
    this.html = this.icon
    if (this.inputAtRoot) this.inputAtRoot.remove()
    if (this.input) this.input.remove()
    const div = document.createElement('div')
    div.innerHTML = /* html */`<input
      slot="none"
      id="${this.getAttribute('id') || 'addMore'}"
      name="${this.getAttribute('name') || 'addMore'}"
      type="${this.getAttribute('type') || 'checkbox'}"
      multiply="${this.getAttribute('multiply') || 'section[name=instrumentLocations]'}"
      multiply-text-selector="${this.getAttribute('multiply-text-selector') || 'multiply-text'}"
      multiply-condition="${this.getAttribute('multiply-condition') || 'true'}"
      multiply-max="${this.getAttribute('multiply-max') || '5'}"
      counter="${this.getAttribute('counter') || '0'}"
      counter-placeholder="${this.getAttribute('counter-placeholder') || '$count$'}"
    />`
    if (!this.hasAttribute('id')) this.setAttribute('id', div.children[0].getAttribute('id'))
    if (!this.hasAttribute('name')) this.setAttribute('name', div.children[0].getAttribute('name'))
    if (!this.hasAttribute('multiply')) this.setAttribute('multiply', div.children[0].getAttribute('multiply'))
    if (!this.hasAttribute('multiply-text-selector')) this.setAttribute('multiply-text-selector', div.children[0].getAttribute('multiply-text-selector'))
    if (!this.hasAttribute('multiply-condition')) this.setAttribute('multiply-condition', div.children[0].getAttribute('multiply-condition'))
    if (!this.hasAttribute('multiply-max')) this.setAttribute('multiply-max', div.children[0].getAttribute('multiply-max'))
    if (!this.hasAttribute('counter')) this.setAttribute('counter', div.children[0].getAttribute('counter'))
    if (!this.hasAttribute('counter-placeholder')) this.setAttribute('counter-placeholder', div.children[0].getAttribute('counter-placeholder'))
    this.appendChild(div.children[0])
    if (this.hasAttribute('no-multiply')) this.input.removeAttribute('multiply')
    return this.fetchModules([
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/iconMdx/IconMdx.js`,
        name: 'a-icon-mdx'
      }
    ])
  }

  get input () {
    return this.querySelector('input')
  }

  get inputAtRoot () {
    return this.root.querySelector('input')
  }
}
