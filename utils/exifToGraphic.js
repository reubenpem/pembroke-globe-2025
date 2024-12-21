define([
    "esri/Graphic",
    "esri/geometry/Point",
], function(Graphic, Point, url, id) {
    return new Promise((resolve, reject) => {
        const image = document.createElement("img");
        image.src = url;
        image.onload = () => {
            image.load = image.onerror = null;
            EXIF.getData(image, function() {

                const latitude = EXIF.getTag(this, "GPSLatitude");
                const latitudeDirection = EXIF.getTag(this, "GPSLatitudeRef");
                const longitude = EXIF.getTag(this, "GPSLongitude");
                const longitudeDirection = EXIF.getTag(this, "GPSLongitudeRef");

                if(!latitude || !longitude){
                    reject(new Error("Photo doesn't contain GPS information: ", this.src));
                    return;
                }

                const location = new Point({
                    latitude: dmsDD(latitude, latitudeDirection),
                    longitude: dmsDD(longitude, longitudeDirection)
                });

                resolve(new Graphic({
                    geometry: location,
                    attributes: {
                        url: url,
                        OBJECTID: id
                    }
                }));
            });
        };

        image.onerror = () => {
            image.load = image.onerror = null;
            reject(new Error("Error while loading the image"));
        }

        // Converts a DMS coordinate to decimal degrees
        function dmsDD([degrees, minutes, seconds], direction) {
            let dd = degrees + (minutes/60) + (seconds/3600);
            if (direction === "S" || direction === "W") {
                dd *= -1;
            }
            return dd;
        }
    });
});