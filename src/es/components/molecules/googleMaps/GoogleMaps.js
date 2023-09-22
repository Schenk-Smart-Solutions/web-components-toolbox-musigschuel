import { Shadow } from '../../web-components-toolbox/src/es/components/prototypes/Shadow.js';

export default class GoogleMaps extends Shadow() {

    bounds = undefined;


    constructor(...args) {
        super(...args);
    }


    connectedCallback() {
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
            div.g-maps {
                height: 50vh;
                color: #000000;
            }
            div.g-maps  button {
                color: red;
                background-color: #000000;
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

    renderMap() {
        this.container = document.createElement('DIV');
        this.map = document.createElement('DIV');
        this.searchField = document.createElement('INPUT');
        this.searchField.addEventListener('change', this.handleSearchChange);
        this.container.appendChild(this.searchField);
        this.map.className = 'g-maps';
        this.map.setAttribute('id', 'map');
        this.container.appendChild(this.map);

        const gMap = new google.maps.Map(this.map, {
            center: { lat: 46.8182, lng: 8.2275 },
            zoom: 8,
        });


        const additionalCss = `
             <style>
                .container {
                    width: 300px;
                    height: 300px;
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
                    background: url('your-image-url');
                }

                .card .back {
                    background: #f8f8f8;
                    transform: rotateY(180deg);
                }
                </style>`;


        this.markers = Array.from(this.shadowRoot.querySelectorAll('ms-a-g-maps-marker'))
            .map(m => {
                let res = {
                    lat: parseFloat(m.getAttribute('lat')),
                    lng: parseFloat(m.getAttribute('long')),
                    content: `${additionalCss}<div class="container">
                      <div class="card">
                        <div class="side front">
                         <img src="${m.getAttribute('img-src')}" />
                        </div>
                        <div class="side back">
                          ${m.innerHTML}
                        </div>
                      </div>
                    </div>`,

                };

                if (m.getAttribute('icon')) res.icon = m.getAttribute('icon')

                m.innerHTML = '';
                return res;
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

    getMarkers = () =>  this.markers.map(m => new google.maps.Marker({
            position: { lat: m.lat, lng: m.lng },
            map: this.map,
            icon: m.icon
        }));
    

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