import proj4 from "proj4";

class MapStatus {

    constructor() {
        this.dictionary = new Map();
        this.element = {};
        this.mapElement = {};
        this.mapComponent = {};
        this.dictionary.set("projection", "");
        this.dictionary.set("coordinate", " ");
        this.dictionary.set("geocoord", []);
        this.dictionary.set("extent", []);
        this.dictionary.set("resolution", "");
        this.dictionary.set("zoom", "");

    }

    getStatus(key) {
        return this.dictionary.get(key.toString().toLowerCase());
    }

    setStatus(key, value) {

        if (Array.isArray(value)) {
            value.forEach(function (val, idx) {


            });

        }

        this.dictionary.set(key.toString().toLowerCase(), value);
        this.updateElement();
    }

    bind(element) {
        this.element = element;


        // this.element.innerHTML = null;

    }

    bindMapComponent(mapComponent) {
        var self = this;
        this.mapComponent = mapComponent;
        // this.mapComponent.target.onmousemove = function (e) {
        //     var projCode = self.mapComponent.olMap.getView().getProjection().getCode()
        //     self.setStatus("projection", projCode);
        //     var projCoord = self.mapComponent.olMap.getCoordinateFromPixel([e.clientX, e.clientY]);
        //     self.setStatus("coordinate", projCoord);
        //     var geocoord = proj4(projCode, "EPSG:4326", projCoord);
        //     self.setStatus("geocoord", geocoord);

        //     var extent = self.mapComponent.olMap.getView().calculateExtent();
        //     self.setStatus("extent", extent);
        //     var resolution = self.mapComponent.olMap.getView().getResolution();
        //     self.setStatus("resolution", resolution);
        // }

        this.mapComponent.olMap.on("pointermove", function (e) {
            // console.log(e);
            var projCode = e.frameState.viewState.projection.code_;
            var projCoord = e.coordinate;
            var geocoord = proj4(projCode, "EPSG:4326", projCoord);
            var extent = e.frameState.extent;
            var resolution = e.frameState.viewState.resolution;

            self.setStatus("projection", projCode);
            self.setStatus("coordinate", projCoord);
            self.setStatus("geocoord", geocoord);
            self.setStatus("extent", extent);
            self.setStatus("resolution", resolution);


            // console.log(e);
        })
        this.mapComponent.olMap.on("moveend", function (e) {
            var extent = e.frameState.extent;
            var resolution = e.frameState.viewState.resolution;
            var zoom = e.frameState.viewState.zoom;
            self.setStatus("extent", extent);
            self.setStatus("resolution", resolution);
            self.setStatus("zoom", zoom);
        })

    }

    updateElement() {
        var self = this;
        var str = "";
        this.dictionary.forEach(function (value, key) {
            // console.log(value);

            if (Array.isArray(value)) {
                var newValue = "";
                value.forEach(function (val, idx) {
                    newValue += `${val.toString()} </br>`;
                });
                str += `<tr><td>${key}:</td><td>${newValue}</td></tr> \n`;
            } else {
                str += `<tr><td>${key}:</td><td>${value}</td></tr> \n`;
            }


        })
        str = `<table> ${str} </table>`;
        this.element.innerHTML = str;
        // console.log(str);
    }
}

export { MapStatus };