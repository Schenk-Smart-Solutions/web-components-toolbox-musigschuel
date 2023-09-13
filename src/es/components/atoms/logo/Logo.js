// @ts-check
import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global self */
/* global CustomEvent */

/**
 * Logo is the navigation logo
 * Example at: /src/es/components/pages/Home.html
 * As an atom, this component can not hold further children (those would be quantum)
 *
 * @export
 * @class Logo
 * @type {CustomElementConstructor}
 * @attribute {
 *  {string} src used for the image source
 *  {string} href used for the link reference
 *  {string} mobile-breakpoint
 *  {string} alt
 *  {string} [logo-load="logo-load"]
 * }
 * @css {
 *  --height [85px - var(--content-spacing, 40px)]
 *  --align-items [center]
 *  --flex-flow [row]
 *  --justify-content [center]
 *  --margin [0px]
 *  --height [calc(var(--height, 85px) - var(--content-spacing, 40px))]
 *  --max-height [none]
 *  --width [auto]
 *  --max-width [80vw]
 *  --text-box-sizing [content-box]
 *  --text-color [pink]
 *  --text-font-size [1em]
 *  --text-line-height [normal]
 *  --text-padding [0]
 *  --text-margin [0]
 *  --text-a-color [green]
 *  --text-a-text-decoration [none]
 *  --text-a-color-hover [green]
 *  --text-a-text-decoration-hover [none]
 *  --height-mobile [65px]
 *  --max-height-mobile [none]
 *  --width-mobile [auto]
 * }
 */
export default class Logo extends Shadow() {
  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.textSelector = ':not(img):not(a):not(style):not(script)'
    this.setAttribute('lang', document.documentElement.getAttribute('lang') || 'de')

    let timeout = null
    this.resizeListener = event => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (this.text) {
          this.css = /* css */`
          :host > ${this.textSelector}{
            width: var(--text-width, ${this.a.getBoundingClientRect().width}px);
          }
          @media only screen and (max-width: _max-width_) {
            :host > ${this.textSelector}{
              width: var(--text-width-mobile, ${this.a.getBoundingClientRect().width}px);
            }
          }
        `
        }
      }, 200)
    }
  }

  connectedCallback () {
    if (this.shouldRenderCSS()) this.renderCSS()
    if (this.shouldRenderHTML()) this.renderHTML()
    self.addEventListener('resize', this.resizeListener)
  }

  disconnectedCallback () {
    self.removeEventListener('resize', this.resizeListener)
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
    return !this.a
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        align-items: var(--align-items, center);
        display: flex;
        flex-flow: var(--flex-flow, row);
        flex-grow: var(--flex-grow, 0);
        justify-content: var(--justify-content, center);
        box-sizing: border-box;
        margin: var(--margin, 0px);
        padding: var(--padding, 0px);
      }
      :host(.hide-desktop) {
        display: none;
      }
      :host(.hide-mobile) {
        display: flex;
      }
      :host a{
        height: var(--a-height, auto);
        width: var(--a-width, auto);
      }
      :host img{
        display: block;
        height: var(--height, calc(var(--height, 85px) - var(--content-spacing, 40px)));
        max-height: var(--max-height, none);
        object-fit: var(--object-fit, scale-down);
        width: var(--width, auto);
        max-width: var(--max-width, 80vw);
        margin: var(--img-margin, 0);
      }
      :host > ${this.textSelector}{
        font-family: var(--text-font-family);
        box-sizing: var(--text-box-sizing, border-box);
        color: var(--text-color, var(--color, pink));
        font-size: var(--text-font-size, 1em);
        line-height: var(--text-line-height, normal);
        padding: var(--text-padding, 0);
        margin: var(--text-margin, 0);
      }
      :host([lang="en"]) > ${this.textSelector}{
        padding: var(--text-padding-en, var(--text-padding, 0));
      }
      :host([lang="fr"]) > ${this.textSelector}{
        padding: var(--text-padding-fr, var(--text-padding, 0));
      }
      :host > ${this.textSelector} a{
        color: var(--text-a-color, var(--color, green));
        text-decoration: var(--text-a-text-decoration, var(--text-decoration, none));
        white-space: var(--text-a-white-space, var(--white-space, nowrap));
      }
      :host > ${this.textSelector} a:hover{
        color: var(--text-a-color-hover, var(--color-hover, var(--color, green)));
        text-decoration: var(--text-a-text-decoration-hover, var(--text-decoration-hover, var(--text-decoration, none)));
        font-family: var(--text-a-font-family-hover);
      }
      @media only screen and (max-width: _max-width_) {
        :host {
          margin: var(--margin-mobile, var(--margin, 0px));
          padding: var(--padding-mobile, var(--padding, 0px));
        }
        :host(.hide-desktop) {
          display: flex;
        }
        :host(.hide-mobile) {
          display: none;
        }
        :host img{
          height: var(--height-mobile, 65px);
          max-height: var(--max-height-mobile, var(--max-height, none));
          width: var(--width-mobile, auto);
          max-width: var(--max-width-mobile, var(--max-width, 80vw));
          margin: var(--img-margin-mobile, var(--img-margin, 0));
        }
        :host > ${this.textSelector}{
          box-sizing: var(--text-box-sizing-mobile, border-box);
          font-size: var(--text-font-size-mobile, 1em);
          padding: var(--text-padding-mobile, 0);
          line-height: var(--text-line-height-mobile, normal);
        }
        :host([lang="en"]) > ${this.textSelector}{
          padding: var(--text-padding-mobile-en, var(--text-padding-mobile, 0));
        }
        :host([lang="fr"]) > ${this.textSelector}{
          padding: var(--text-padding-mobile-fr, var(--text-padding-mobile, 0));
        }
      }
    `
    this.setCss(/* css */`
      :host {
        padding-right: 1em;
      }
      :host > a {
        font-size: var(--h3-font-size);
        font-weight: bold;
        text-decoration: underline;
        color: var(--color-tertiary);
      }
      :host > a > span {
        color: var(--background-color);
      }
      :host > a, :host > a > span {
        font-family: var(--font-family-secondary);
        transition: all .3s ease-out;
      }
      :host > a:hover {
        color: var(--background-color);
      }
      :host > a:hover > span {
        color: var(--color-tertiary);
      }
    `, undefined, false, false)
    return this.fetchTemplate()
  }

  /**
   * fetches the template
   *
   * @return {Promise<void>}
   */
  fetchTemplate () {
    switch (this.getAttribute('namespace')) {
      case 'logo-default-':
        return this.fetchCSS([{
          path: `${this.importMetaUrl}./default-/default-.css`, // apply namespace since it is specific and no fallback
          namespace: false
        }])
      default:
        return Promise.resolve()
    }
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    this.html = '<a href="/"><span>MUSI</span>𝄞<span>SCHUEL</span></a>'
    this.dispatchEvent(new CustomEvent(this.getAttribute('logo-load') || 'logo-load', {
      detail: {
        origEvent: event,
        child: this,
        img: this.img
      },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  get a () {
    return this.root.querySelector('a')
  }

  get text () {
    return this.root.querySelector(this.textSelector)
  }
}
