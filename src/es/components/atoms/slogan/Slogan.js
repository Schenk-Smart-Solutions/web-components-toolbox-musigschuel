import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Slogan extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.visibleSloganIndex = 0
    this.interval = null
    this.slogans = []
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => {
      this.hidden = false
      setTimeout(() => this.setAttribute('loaded', 'true'), 500); // workaround of all flashing up bug
      this.interval = setInterval(() => {
        this.slogans[this.visibleSloganIndex].classList.remove('visible')
        if (this.visibleSloganIndex < this.slogans.length - 1) {
          this.visibleSloganIndex++
        } else {
          this.visibleSloganIndex = 0
        }
        this.slogans[this.visibleSloganIndex].classList.add('visible')
      }, this.getAttribute('delay') || 10000)
    })
  }

  disconnectedCallback () {
    clearInterval(this.interval)
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
    return !this.sloganDiv
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        ${this.hasAttribute('width')
          ? `width: ${this.getAttribute('width')} !important;`
          : ''
        }
      }
      :host .slogan-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        width: 100%;
        padding: 1em;
        background-color: var(--color);
      }
      
      :host .slogan-container > * {
        grid-column: 1;
        grid-row: 1;
        width: 100%;
        transition: opacity 2s ease-in-out;
        display: flex;
        visibility: hidden;
        opacity: 0;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100%;
        text-transform: uppercase;
        color: var(--background-color);
      }

      :host([loaded]) .slogan-container > * {
        visibility: visible;
      }
      
      :host([loaded]) .slogan-container > *.visible {
        opacity: 1;
      }
    `
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    /** @type {import("../../prototypes/Shadow.js").fetchCSSParams[]} */
    const styles = [
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/reset.css`, // no variables for this reason no namespace
        namespace: false
      },
      {
        path: `${this.importMetaUrl}../../web-components-toolbox/src/css/style.css`, // apply namespace and fallback to allow overwriting on deeper level
        namespaceFallback: false
      }
    ]
    switch (this.getAttribute('namespace')) {
      default:
        return this.fetchCSS(styles, false)
    }
  }

  /**
   * renders the html
   *
   * @return {Promise<void>}
   */
  renderHTML () {
    this.sloganDiv = this.getSlogan()
    this.html = ''
    this.html = this.sloganDiv
    return Promise.resolve()
  }

  getSlogan () {
    const sloganContainer = document.createElement('DIV')
    sloganContainer.classList.add('slogan-container')

    Array.from(this.root.children).forEach((node, i) => {
      if (node.tagName !== 'STYLE' && node.tagName !== 'SECTION') {
        sloganContainer.appendChild(node)
        this.slogans.push(node)
      }
      if (i === 0) node.classList.add('visible')

      if (i % 2 === 0) {
        node.classList.add('inverse')
      }
    })
    return sloganContainer
  }
}
