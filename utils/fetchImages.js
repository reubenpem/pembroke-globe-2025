define([
    "utils/exifToGraphic.js",
    "esri/core/promiseUtils"
], function(exifToGraphic, promiseUtils) {
    const numPhotos = 18;
    const graphicPromises = [];
    const baseUrl = "https://arcgis.github.io/arcgis-samples-javascript/sample-data/featurelayer-collection/photo-";

    for (let i = 1; i <= numPhotos; i++){
        const url = baseUrl + i.toString() + ".jpg";
        const graphicPromise = exifToGraphic(url, i);
        graphicPromises.push(graphicPromise);
    }

    return promiseUtils.eachAlways(graphicPromises);
});