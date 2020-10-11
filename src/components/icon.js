import Leaflet from 'leaflet';

const icon = new Leaflet.Icon({
    iconUrl: require('../marker.svg'),
    iconRetinaUrl: require('../marker.svg'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new Leaflet.Point(60, 75),
    className: 'leaflet-div-icon'
});

export { icon };