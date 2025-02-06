require(
    [
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/TileLayer",
        "esri/layers/GeoJSONLayer",
        "esri/Basemap",
        "utils/ExaggeratedElevationLayer",
        "esri/Graphic",
        "esri/core/promiseUtils",
        "esri/geometry/Point",
        "esri/rest/locator"
    ],function (
        Map, SceneView,
        TileLayer, GeoJSONLayer,
        Basemap, ExaggeratedElevationLayer,
        Graphic, promiseUtils,
        Point) {
      const R = 6358137; // approx radius of Earth in m
      const offset = 300000; // offset from the ground used for the clouds
        
      const basemap = new Basemap({
        baseLayers: [
          new TileLayer({
            //url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/terrain_with_heavy_bathymetry/MapServer"
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
          })
        ]
      });

      const map = new Map({
        //basemap: "topo-3d",
        basemap: basemap,
        ground: "world-elevation"
      });

      const view = new SceneView({
        container: "viewDiv",
        map: map,
        alphaCompositingEnabled: true,
        qualityProfile: "high",
        camera: {
          position: [-55.03975781, 14.94826384, 19921223.30821],
          heading: 2.03,
          tilt: 0.13
        },
        environment: {
          background: {
            type: "color",
            color: [255, 252, 244, 0]
          },
          starsEnabled: false,
          atmosphereEnabled: false,
          lighting: {
            directShadowsEnabled: false,
            date: "Sun Jun 23 2019 19:19:18 GMT+0200 (Central European Summer Time)"
          }
        },
        constraints: {
          altitude: {
            min: 10000000,
            max: 25000000
          }
        },
        popup: {
          dockEnabled: true,
          dockOptions: {
            position: "top-right",
            breakpoint: false,
            buttonEnabled: false
          },
          collapseEnabled: false
        },
        highlightOptions: {
          color: [255, 255, 255],
          haloOpacity: 0.5
        }
      });

      map.ground.layers = [new ExaggeratedElevationLayer({
        exaggerationBathymetry: 60,
        exaggerationTopography: 40
      })];

      const origin = new Point({
        x: 0, y: -90, z: -(2 * R)
      });

      const oceanSurface = new Graphic({
        geometry: origin,
        symbol: {
          type: "point-3d",
          symbolLayers: [{
            type: "object",
            resource: {
              href: "./sphere/scene.gltf"
            },
            width: 2 * R
          }]
        }
      });

      view.graphics.add(oceanSurface);

      const blob = new Blob([JSON.stringify()], {
        type: "application/json"
      });
      // URL reference to the blob
      const url = URL.createObjectURL(blob);

      const dv_scale_Layer = new GeoJSONLayer({
        url: "./data/pembroke_alumni.geojson",
        elevationInfo: {
          mode: "absolute-height",
          offset: offset
        },
        popupEnabled: true,
        popupTemplate: {
          title: "{NAME}",
          content: `
            <div class="popupImage">
              <img src="{imageUrl}"/>
            </div>
            <div class="popupDescription">
                <p class="info">
                    {facts}
                </p>
            </div>
          `
        }
      });

      map.layers.add(dv_scale_Layer);
      //rotate();

      let clicked = false;
      view.on("click", (event) => {
        view.hitTest(event).then(({results}) => {
          rotate();
          console.log("clicked? ", clicked);
          //const camera = view.camera.clone();
          console.log("current longitude: ", camera.position.longitude);
          console.log("current latitude: ", camera.position.latitude);

        }).catch((error) => {
          console.error(error);
        });
        clicked = !clicked;
      });

      function rotate() {
        console.log("In rotate, clicked: ", clicked);
        if (!view.interacting && clicked) {
          const camera = view.camera.clone();
          camera.position.longitude -= 0.1;
          view.goTo(camera, { animate: false });
          requestAnimationFrame(rotate);
        }
      }
    });
