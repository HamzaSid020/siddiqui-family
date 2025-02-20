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

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2
    })
});

const pinFeature = new Feature({
    geometry: new Point(fromLonLat([0, 0]))
});

pinFeature.setStyle(new Style({
    image: new Icon({
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        scale: 0.7
    })
}));

const vectorLayer = new VectorLayer({
    source: new VectorSource({
        features: [pinFeature]
    })
});

map.addLayer(vectorLayer);
