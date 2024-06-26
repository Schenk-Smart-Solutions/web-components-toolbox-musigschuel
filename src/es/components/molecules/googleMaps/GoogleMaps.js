import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js'

/* global google */
/* global self */

export default class GoogleMaps extends Shadow() {
  bounds = undefined

  constructor (options = {}, ...args) {
    super({ importMetaUrl: import.meta.url, ...options }, ...args)

    this.MAP_URL = this.getAttribute('url') || `${location.protocol || 'http:'}//maps.googleapis.com/maps/api/js?key=${this.getAttribute('key') || 'AIzaSyDDxevvZBiDT7FSimv6nI4tg3UTVJ7qewE'}&libraries=geometry&language=${document.documentElement.getAttribute('lang') || 'de'}`

    // scroll card container back to top on mouse out to not hide the picture on overflow hidden
    const addedMouseOutNodes = []
    this.clickEventListener = event => {
      //this.scrollIntoView()
      const containers = this.root.querySelectorAll('[role=dialog], .gm-style-iw, .gm-style-iw-c')
      containers.forEach(container => {
        if (!addedMouseOutNodes.includes(container)) {
          addedMouseOutNodes.push(container)
          container.addEventListener('mouseout', event => {
            if (container.children[0] && !container.matches(':hover')) container.children[0].scrollTop = 0
          })
        }
      })
    }

    let renderHTMLResolve
    this.showPromises = [new Promise(resolve => (renderHTMLResolve = resolve))]
    this.teachersEventListener = event => renderHTMLResolve(this.renderHTML(event.detail.fetch, event.detail.origin))
  }

  connectedCallback () {
    this.hidden = true
    if (this.shouldRenderCSS()) this.showPromises.push(this.renderCSS())
    Promise.all(this.showPromises).then(() => (this.hidden = false))
    this.addEventListener('click', this.clickEventListener)
    document.body.addEventListener('teachers', this.teachersEventListener)
    document.body.addEventListener('request-map-search', this.handleSearchChange)
    // TeacherList is taking care of this call
    /*
    this.dispatchEvent(new CustomEvent(this.getAttribute('request-teachers') || 'request-teachers', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
    */
  }

