import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import Feature from 'https://cdn.skypack.dev/ol/Feature.js';
import Point from 'https://cdn.skypack.dev/ol/geom/Point.js';
import { Style, Icon } from 'https://cdn.skypack.dev/ol/style.js';
import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import XYZ from 'https://cdn.skypack.dev/ol/source/XYZ.js';
import BingMaps from 'https://cdn.skypack.dev/ol/source/BingMaps.js';

// Initialize the map
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([-98.5795, 39.8283]), // Centered on the US
        zoom: 4
    })
});

// Create vector source and layer for markers
const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
    source: vectorSource
});
map.addLayer(vectorLayer);

// Helper function to apply small offsets to coordinates
function applyOffset(lat, lon, index) {
    const offset = 0.0001 * (index * 4);  // Adjust this value for more or less offset
    return [lon + offset, lat + offset];
}

// Fetch and add pin points from location.json
fetch('locations.json')
    .then(response => response.json())
    .then(data => {
        data.forEach((location, index) => {
            const coordinates = applyOffset(location.latitude, location.longitude, index);

            const feature = new Feature({
                geometry: new Point(fromLonLat(coordinates)),
                name: location.name,
                area: location.area,
                city: location.city
            });

            feature.setStyle(new Style({
                image: new Icon({
                    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                    scale: 0.5
                })
            }));

            vectorSource.addFeature(feature);
        });
    })
    .catch(error => console.error('Error loading JSON:', error));


// Popup overlay
const popup = new Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    offset: [0, -10]
});
map.addOverlay(popup);

const popupElement = popup.getElement();
popupElement.className = 'ol-popup';
popupElement.innerHTML = '<a href="#" id="popup-closer">&times;</a><div id="popup-content"></div>';

const popupCloser = popupElement.querySelector('#popup-closer');
popupCloser.onclick = function () {
    popup.setPosition(undefined);
    popupCloser.blur();
    return false;
};

// Click event to show popup
map.on('click', function (evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        const popupContent = popupElement.querySelector('#popup-content');
        popupContent.innerHTML = `<h3>${feature.get('name')}</h3><p>Location: ${feature.get('area')}, ${feature.get('city')}</p>`;
    }
});

// Dropdown to change map type
const mapTypeSelector = document.getElementById('mapTypeSelector');

function changeMapType(mapType) {
    // Remove only the base layer, keep vector layer
    const layers = map.getLayers().getArray();
    if (layers.length > 1) {
        map.removeLayer(layers[0]); // Remove only the first layer (base layer)
    }

    let newBaseLayer;
    switch (mapType) {
        case 'osm':
            newBaseLayer = new TileLayer({
                source: new OSM()
            });
            break;
        case 'google':
            newBaseLayer = new TileLayer({
                source: new XYZ({
                    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                    attributions: '© Google Maps'
                })
            });
            break;
        default:
            newBaseLayer = new TileLayer({
                source: new OSM()
            });
    }

    // Add the new base layer but keep the vector layer
    map.getLayers().insertAt(0, newBaseLayer);
}


mapTypeSelector.addEventListener('change', function () {
    changeMapType(this.value);
});