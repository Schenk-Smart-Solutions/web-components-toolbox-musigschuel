// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/**
 * Implementation for https://captcha.com/asp.net-captcha.html
 * 
 * @export
 * @class BotDetectCaptcha
 * @type {CustomElementConstructor}
 */
export default class BotDetectCaptcha extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.keyUpEventListener = (event, disabled) => {
      this.dispatchEvent(new CustomEvent(this.getAttribute('submit-disabled') || 'submit-disabled', {
        detail: {
          input: this.input,
          disabled: disabled || !this.input.value
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }
    this.keyUpEventListener(undefined, true)

    this.reloadLinkClickEventListener = event => {
      event.preventDefault()
      event.stopPropagation()
      this.reload()
    }

    this.soundLinkClickEventListener = event => {
      event.preventDefault()
      event.stopPropagation()
      const url = `${this.endpoint.href}&get=sound&e=1${this.getLastImageTimeStamp() ? `&d=${this.getLastImageTimeStamp()}` : ''}`
      const audio = document.createElement('audio')
      audio.setAttribute('src', url)
      const source = document.createElement('source')
      source.setAttribute('type', 'audio/x-wav')
      source.setAttribute('src', url)
      audio.appendChild(source)
      audio.play()
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    this.input.addEventListener('keyup', this.keyUpEventListener)
    this.reloadLink.addEventListener('click', this.reloadLinkClickEventListener)
    this.soundLink.addEventListener('click', this.soundLinkClickEventListener)
  }

  disconnectedCallback () {
    this.input.removeEventListener('keyup', this.keyUpEventListener)
    this.reloadLink.removeEventListener('click', this.reloadLinkClickEventListener)
    this.soundLink.removeEventListener('click', this.soundLinkClickEventListener)
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
        display: flex;
      }
      :host > section > figure {
        padding: 0;
        margin: 0;
      }
      :host > section > figure > img {
        height: auto;
        width: max-content;
      }
      :host > section > div {
        display: flex;
        flex-direction: column;
      }
      :host > section > div > a {
        margin: 0 0 0.1em 0.1em;
      }
      :host([no-sound]) > section > div > #sound {
        display: none;
      }
      :host a[href^="//captcha.org"] {
        font-size: 0.75em;
        font-style: italic;
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
      case 'bot-detect-captcha-default-':
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
    // captcha text input field
    this.input = this.root.querySelector('input[required]') || document.createElement('input')
    this.input.setAttribute('type', 'text')
    this.input.setAttribute('required', '')
    if (!this.input.hasAttribute('id')) this.input.setAttribute('id', this.getAttribute('id') || 'captchaCode')
    if (!this.input.hasAttribute('name')) this.input.setAttribute('name', this.getAttribute('name') || 'captchaCode')
    if (!this.input.hasAttribute('placeholder')) this.input.setAttribute('placeholder', this.getAttribute('placeholder') || 'enter the captcha')
    this.appendChild(this.input)
    // captcha hidden fields
    // VC-ID
    const inputVcId = this.root.querySelector('input[id=BDC_VCID_Captcha]') || document.createElement('input')
    inputVcId.value = this.getAttribute('vc-id')
    inputVcId.setAttribute('type', 'hidden')
    if (!inputVcId.hasAttribute('id')) inputVcId.setAttribute('id', 'BDC_VCID_Captcha')
    if (!inputVcId.hasAttribute('name')) inputVcId.setAttribute('name', 'BDC_VCID_Captcha')
    this.appendChild(inputVcId)
    // BackWorkaround
    const inputBackWorkaround = this.root.querySelector('input[id=BDC_BackWorkaround_Captcha]') || document.createElement('input')
    inputBackWorkaround.value = 1
    inputBackWorkaround.setAttribute('type', 'hidden')
    if (!inputBackWorkaround.hasAttribute('id')) inputBackWorkaround.setAttribute('id', 'BDC_BackWorkaround_Captcha')
    if (!inputBackWorkaround.hasAttribute('name')) inputBackWorkaround.setAttribute('name', 'BDC_BackWorkaround_Captcha')
    this.appendChild(inputBackWorkaround)
    // Hs
    this.inputHs = this.root.querySelector('input[id=BDC_Hs_Captcha]') || document.createElement('input')
    this.inputHs.setAttribute('type', 'hidden')
    if (!this.inputHs.hasAttribute('id')) this.inputHs.setAttribute('id', 'BDC_Hs_Captcha')
    if (!this.inputHs.hasAttribute('name')) this.inputHs.setAttribute('name', 'BDC_Hs_Captcha')
    this.appendChild(this.inputHs)
    // SP
    this.inputSp = this.root.querySelector('input[id=BDC_Hs_Captcha]') || document.createElement('input')
    this.inputSp.setAttribute('type', 'hidden')
    if (!this.inputSp.hasAttribute('id')) this.inputSp.setAttribute('id', 'BDC_SP_Captcha')
    if (!this.inputSp.hasAttribute('name')) this.inputSp.setAttribute('name', 'BDC_SP_Captcha')
    this.appendChild(this.inputSp)
    this.html = /* html */`
      <section>
        <figure>
          <img src="${this.endpoint.href}&get=image" alt="${this.getAttribute('img-alt') || 'Retype the CAPTCHA code from the image'}" />
          <figcaption>
            <a id="link" href="//captcha.org/captcha.html?asp.net" title="${this.getAttribute('link-title') || this.getAttribute('link-text-content') || 'BotDetect CAPTCHA ASP.NET Form Validation'}">${this.getAttribute('link-text-content') || this.getAttribute('link-title') || 'BotDetect CAPTCHA ASP.NET Form Validation'}</a>
          </figcaption>
        </figure>
        <div>
            <a id="reload" href="#" title="${this.getAttribute('reload-title') || 'Change the CAPTCHA code'}"><img src="${this.getAttribute('endpoint')}?get=reload-icon" alt="${this.getAttribute('reload-alt') || 'Change the CAPTCHA code'}" /></a>
            <a id="sound" href="#" title="${this.getAttribute('sound-title') || 'Speak the CAPTCHA code'}" rel="nofollow"><img src="${this.getAttribute('endpoint')}?get=sound-icon" alt="${this.getAttribute('reload-alt') || 'Speak the CAPTCHA code'}" /></a>
        </div>
      </section>
      <slot></slot>
    `
    // Hs & Sp value
    if (!this.inputHs.value || !this.inputSp.value) this.reload(true)
  }

  reload (init = false) {
    const url = this.endpoint
    url.searchParams.set('get', 'p')
    // always use the timestamp "d" of the last delivered image
    // @ts-ignore
    if (this.getLastImageTimeStamp()) url.searchParams.set('d', this.getLastImageTimeStamp())
    fetch(url.href, {
      method: 'GET',
    }).then(async response => {
      if (response.status >= 200 && response.status <= 299) return await response.json()
      throw new Error(response.statusText)
    }).then(({sp, hs}) => {
      this.inputHs.value = hs
      this.inputSp.value = sp
      if (!init) {
        // update image
        const newImage = document.createElement('img')
        Array.from(this.captchaImg.attributes).forEach(attribute => {
          if (attribute.name && attribute.value) {
            if (attribute.name === 'src') {
              const imgUrl = new URL(attribute.value)
              // always use a new timestamp "d" for a fresh image
              imgUrl.searchParams.set('d', String(Date.now()))
              newImage.setAttribute('src', imgUrl.href)
            } else {
              newImage.setAttribute(attribute.name, attribute.value)
            }
          }
        })
        this.captchaImg.replaceWith(newImage)
      }
    })
  }

  getLastImageTimeStamp () {
    const imgUrl = new URL(this.captchaImg.src)
    // @ts-ignore
    return imgUrl.searchParams.get('d')
  }

  get endpoint () {
    const url = new URL(this.getAttribute('endpoint'), this.getAttribute('endpoint').charAt(0) === '/' ? location.origin : this.getAttribute('endpoint').charAt(0) === '.' ? this.importMetaUrl : undefined)
    url.searchParams.set('c', 'Captcha')
    url.searchParams.set('t', this.getAttribute('vc-id'))
    return url
  }

  get captchaImg () {
    return this.root.querySelector('figure > img')
  }

  get reloadLink () {
    return this.root.querySelector('#reload')
  }

  get soundLink () {
    return this.root.querySelector('#sound')
  }
}
