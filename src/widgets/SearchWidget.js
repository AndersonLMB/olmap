
import { GeoUtil } from "../util/GeoUtil";
import { NetUtil } from "../util/NetUtil";
import proj4 from "proj4";
import Overlay from "ol/Overlay";

class SearchWidget {

    constructor(target) {
        // var id = `sw${Date.now()}`;
        // this.element.id = id;
        this.element = target;
        this.mapComponent = {};
        this.formElement = document.createElement("div");
        this.inputElement = document.createElement("input");
        this.commitElement = document.createElement("button");
        this.initializeUI();
    }

    initializeUI() {
        var self = this;
        this.element.append(this.formElement);
        this.formElement.append(this.inputElement);
        this.formElement.classList.add("searchForm");
        this.inputElement.classList.add("searchBtn");
        this.inputElement.onkeyup = function (evt) {
            if (evt.keyCode === 13) {
                self.searchClicked(evt);
            }
        };

        this.inputElement.onfocus = (evt) => {
            // console.log(evt);
            self.element.classList.add("focused");
        }

        this.formElement.append(this.commitElement);
        this.commitElement.classList.add("commitBtn");
        // this.commitElement.innerText = "Search";

        this.commitElement.onclick = function (evt) {
            self.searchClicked(evt);

        }

    }

    bindMapComponent(mapComponent) {
        this.mapComponent = mapComponent;
    }

    searchClicked(evt) {
        var self = this;
        var view = this.mapComponent.olMap.getView();
        var map = this.mapComponent.olMap;

        var extent = view.calculateExtent();
        var value = this.inputElement.value;
        // console.log(value);

        var fromProj = view.getProjection().getCode();
        var toProj = "EPSG:4326";

        var geoUtil = new GeoUtil();
        var toExtent = geoUtil.extentCoordinateTransform(fromProj, toProj, extent);
        // console.log(toExtent);
        var postObj = {
            keyWord: value,
            level: view.getZoom().toString(),
            mapBound: `${toExtent[0]},${toExtent[1]},${toExtent[2]},${toExtent[3]}`,
            queryType: "2",
            count: "10",
            start: "0"
        }

        var parameterObj = {
            postStr: JSON.stringify(postObj),
            type: "query"
        }

        var reqUrl = new NetUtil().parameterize(parameterObj, "http://api.tianditu.gov.cn/search");

        console.log(reqUrl);

        var xhr = new XMLHttpRequest();
        // xhr.addEventListener("load", this.searchHandler);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                self.searchHandler(xhr.responseText);
            }
        }
        xhr.open("GET", reqUrl);
        xhr.send();

        // console.log(postObj);
        // console.log(JSON.stringify(postObj));
    }

    searchHandler(a) {
        var obj = JSON.parse(a);
        console.log(obj);
        var poisArr = obj["pois"];

        poisArr.forEach((val, idx) => {
            var lonlatSplit = val["lonlat"].split(" ");
            var lonlat = [parseFloat(lonlatSplit[0]), parseFloat(lonlatSplit[1])];
            var projPos = proj4("EPSG:4326", this.mapComponent.olMap.getView().getProjection().getCode(), lonlat);
            var element = document.createElement("a");
            element.classList.add("overlayElement");
            element.innerHTML = `${val["name"]}`;
            document.body.append(element);

            var overlay = new Overlay({
                position: projPos,
                element: element
            });
            // var lonlat  = [          ]
            this.mapComponent.olMap.addOverlay(overlay);
        });
    }




}

export { SearchWidget };