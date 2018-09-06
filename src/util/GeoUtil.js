import proj4 from "proj4";

class GeoUtil {
    constructor() { }

    extentCoordinateTransform(fromProj, toProj, extent) {
        var fromLb = [extent[0], extent[1]];
        var fromRt = [extent[2], extent[3]];
        var toLb = proj4(fromProj, toProj, fromLb);
        var toRt = proj4(fromProj, toProj, fromRt);
        return [toLb[0], toLb[1], toRt[0], toRt[1]];
    }
}

export { GeoUtil };