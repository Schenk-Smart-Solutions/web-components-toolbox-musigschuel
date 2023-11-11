import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

export default class GMapsMarker extends Shadow() {
  getContentHTML () {
    if (this.content) return this.content
    this.content = this.getAttribute('img-src')
      ? /* html */`
        <div class="container">
          <div class="card">
            <div class="side front">
              <a-picture
                namespace="picture-scale-up-"
                defaultSource="${this.getAttribute('img-src')}"
              ></a-picture>
            </div>
            <div class="side back">${this.root.innerHTML}</div>
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
