import 'ol/ol.css';
import { Map as Map, View } from 'ol';
import { Point } from "ol/geom";
import proj4 from "proj4";
import Overlay from "ol/Overlay";
import { SearchWidget } from "./widgets/SearchWidget";
import { MapStatus } from "./widgets/MapStatus";
import { MapComponent } from "./widgets/MapComponent";
import Feature from "ol/Feature";
import { Geometry } from "ol/geom"
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from "ol/source/XYZ";

import { register } from "ol/proj/proj4";
var me = document.getElementById("map");
var swe = document.getElementById("totalSearch");

proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
register(proj4);


var mapStatus = new MapStatus();
// var mapComponent = new MapComponent();


var map = new MapComponent(me);
var sw = new SearchWidget(swe);
sw.bindMapComponent(map);
mapStatus.dictionary.forEach(function (value, key, map) {
    console.log(key + value);
})

// const map = new Map({
//     target: me,
//     layers: [
//         new TileLayer({
//             source: new XYZ({
//                 url: "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}",

//             })
//         })
//     ],
//     view: new View({
//         extent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10],
//         center: [0, 0],
//         zoom: 1,
//         minZoom: 1
//     })
// });

window.navigator.geolocation.getCurrentPosition(function (a, b, c) {
    // alert(`${a.coords.longitude}  ${a.coords.latitude}`);
    let projPosition = proj4("EPSG:4326", map.olMap.getView().getProjection().getCode(), [a.coords.longitude, a.coords.latitude]);
    // alert(`${projPosition[0]}, ${projPosition[1]}`);
    // map.currentLocationLayer.getSource().addFeature(new Feature({
    //     geometry: new Point(projPosition)
    // }));
    var element = document.createElement("a");
    element.classList.add("overlayElement");
    element.innerHTML = "Location";
    document.body.append(element);
    map.olMap.addOverlay(new Overlay({
        position: projPosition,
        element: element
    }));
    setTimeout(function () {
        map.olMap.getView().setCenter(projPosition);
        map.olMap.getView().setZoom(14);
    }, 1000)

    // console.log(a);
    // console.log(b);
    // console.log(c);
});
var mm = new window.Map()

window.app = {};
var app = window.app;
// app.mc = mapComponent;
app.ms = mapStatus;
app.m = map;
app.mm = mm;
app.proj4 = proj4;