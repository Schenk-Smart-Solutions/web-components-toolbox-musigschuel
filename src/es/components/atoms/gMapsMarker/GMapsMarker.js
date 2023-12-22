import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class GMapsMarker extends Shadow() {
  getContentHTML () {
    if (this.content) return this.content
    this.content = this.getAttribute('img-src')
      ? /* html */`
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <a-picture
                namespace="picture-cover-"
                defaultSource="${this.getAttribute('img-src')}"
              ></a-picture>
            </div>
            <div class="flip-card-back">
              ${this.root.innerHTML}
            </div>
          </div>
        </div>
      `
      : this.root.innerHTML && this.root.innerHTML.trim()
        ? /*html */`
          <div>
          ${this.root.innerHTML}
          </div>
        `
        : undefined
    this.html = ''
    return this.content
  }
}
