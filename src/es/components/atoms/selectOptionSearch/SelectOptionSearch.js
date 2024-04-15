// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class SelectOptionSearch
* @type {CustomElementConstructor}
*/
export default class SelectOptionSearch extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.clickEventListener = event => {
      if (!this.input) return
      const target = event.composedPath().find(node => node.tagName === 'LI')
      if (target) {
        this.input.value = target.textContent
        this.selectLi(target)
        this.input.blur()
        this.ul.classList.remove('show')
        this.ul.classList.remove('hide')
      }
    }

    let blurTimeoutId = null
    this.focusEventListener = event => {
      clearTimeout(blurTimeoutId)
      this.section.scrollIntoView()
      const show = event => {
        this.style.textContent = /* css */`
          :host > section > ul > li {
            ${this.input ? `font-size: ${self.getComputedStyle(this.input).getPropertyValue('font-size')};` : ''}
          }
          :host > section > ul {
            max-height: calc(100svh - ${this.section.getBoundingClientRect().bottom}px);
          }
        `
        this.filterFunction()
        this.ul.classList.add('show')
        this.ul.classList.remove('hide')
        this.ul.scrollTop = 0
        if (!this.liSelected || this.liSelected.classList.contains('hidden')) this.selectLi()
      }
      if ((self.innerHeight + self.scrollY) >= document.body.scrollHeight) {
        show()
      } else {
        document.addEventListener('scrollend', show, { once: true })
      }
    }

    this.blurEventListener = event => {
      this.ul.classList.add('hide')
      this.style.textContent = ''
      blurTimeoutId = setTimeout(() => {
        this.ul.classList.remove('show')
        this.ul.classList.remove('hide')
      }, 1000)
    }

    this.keydownListener = event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.liSelected?.click()
        return
      }
      if (event.key.includes('Arrow')) event.preventDefault()
    }

    this.keyupListener = event => {
      event.preventDefault()
      if (event.key === 'Escape') {
        this.ul.classList.remove('show')
        this.ul.classList.remove('hide')
        this.input?.blur()
        return
      }
      if (event.key === 'ArrowUp') {
        this.selectLi(this.lisShown[this.lisShown.indexOf(this.liSelected) - 1] || this.lisShown[this.lisShown.length - 1])
        return
      }
      if (event.key === 'ArrowDown') {
        this.selectLi(this.lisShown[this.lisShown.indexOf(this.liSelected) + 1])
        return
      }
      this.filterFunction()
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    this.addEventListener('click', this.clickEventListener, {capture: true})
    this.input?.addEventListener('focus', this.focusEventListener)
    this.input?.addEventListener('blur', this.blurEventListener)
    this.input?.addEventListener('keydown', this.keydownListener)
    this.input?.addEventListener('keyup', this.keyupListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
    this.input?.removeEventListener('focus', this.focusEventListener)
    this.input?.removeEventListener('blur', this.blurEventListener)
    this.input?.removeEventListener('keydown', this.keydownListener)
    this.input?.removeEventListener('keyup', this.keyupListener)
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
    return !this.slot
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host > section {
        position: relative;
      }
      :host > section > ul {
        background-color: white;
        border: 1px solid black;
        display: none;
        list-style: none;
        padding: 0;
        margin: 0;
        overflow: auto;
        position: absolute;
        width: 100%;
        z-index: 100;
      }
      :host > section > ul.hide {
        opacity: 0;
      }
      :host > section > ul.show {
        display: block;
      }
      :host > section > ul > li {
        cursor: pointer;
        padding: 0.25em 0.5em;
      }
      :host > section > ul > li.hidden {
        display: none;
      }
      :host > section > ul > li:last-child {
        padding-bottom: 0.25em;
      }
      :host > section > ul > li:hover, :host > section > ul > li.selected {
        background-color: var(--color-secondary, orange);
        color: var(--background-color, white);
      }
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
      default:
        return this.fetchCSS(styles)
    }
  }

  /**
   * Render HTML
   * @returns void
   */
  renderHTML () {
    this.input = document.createElement('input')
    this.input.setAttribute('slot', 'input')
    this.input.setAttribute('type', 'text')
    this.input.setAttribute('autocomplete', 'off')
    this.input.setAttribute('placeholder', this.select.querySelector('[value=""]')?.textContent || this.select.children[0].textContent)
    this.appendChild(this.input)
    this.html = /* html */`
      <slot name="select-label"></slot>
      <section>
        <slot name="input"></slot>
        <ul>
          ${Array.from(this.select.querySelectorAll('option')).reduce((acc, option, i) => acc + (option.value ? `<li>${option.textContent}</li>` : ''), '')}
        </ul>
      </section>
    `
    this.html = this.style
  }

  // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown_filter
  filterFunction () {
    const filter = this.input?.value.toUpperCase()
    for (let i = 0; i < this.lis.length; i++) {
      const txtValue = this.lis[i].textContent || this.lis[i].innerText
      this.lis[i].classList[!filter || txtValue.toUpperCase().indexOf(filter) > -1 ? 'remove' : 'add']('hidden')
    }
  }

  selectLi (liToSelect) {
    this.lis.forEach(li => li.classList.remove('selected'))
    if (liToSelect) {
      liToSelect.classList.add('selected')
    } else {
      this.lis.find(li => !li.classList.contains('hidden'))?.classList.add('selected')
    }
  }

  get select () {
    return this.querySelector('select')
  }

  get section () {
    return this.root.querySelector('section')
  }

  get ul () {
    return this.root.querySelector('ul')
  }

  get lis () {
    return Array.from(this.root.querySelectorAll('li')) || []
  }

  get lisShown () {
    return Array.from(this.root.querySelectorAll('li:not(.hidden)')) || []
  }

  get liSelected () {
    return this.root.querySelector('li.selected')
  }

  get slot () {
    return this.root.querySelector('slot')
  }

  get style () {
    return this._style || (this._style = (() => {
      const style = document.createElement('style')
      style.setAttribute('_css', '')
      style.setAttribute('protected', 'true')
      return style
    })())
  }
}
