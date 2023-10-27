import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js';

export default class GoogleMaps extends Shadow() {

    bounds = undefined;

    constructor(...args) {
        super(...args);
    }

    connectedCallback() {
        this.visibleSloganIndex = 0;
        this.sloganDiv = this.getSlogan();

        setInterval(() => {
            this.slogans[this.visibleSloganIndex].classList.remove('visible');

            if (this.visibleSloganIndex < this.slogans.length - 1)
                this.visibleSloganIndex++;
            else
                this.visibleSloganIndex = 0;

            this.slogans[this.visibleSloganIndex].classList.add('visible');
        }, 10000);

        if (this.shouldComponentRenderCSS()) this.renderCSS();
        if (this.shouldComponentRenderHTML()) this.renderMap();
    }

    disconnectedCallback() {

    }

    shouldComponentRenderHTML() {
        return !this.root.querySelector('div');
    }

    shouldComponentRenderCSS() {
        return !this.root.querySelector('style[_css]');
    }

    renderCSS() {
        this.css = `
            :host > div {
                width: 100%; 
          
            }
            div.g-maps {
                height: 50vh;
                color: #000000;
            }
            div.g-maps  button {
                color: red;
                background-color: #000000;
            }

            label {
                font-weight: 400;
                font-size: 1.2rem;

            }

            input {
                height: 3rem;
                font-size: 2rem;
                margin-bottom: 1rem;
                font-size: 1rem;
                box-sizing: border-box;
                padding: 0 0.5rem;
   
            }

            input::placeholder {
              font-weight: bold;
              opacity: 0.5;
              font-size: 1rem;
    
            }

            .slogan-container {
               position: relative;
               height: 4rem;
               width: 100%;
               margin-bottom: 1rem;
            }

            .slogan-container div {
               font-size: 1rem;
               font-weight: bold;
               width: 100%;
               top: 0;
               left: 0;
               position: absolute;
               transition: opacity 2s ease-in-out;
               opacity: 0;
               display: flex;
               align-items: center;
               justify-content: center;
               text-align: center;
               height: 100%;
               text-transform: uppercase;
               background-color: #000000;
               color: white;
            }

            .slogan-container div.visible {
                opacity: 1;
            }
            

            .search-container {
    
 
            }
            
            .search-container input {
                width: 100%;
            }

        `;
    }

    addMarker(gMap, markerData) {
        const marker = new google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map: gMap,
            icon: markerData.icon
        });

        if (this.bounds) {
            this.bounds.extend(marker.position);
        }

        if (markerData.content) {
            this.addInfoWindow(gMap, marker, markerData.content);
        }
    }

    addInfoWindow(gMap, marker, content) {
        const infoWindow = new google.maps.InfoWindow({
            content: content
        });

        marker.addListener('click', () => {
            infoWindow.open({
                anchor: marker,
                gMap,
                shouldFocus: true
            })
        });
    }


    getSlogan() {
        const sloganContainer = document.createElement('DIV');
        sloganContainer.className = 'slogan-container';
        this.sloganPanels = [];

       this.slogans = Array.from(this.shadowRoot.querySelectorAll('ms-a-slogan')).map((s, i) => {
           const panel = document.createElement('DIV');
           if (i === 0) panel.classList.add('visible');

           if (i % 2 === 0) {
               panel.classList.add('inverse');
           }
           panel.innerHTML = s.innerHTML;
           return panel;
        });

       this.slogans.forEach(s => sloganContainer.appendChild(s));
       return sloganContainer;
    }

    renderMap() {
        this.container = document.createElement('DIV');
        this.map = document.createElement('DIV');

        if (this.hasAttribute('show-search')) {
            this.searchContainer = document.createElement('DIV');
            this.searchContainer.className = 'search-container';
            this.searchField = document.createElement('INPUT');


            this.searchField.addEventListener('change', this.handleSearchChange);
            
            if (this.hasAttribute('search-label') && this.getAttribute('search-label') !== '') {
                this.searchField.setAttribute('placeholder', this.getAttribute('search-label'));
            }
            this.searchContainer.appendChild(this.searchField);
            this.container.appendChild(this.searchContainer);

        }

        if (this.slogans && this.slogans.length > 0) {
            this.container.appendChild(this.sloganDiv);
        }

        this.map.className = 'g-maps';
        this.map.setAttribute('id', 'map');

        this.container.appendChild(this.map);
        const additionalCss = `
             <style>
                .container {
                    width: 150px;
                    height: 150px;
                    position: relative;
                    perspective: 1000px;
                    
                }

                .card {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 1s;
         
                }

                .container:hover .card {
                    transform: rotateY(180deg);
                }

                .card .side {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                }

                .card .front {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .card .back {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    transform: rotateY(180deg);
                    background: #ffffff;
                
                }

                .card .back a {
                    color: #000000;
                }
                

                p {
                    margin: 0;
                }
                
                h2 {
                    margin: 0;
                }
                </style>`;


        this.markers = Array.from(this.shadowRoot.querySelectorAll('ms-a-g-maps-marker'))
            .map(m => {
                const content = m.getAttribute('img-src') ?
                    `${additionalCss}<div class="container">
                      <div class="card">
                        <div class="side front">
                         <img src="${m.getAttribute('img-src')}" />
                        </div>
                        <div class="side back">
                          ${m.innerHTML}
                        </div>
                      </div>
                    </div>` : m.innerHTML && m.innerHTML.trim() !== '' ? `
                        <div>
                            ${m.innerHTML}
                        </div>
                    ` : undefined;

                let res = {
                    lat: parseFloat(m.getAttribute('lat')),
                    lng: parseFloat(m.getAttribute('long')),
                    content: content,

                };

                if (m.getAttribute('icon')) res.icon = m.getAttribute('icon')

                m.innerHTML = '';
                return res;
            });

        const gMap = new google.maps.Map(this.map, {
            center: this.markers.length > 1 ? { lat: 46.8182, lng: 8.2275 } : { lat: this.markers[0].lat, lng: this.markers[0].lng },
            zoom: this.markers.length > 1 ? 8 : 12,
        });

        this.bounds = this.markers.length > 1 ? this.bounds = new google.maps.LatLngBounds() : undefined;

        if (this.bounds) {
            gMap.fitBounds(this.bounds);
        }

        this.markers.forEach(m => this.addMarker(gMap, m));

        this.map = gMap;
        this.html = this.container;
    }

    handleSearchChange = (event) => {
        if (!isNaN(event.target.value)) {
            this.filterMarkers(event.target.value, 5, this.getMarkers(), this.map);
        }
    }

    getMarkers = () => {
        
        return this.markers.map(m => {


            return new google.maps.Marker({
                position: { lat: m.lat, lng: m.lng },
                map: this.map,
                icon: m.icon,
                content: m.content,
            });
        });

    } 
    

    filterMarkers(postcode, radius, markers, map) {

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': postcode }, function (results, status,) {
            if (status === 'OK') {
                var center = results[0].geometry.location;

                for (var i = 0; i < markers.length; i++) {
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(markers[i].getPosition(), center);

                    if (distance < radius) {
                        markers[i].setVisible(true);
                    } else {
                        debugger;
                        markers[i].setVisible(false);
                    }
                }

                map.setCenter(center);
                map.setZoom(11);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
};