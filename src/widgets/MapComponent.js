import { Map as OlMap } from "ol";

import { MapStatus } from "../widgets/MapStatus";

import View from "ol/View"
import TileLayer from 'ol/layer/Tile';
import XYZ from "ol/source/XYZ";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer"

import OSM from "ol/source/OSM"

class MapComponent {
    constructor(target, options) {
        this.options = options;
        this.element = target;
        this.mapId = `map${Date.now()}`;
        var t = document.createElement("div");
        this.currentLocationLayer = "";
        this.element.append(t);
        t.id = this.mapId;
        t.classList.add("map");
        this.target = t;
        this.olMap = new OlMap({
            target: this.target,
            controls:[],
            view: new View({
                projection: "EPSG:3857",
                extent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10],
                center: [0, 0],
                zoom: 2,
                minZoom: 1,
                maxZoom: 18
            })
        });
        this.mapStatus = new MapStatus();
        this.initalize();
        // this.target.onmousemove = function (e) { console.log(e); }
    }


    initalize() {

        // this.target.onmousemove = this.mapElementOnMousemove;
        // targetElement.onmousemove = this.mapElementOnMousemove;
        // this.target.onmousemove = this.mapElementOnMousemove;
        this.olMap.on("moveend", this.mapMoveend);

        this._addLayer(new TileLayer({
            source: new XYZ({
                url: "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}",
                crossOrigin: 'anonymous',
            })
        }));
        this._addLayer(new TileLayer({
            source: new XYZ({
                url: "http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}",
                crossOrigin: 'anonymous',
            })
        }));
        this._addLayer(new TileLayer({
            source: new XYZ({
                url: "https://c.tiles.openrailwaymap.org/standard/{z}/{x}/{y}",
                // crossOrigin: 'anonymous',
            })
        }));
        //https://c.tiles.openrailwaymap.org/standard/14/13344/7112.png
        this.currentLocationLayer = new VectorLayer({
            source: new VectorSource({
                wrapX: false
            })
        });

        //http://localhost/tdt5/4/11/0_.png
        // this._addLayer(new TileLayer({
        //     source: new XYZ({
        //         url: "http://192.168.0.147/tdt5/{z}/{y}/{x}_.png",
        //        crossOrigin: 'anonymous',
        //     })
        // }));
        // this._addLayer(new TileLayer({
        //     source: new OSM()
        // }));
        let mapStatusElement = document.createElement("div");
        mapStatusElement.id = "mcms" + Date.now();
        mapStatusElement.className = "mcms";
        mapStatusElement.innerText = mapStatusElement.id;
        // window.setInterval(function () { mapStatusElement.innerText = mapStatusElement.id }, 0);

        this.element.append(mapStatusElement);
        console.log(mapStatusElement);
        // document.getElementById(mapStatusElement.id).innerText = "MCMS";
        this.mapStatus.bind(mapStatusElement);
        this.mapStatus.bindMapComponent(this);



    }

    mapElementOnMousemove(e) {

        var coordinate = this.olMap.getCoordinateFromPixel([e.clientX, e.clientY]);
        this.mapStatus.dictionary.set("coordinate", coordinate);
        console.log(this.mapStatus);


    }

    mapMoveend(evt) {
        console.log(evt);

    }

    _addLayer(layer) {
        this.olMap.addLayer(layer);
    }
}

export { MapComponent };




