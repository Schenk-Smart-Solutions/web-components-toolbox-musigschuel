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
      const containers = this.root.querySelectorAll('.container')
      containers.forEach(container => {
        if (!addedMouseOutNodes.includes(container)) {
          addedMouseOutNodes.push(container)
          container.addEventListener('mouseout', event => {
            if (!container.matches(':hover')) container.scrollTop = 0
          })
        }
      })
    }
  }

  connectedCallback () {
    this.hidden = true
    const showPromises = []
    if (this.shouldRenderCSS()) showPromises.push(this.renderCSS())
    if (this.shouldRenderHTML()) showPromises.push(this.renderHTML())
    Promise.all(showPromises).then(() => (this.hidden = false))
    document.body.addEventListener('request-map-search', this.handleSearchChange)
    this.addEventListener('click', this.clickEventListener)
  }

  disconnectedCallback () {
    document.body.removeEventListener('request-map-search', this.handleSearchChange)
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
    return !this.div
  }

  /**
   * renders the css
   *
   * @return {Promise<void>}
   */
  renderCSS () {
    this.css = /* css */`
      :host {
        ${Array.from(this.parentElement.children).splice(-1)[0] === this ?
          'margin-bottom: 0 !important;'
          : ''
        }
        width: 100% !important;
      }
      :host > div {
        width: 100%; 
      }
      div.g-maps {
        height: 50dvh;
        color: var(--color);
      }
      div.g-maps  button {
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
      
      .flip-card:hover .flip-card-inner {
        transform: rotateY(180deg);
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
      }
      
      .flip-card-back {
        display: flex;
        background-color: white;
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
   * @return {Promise<void>}
   */
  renderHTML () {
    return Promise.all([
      this.loadDependency(),
      this.fetchModules([
        {
          path: `${this.importMetaUrl}../../web-components-toolbox/src/es/components/atoms/picture/Picture.js`,
          name: 'a-picture'
        }
      ])
    ]).then(() => {
      this.container = document.createElement('DIV')
      this.map = document.createElement('DIV')

      this.map.className = 'g-maps'
      this.map.setAttribute('id', 'map')

      this.container.appendChild(this.map)

      this.markers = Array.from(this.root.querySelectorAll('ms-a-g-maps-marker')).map(marker => {
        const res = {
          lat: parseFloat(marker.getAttribute('lat')),
          lng: parseFloat(marker.getAttribute('long')),
          content: marker.getContentHTML()
        }
        if (marker.getAttribute('icon')) res.icon = marker.getAttribute('icon')
        return res
      })

      const gMap = new google.maps.Map(this.map, {
        center: this.markers.length > 1 ? { lat: 46.8182, lng: 8.2275 } : { lat: this.markers[0].lat, lng: this.markers[0].lng },
        zoom: this.markers.length > 1 ? 8 : 12
      })

      this.bounds = this.markers.length > 1 ? this.bounds = new google.maps.LatLngBounds() : undefined

      if (this.bounds) {
        gMap.fitBounds(this.bounds)
      }

      this.markers.forEach(m => this.addMarker(gMap, m))

      this.map = gMap
      this.html = this.container
    })
  }

  handleSearchChange = (event) => {
    if (event.detail.value) {
      this.filterMarkers(event.detail.value || 0, 5, this.getMarkers(), this.map)
    }
  }

  addMarker (gMap, markerData) {
    const marker = new google.maps.Marker({
      position: { lat: markerData.lat, lng: markerData.lng },
      map: gMap,
      icon: markerData.icon
    })

    if (this.bounds) {
      this.bounds.extend(marker.position)
    }

    if (markerData.content) {
      this.addInfoWindow(gMap, marker, markerData.content)
    }
  }

  addInfoWindow (gMap, marker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content
    })

    marker.addListener('click', () => {
      infoWindow.open({
        anchor: marker,
        gMap,
        shouldFocus: true
      })
    })
  }

  getMarkers = () => {
    return this.markers.map(m => {
      return new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: this.map,
        icon: m.icon,
        content: m.content
      })
    })
  }

  filterMarkers (postcode, radius, markers, map) {
    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ address: postcode + " Switzerland" }, (results, status) => {
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

        map.setCenter(center)
        map.setZoom(11)
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
    // @ts-ignore
    self.initMap = () => { }

    return new Promise(resolve => {
      const googleMapScript = document.createElement('script')
      googleMapScript.setAttribute('type', 'text/javascript')
      googleMapScript.setAttribute('async', '')
      googleMapScript.setAttribute('src', this.MAP_URL)
      googleMapScript.onload = () => {
        // @ts-ignore
        if ('google' in self) resolve(self.google.maps)
      }
      this.html = googleMapScript
    })
  }
}