  disconnectedCallback () {
    this.removeEventListener('click', this.clickEventListener)
    document.body.removeEventListener('teachers', this.teachersEventListener)
    document.body.removeEventListener('request-map-search', this.handleSearchChange)
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
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        ${Array.from(this.parentElement.children).splice(-1)[0] === this
          ? 'margin-bottom: 0 !important;'
          : ''
        }
        width: 100% !important;
      }
      :host > div {
        width: 100%; 
      }
      div#map {
        height: 50dvh;
        color: var(--color);
      }
      div#map  button {
        color: red;
        background-color: var(--color);
      }
      /* https://blog.hubspot.com/website/css-flip-animation */
      .flip-card {
        background-color: transparent;
        width: 10em;
        height: 10em;
        perspective: 1000px;
      }
      
      .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s;
        transform-style: preserve-3d;
      }

      [role=dialog]:hover .flip-card .flip-card-inner, .gm-style-iw:hover .flip-card .flip-card-inner, .gm-style-iw-c:hover .flip-card .flip-card-inner {
        transform: rotateY(180deg);
      }

      [role=dialog] > *, .gm-style-iw > *, .gm-style-iw-c > * {
        overscroll-behavior: contain;
      }

      .gm-style img {
        max-width: none !important;
      }
      
      .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
      }
      
      .flip-card-front {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: none;
      }
      
      .flip-card:hover .flip-card-inner > .flip-card-front {
        opacity: 0;
        transition: opacity 0.2s 0.8s;
      }
      
      .flip-card-back {
        display: flex;
        align-items: center;
        flex-direction: column;
        transform: rotateY(180deg);
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
   * @param {Promise<import("../../controllers/teachers/Teachers.js").teachers>} fetch
   * @param {string} origin
   * @return {Promise<void>}
   */
  renderHTML (fetch, origin) {
    return Promise.all([
      fetch,
      this.loadDependency(),
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/picture/Picture.js`,
          name: 'a-picture'
        }
      ])
    ]).then(async ([teachers]) => {
      if (!teachers || !teachers.length) {
        this.teachers = []
        return this.removeAllMarkers()
      }
      // teachers is the new incoming teachers and this.teachers is the old teachers array
      teachers = teachers.map(teacher => ({
        ...teacher,
        lat: parseFloat(teacher.lat) || null,
        lng: parseFloat(teacher.lon) || null,
        id: teacher.teacherId,
        content: /* HTML */`
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <a-picture
                  no-bad-quality
                  sources-keep-query-aspect-ratio
                  sources-delete-query-keys="v"
                  namespace="picture-cover-"
                  defaultSource="${origin}${teacher.imageUrl}"
                ></a-picture>
              </div>
              <div class="flip-card-back">
                <a style="text-decoration:none;" href="${origin}${teacher.link}">
                     <h2 style="text-decoration:none;text-align:center">${teacher.title}</h2>
                    <div>${teacher.text}</div>
                </a>
              </div>
            </div>
          </div>
        `
      }))
      // update Map
      if (this.gMap) {
        // add all teachers which not already on the map
        teachers = await Promise.all(teachers.map(async (teacher) => {
          if (!this.teachers.some(oldTeacher => teacher.id === oldTeacher.id)) return await this.addMarker(this.gMap, teacher)
          return this.teachers.find(oldTeacher => teacher.id === oldTeacher.id)
        }))
        // remove all teachers which are no more in the new teachers array
        this.teachers.forEach(oldTeacher => {
          if (!teachers.some(teacher => teacher.id === oldTeacher.id)) this.removeMarker(oldTeacher)
        })
      // create new map
      } else {
        this.html = /* HTML */`
          <div>
            <div id=map></div>
          </div>
        `
        this.gMap = new google.maps.Map(this.map, {})
        this.geocoder = new google.maps.Geocoder()
        this.markers = []
        teachers = await Promise.all(teachers.map(async (teacher) => await this.addMarker(this.gMap, teacher)))
        // update the teachers list
        let boundsChangedTimeout
        this.gMap.addListener('bounds_changed', () => {
          clearTimeout(boundsChangedTimeout)
          boundsChangedTimeout = setTimeout(() => this.dispatchEvent(new CustomEvent(this.getAttribute('google-maps-teachers') || 'google-maps-teachers',
          {
            detail: {
              origin,
              fetch: Promise.resolve(this.markers.filter(marker => this.gMap.getBounds().contains(marker.getPosition())).map(marker => this.teachers.find(teacher => teacher.id === marker.id)))
            },
            bubbles: true,
            cancelable: true,
            composed: true
          })), 50)
        })
      }
      const center = teachers.length > 1 || !teachers[0].lat === null || teachers[0].lng === null ? { lat: 46.8182, lng: 8.2275 } : { lat: teachers[0].lat, lng: teachers[0].lng }
      this.gMap.setCenter(center)
      const zoom = teachers.length > 1 || !teachers[0].lat === null || teachers[0].lng === null ? 8 : 12
      this.gMap.setZoom(zoom)
      this.bounds = teachers.length > 1 ? new google.maps.LatLngBounds() : undefined
      this.updateBounds()
      if (this.bounds) this.gMap.fitBounds(this.bounds)
      this.teachers = teachers
    })
  }

  handleSearchChange = (event) => {
    if (event.detail.value && event.detail.value.length >= 3) {
      this.filterMarkers(event.detail.value || 0, 5, this.getMarkers(), this.gMap)
    } else {
      this.updateBounds()
      if (this.bounds) this.gMap.fitBounds(this.bounds)
    }
  }

  /**
   *
   *
   * @param {*} gMap
   * @param {{
   *  lat: number;
   *  lng: number;
   *  content: string;
   *  lon: number;
   *  title: string;
   *  text: string;
   *  imageUrl: string;
   *  link: string;
   *  instruments: string[];
   * }} teacher
   */
  async addMarker (gMap, teacher, geocoder = this.geocoder) {
    await new Promise(resolve => {
      if (teacher.lat === null || teacher.lng === null) {
        // add lat/lng if missing
        geocoder.geocode( { address: `${teacher.street}, ${teacher.zipCode} ${teacher.city}` + ' Switzerland'}, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            teacher.lat = results[0].geometry.location.lat()
            teacher.lng = results[0].geometry.location.lng()
          } else {
            console.warn('teacher could not be added, google maps did not find its address', teacher)
          }
          resolve()
        })
      } else {
        resolve()
      }
    })
    const marker = new google.maps.Marker({
      position: { lat: teacher.lat, lng: teacher.lng },
      map: gMap,
      id: teacher.id,
      icon: teacher.icon
    })
    this.markers.push(marker)

    if (this.bounds) {
      this.bounds.extend(marker.position)
    }

    if (teacher.content) {
      this.addInfoWindow(gMap, marker, teacher.content)
    }
    return teacher
  }

  removeMarker (teacher) {
    const index = isNaN(teacher)
      ? this.markers.findIndex(marker => marker.id === teacher.id)
      : teacher
    this.markers.splice(index, 1)[0]?.setMap(null)
  }

  removeAllMarkers () {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
  }

  addInfoWindow (gMap, marker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content
    })

    marker.addListener('click', () => {
      this.markers.forEach(marker => marker.infoWindow?.close())
      infoWindow.open({
        anchor: marker,
        gMap,
        shouldFocus: true
      })
      this.dispatchEvent(new CustomEvent(this.getAttribute('google-maps-teacher-click') || 'google-maps-teacher-click', {
        detail: {
          marker
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    })
    marker.infoWindow = infoWindow
  }

  getMarkers = () => {
    return this.teachers.map(teacher => {
      return new google.maps.Marker({
        position: { lat: teacher.lat, lng: teacher.lng },
        map: this.gMap,
        icon: teacher.icon,
        content: teacher.content
      })
    })
  }

  updateBounds () {
    if (this.bounds) this.markers.forEach(marker => this.bounds.extend(marker.position))
  }

  filterMarkers (postcode, radius, markers, gMap, geocoder = this.geocoder) {
    geocoder.geocode({ address: postcode + ' Switzerland' }, (results, status) => {
      if (status === 'OK') {
        this.dispatchEvent(new CustomEvent(this.getAttribute('map-search') || 'map-search', {
          detail: {
            searchLocation: results[0].formatted_address
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))

        const center = results[0].geometry.location

        for (let i = 0; i < markers.length; i++) {
          const distance = google.maps.geometry.spherical.computeDistanceBetween(markers[i].getPosition(), center)

          if (distance < radius) {
            markers[i].setVisible(true)
          } else {
            markers[i].setVisible(false)
          }
        }

        gMap.setCenter(center)
        gMap.setZoom(11)
      } else {
        console.warn('Geocode was not successful for the following reason: ' + status)
      }
    })
  }

  /**
  * fetch dependency
  *
  * @returns {Promise<{components: any}>}
  */
  loadDependency () {
    if (self.google?.maps) return Promise.resolve(self.google.maps)
    return this._dependency || (this._dependency = new Promise(resolve => {
      self.initMap = () => { }
      const googleMapScript = document.createElement('script')
      googleMapScript.setAttribute('type', 'text/javascript')
      googleMapScript.setAttribute('async', '')
      googleMapScript.setAttribute('src', this.MAP_URL)
      googleMapScript.onload = () => {
        if (self.google?.maps) resolve(self.google.maps)
      }
      this.html = googleMapScript
    }))
  }

  get map () {
    return this.root.querySelector('#map')
  }
}
