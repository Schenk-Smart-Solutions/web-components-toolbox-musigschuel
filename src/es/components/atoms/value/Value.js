import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class Value extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)
  }

  connectedCallback() {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
  }

  disconnectedCallback() {

  }

  shouldComponentRenderHTML() {
    return !this.root.querySelector('div')
  }

  shouldComponentRenderCSS() {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  renderCSS() {
    this.css = `
            :host {
                --a-margin: 0;
                display: block;
                margin-bottom: 1rem;
                width: 100%;
            }
            
            .label {
                font-size: 1.25rem;
                font-weight: 400;
            }
            

            .line {
                height: 1px;
                background-color: var(--color, #000000);
            }

            .value {
                margin-top: 0.25rem;
                display: flex;
                justify-content: flex-end;
                text-align: right;
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

  renderHTML() {
    this.container = document.createElement('DIV')
    this.label = document.createElement('LABEL')
    this.label.className = 'label'
    this.label.innerText = this.getAttribute('label')
    this.container.appendChild(this.label)
    this.line = document.createElement('DIV')
    this.line.className = 'line'
    this.container.appendChild(this.line)
    this.value = this.getAttribute('asAddress') ? document.createElement('ADDRESS') : document.createElement('DIV')
    this.value.className = 'value'
    if (this.getAttribute('as-email')) {
      this.link = document.createElement('A')
      this.link.setAttribute('href', `mailto:${this.getAttribute('value')}`)
      this.link.innerText = this.getAttribute('value')
      this.value.appendChild(this.link);
    } else if (this.getAttribute('as-link')) {
      this.link = document.createElement('A')
      this.link.setAttribute('target', '_blank')
      this.link.setAttribute('href', `${this.getAttribute('value')}`)
      this.link.innerText = this.getAttribute('value')
      this.value.appendChild(this.link);
    }
    else {
      this.value.innerText = this.getAttribute('value')
    }
    this.container.appendChild(this.value)
    this.html = this.container
  }
};
