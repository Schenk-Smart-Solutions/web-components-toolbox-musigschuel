// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
* @export
* @class SelectOptionSearch
* @type {CustomElementConstructor}
*/
export default class SelectOptionSearch extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, mode: 'false', ...options }, ...args)

    if (!this.hasAttribute('id')) this.setAttribute('id', 'select-option-search')

    this.clickEventListener = event => {
      if (!this.input) return
      const target = event.composedPath().find(node => node.tagName === 'LI')
      if (target) {
        this.activeLi(target)
        this.changeEventListener(event)
        this.input.blur()
        this.ul.classList.remove('show')
        this.ul.classList.remove('hide')
      }
    }

    // adjust for handling both events from input change and activeLi function
    let changeTimeoutId = null
    this.changeEventListener = event => {
      const isTypeChange = event.type === 'change'
      clearTimeout(changeTimeoutId)
      changeTimeoutId = setTimeout(() => {
        // TODO: add new/custom
        // on input text free hand changed, check if it has a matching preset
        let matchingLi
        if (isTypeChange && this.input.value && (matchingLi = Array.from(this.ul.children).find(li => li.textContent.includes(this.input.value)
          || this.input.value.includes(li.textContent)))) this.activeLi(matchingLi)
        // TODO: multi-select
        this.input.value = this.liActive.getAttribute('value') ? this.liActive.textContent : ''
        let matchingOption
        if ((matchingOption = this.section.querySelector(`[value${this.liActive.getAttribute('value') ? `="${this.liActive.getAttribute('value')}"` : ''}]`))) {
          Array.from(this.section.querySelectorAll(':checked')).forEach(option => (option.selected = false))
          matchingOption.selected = true
        }
        this.updateValidity()
      }, isTypeChange ? 200 : 0)
    }

    let blurTimeoutId = null
    this.focusEventListener = event => {
      clearTimeout(blurTimeoutId)
      this.section.scrollIntoView()
      const show = event => {
        this.style.textContent = ''
        this.setCss(/* css */`
          :host > section > ul > li {
            ${this.input ? `font-size: ${self.getComputedStyle(this.input).getPropertyValue('font-size')};` : ''}
          }
          :host > section > ul {
            max-height: calc(100svh - ${this.section.getBoundingClientRect().bottom}px);
          }
        `, undefined, undefined, true, this.style)
        this.filterFunction()
        this.ul.classList.add('show')
        this.ul.classList.remove('hide')
        this.ul.scrollTop = 0
        if (!this.liActive || this.liActive.classList.contains('hidden')) this.activeLi()
        // set cursor to the end of the input filed
        if (this.input.value) setTimeout(() => this.input.setSelectionRange(this.input.value.length, this.input.value.length), 20)
      }
      if ((self.innerHeight + self.scrollY) >= document.body.scrollHeight) {
        show()
      } else {
        document.addEventListener('scrollend', show, { once: true })
      }
    }

    this.blurEventListener = event => {
      this.ul.classList.add('hide')
      // must have a timeout of at least 200ms, that the value on click can be consumed before blur
      blurTimeoutId = setTimeout(() => {
        this.style.textContent = ''
        this.ul.classList.remove('show')
        this.ul.classList.remove('hide')
      }, 1000)
    }

    this.keydownListener = event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.liActive?.click()
        return
      }
      if (event.key.includes('Arrow')) {
        event.preventDefault()
        if (event.key === 'ArrowUp') {
          this.activeLi(this.lisShown[this.lisShown.indexOf(this.liActive) - 1] || this.lisShown[this.lisShown.length - 1])
          this.changeEventListener(event)
          return
        }
        if (event.key === 'ArrowDown') {
          this.activeLi(this.lisShown[this.lisShown.indexOf(this.liActive) + 1])
          this.changeEventListener(event)
          return
        }
      }
    }

    this.keyupListener = event => {
      event.preventDefault()
      if (event.key === 'Escape') {
        this.ul.classList.remove('show')
        this.ul.classList.remove('hide')
        this.input?.blur()
        return
      }
      if (event.key === 'ArrowUp') return
      if (event.key === 'ArrowDown') return
      this.filterFunction()
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    this.updateValidity()
    this.addEventListener('click', this.clickEventListener, {capture: true})
    this.input?.addEventListener('change', this.changeEventListener)
    this.input?.addEventListener('focus', this.focusEventListener)
    this.input?.addEventListener('blur', this.blurEventListener)
    this.input?.addEventListener('keydown', this.keydownListener)
    this.input?.addEventListener('keyup', this.keyupListener)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
    this.input?.removeEventListener('change', this.changeEventListener)
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
    return !this.input
  }

  /**
   * renders the css
   */
  renderCSS () {
    this.css = /* css */`
      :host > section {
        position: relative;
      }
      :host > section > div {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        width: 100%;
      }
      :host > section > div > * {
        grid-column: 1;
        grid-row: 2;
        height: 100%;
        width: 100%;
      }
      :host > section > div > label {
        grid-row: 1;
      }
      :host > section > div > select {
        pointer-events: none;
        opacity: 0;
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
      :host > section > ul > li.placeholder {
        color: gray;
      }
      :host > section > ul > li.hidden {
        display: none;
      }
      :host > section > ul > li:last-child {
        padding-bottom: 0.25em;
      }
      :host > section > ul > li:hover, :host > section > ul > li.active {
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
    this.html = /* html */`
      <section>
        <div>
          <input type=text autocomplete=off placeholder="${this.select.querySelector('[value=""]')?.textContent || this.select.children[0].textContent}"></input>
        </div>
        <ul>
          ${Array.from(this.select.querySelectorAll('option')).reduce((acc, option, i) => acc + `<li value="${option.value}"${i === 0 && !option.value ? ' class="placeholder"' : ''}>${option.textContent}</li>`, '')}
        </ul>
      </section>
    `
    if (this.label) this.div.appendChild(this.label)
    this.div.appendChild(this.select)
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

  activeLi (liToSelect) {
    this.lis.forEach(li => li.classList.remove('active'))
    if (liToSelect) {
      liToSelect.classList.add('active')
    } else {
      this.lis.find(li => !li.classList.contains('hidden'))?.classList.add('active')
    }
    this.liActive?.scrollIntoView({block: 'nearest'})
  }

  updateValidity () {
    this.input.setCustomValidity(this.select.checkValidity() ? '' : 'select not valid')
  }

  get label () {
    return this.root.querySelector('label')
  }

  get input () {
    return this.root.querySelector('input')
  }

  get select () {
    return this.root.querySelector('select')
  }

  get section () {
    return this.root.querySelector('section')
  }

  get div () {
    return this.root.querySelector('div')
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

  get liActive () {
    return this.root.querySelector('li.active')
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
