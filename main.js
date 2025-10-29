require([
 "esri/Map",
 "esri/views/MapView",
 "esri/core/Collection",
 "esri/layers/GroupLayer",
 "esri/layers/FeatureLayer",
 "esri/layers/MapImageLayer",
 "esri/widgets/LayerList",
 "esri/support/actions/ActionButton",
 "esri/widgets/Home",
 "esri/widgets/Print",
 "esri/widgets/Expand",
 "esri/widgets/ScaleBar",
 "esri/widgets/Compass",
 "esri/Basemap",
 "esri/widgets/BasemapGallery"
], function(
 Map,
 MapView,
 Collection,
 GroupLayer,
 FeatureLayer,
 MapImageLayer,
 LayerList,
 ActionButton,
 Home,
 Print,
 Expand,
 ScaleBar,
 Compass,
 Basemap,
 BasemapGallery
) {







 // 1. Define Map Layers
 // Create layer showing sample data for the United States.
 const USALayer0 = new FeatureLayer({
  url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0",
  title: "US Sample Data Cities",
  visible: true
 });
 const USALayer1 = new FeatureLayer({
  url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1",
  title: "US Sample Data Highways",
  visible: true
 });
 const USALayer2 = new FeatureLayer({
  url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2",
  title: "US Sample Data States",
  visible: true
 });
 const USALayer3 = new FeatureLayer({
  url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3",
  title: "US Sample Data Counties",
  visible: false
 });

 // ~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
 // Create layer showing sample census data for the United States.
 const censusLayer0 = new FeatureLayer({
  url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer0",
  title: "US Sample Census Block Points",
  visible: true,
 });
 const censusLayer1 = new FeatureLayer({
  url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer1",
  title: "US Sample Census Block Group",
  visible: true,
 });
 const censusLayer2 = new FeatureLayer({
  url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer2",
  title: "US Sample Census Counties",
  visible: true,
 });
 const censusLayer3 = new FeatureLayer({
  url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer3",
  title: "US Sample Census States",
  visible: true,
 });


 // Create GroupLayer with exclusive visibility mode
 const demographicGroupLayer1 = new GroupLayer({
  title: "US Demographics 1",
  visible: true,
  //visibilityMode: "exclusive",
  layers: [USALayer0,USALayer1,USALayer2,USALayer3],
  //opacity: 0.75,
 });

 const demographicGroupLayer2 = new GroupLayer({
  title: "US Demographics 2",
  visible: true,
  //visibilityMode: "exclusive",
  layers: [censusLayer0, censusLayer1, censusLayer2, censusLayer3],
  //opacity: 0.75,
 });







 // 2. Initialize Map and MapView Widget
 const map = new Map({
  basemap: "gray-vector",
  layers: [
    demographicGroupLayer1
  ],
 });

 const view = new MapView({
  container: "viewDiv", // The ID of the div element in index.html
  map: map,
  center: [-98.5795, 39.8282],
  zoom: 4
 });

 view.ui.add("logoDiv", "bottom-right");

 const basemapGallery = new BasemapGallery({
      view: view
  });

  let expandBG = new Expand({
    view: view,
    content: basemapGallery,
    expandIcon: "basemap",
    group: "bottom-right"
  });
  view.ui.add(expandBG, "bottom-right");

 // the button that triggers area selection mode
 const screenshotBtn = document.getElementById("screenshotBtn");

 // the orange mask used to select the area
 const maskDiv = document.getElementById("maskDiv");

 // element where we display the print preview
 const screenshotDiv = document.getElementById("screenshotDiv");

 // the button that triggers download
 const downloadBtn = document.getElementById("downloadBtn");

 // the button to hide the print preview html element
 const closeBtn = document.getElementById("closeBtn");

 // replace the navigation elements with screenshot area selection button
 view.ui.empty("bottom-left");
 view.ui.add(screenshotBtn, "bottom-left");

 // 3. Define Helper Functions for LayerList
 // function createOpacitySliderPanel(item) {
 //  const label = document.createElement("calcite-label");
 //  label.innerText = "Opacity";
 //  label.scale = "s";

 //  const slider = document.createElement("calcite-slider");
 //  slider.labelHandles = true;
 //  slider.labelTicks = true;
 //  slider.min = 0;
 //  slider.minLabel = "0";
 //  slider.max = 1;
 //  slider.maxLabel = "1";
 //  slider.scale = "s";
 //  slider.step = 0.01;
 //  slider.value = item.layer.opacity || 1; 

 //  slider.addEventListener("calciteSliderChange", () => {
 //   item.layer.opacity = parseFloat(slider.value);
 //  });

 //  label.appendChild(slider);
 //  return label;
 // }


 // 4. Configure LayerList Widget
 const layerList = new LayerList({
  view: view,
  // --- FEATURE ENHANCEMENT START ---
  // Explicitly enable the filter/search box
  visibleElements: {
   filter: true,
   heading: true,
   headingLevel: 3,
   collapseButton: true
  },
  filterPlaceholder : "Filter layers"
  
  // The 'LayerList' Title and the Collapse button are included by default
  // when the widget is added to the view.ui, provided a filter is active
  // or the widget has other header elements.
  // --- FEATURE ENHANCEMENT END ---
  
  // listItemCreatedFunction: (event) => {
  //  const item = event.item;
  //  const layer = item.layer;

  //  // A. Add custom ActionButtons to the GroupLayer ("US Demographics")
  //  if (item.title === "US Demographics") {

  //   item.actionsSections = new Collection([
  //    new Collection([ // First Group: Navigation/Information
  //     new ActionButton({
  //      title: "Go to full extent",
  //      icon: "zoom-out-fixed",
  //      id: "full-extent",
  //     }),
  //     new ActionButton({
  //      title: "Layer information",
  //      icon: "information",
  //      id: "information",
  //     }),
  //    ]),
  //    new Collection([ // Second Group: Opacity Control
  //     new ActionButton({
  //      title: "Increase opacity",
  //      icon: "chevron-up",
  //      id: "increase-opacity",
  //     }),
  //     new ActionButton({
  //      title: "Decrease opacity",
  //      icon: "chevron-down",
  //      id: "decrease-opacity",
  //     }),
  //    ]),
  //   ]);

  //  }

  //  // B. Add Opacity Panel to individual MapImageLayers
  //  if (layer.type === "map-image") {
  //   item.panel = {
  //    content: createOpacitySliderPanel(item),
  //    icon: "sliders-horizontal",
  //    title: "Change layer opacity",
  //   };
  //  }

  // },

 });

 // 5. Place Widgets on the View

 // Add the LayerList widget to the top-right corner of the map view
 view.ui.add(layerList, "top-left");

 // Add a Home button widget
 view.ui.add(new Home({ view: view }), "top-right");

 view.ui.move("zoom", "top-trailing");

 const compassWidget = new Compass({
        view: view,
  });

 // Add the Compass widget to the top left corner of the view
 view.ui.add(compassWidget, "top-right");

 // Add the Print widget to the bottom-right corner of the map view
 const print = new Print({
  view: view,
  allowedFormats: ["png"],
  printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
 });

 const expandP = new Expand({
  view: view,
  content: print,
  expandIcon: "print"
 });

 view.ui.add(expandP, "bottom-right");

 // 6. Handle LayerList Action Events
 // layerList.on("trigger-action", (event) => {
 //  const visibleLayer = USALayer.visible ? USALayer : censusLayer;
 //  const { id } = event.action;

 //  switch (id) {
 //   case "full-extent":
 //    view.goTo(visibleLayer.fullExtent).catch((error) => {
 //     if (error.name !== "AbortError") {
 //      console.error(error);
 //     }
 //    });
 //    break;

 //   case "information":
 //    window.open(visibleLayer.url);
 //    break;

 //   case "increase-opacity":
 //    if (demographicGroupLayer.opacity < 1) {
 //     demographicGroupLayer.opacity = Math.min(1, demographicGroupLayer.opacity + 0.25);
 //    }
 //    break;

 //   case "decrease-opacity":
 //    if (demographicGroupLayer.opacity > 0) {
 //     demographicGroupLayer.opacity = Math.max(0, demographicGroupLayer.opacity - 0.25);
 //    }
 //    break;
 //  }
 // });

  const scaleBar = new ScaleBar({
   view: view,
   style: "line",
    unit: "metric"
  });

  const scaleBarExpand = new Expand({
   view: view,
   content: scaleBar,
   expandIcon: "measure-line"
  });
  view.ui.add(scaleBarExpand, "bottom-left");
  

  // add an event listener to trigger the area selection mode
      screenshotBtn.addEventListener("click", () => {
        screenshotBtn.classList.add("active");
        view.container.classList.add("screenshotCursor");
        let area = null;

        // listen for drag events and compute the selected area
        const dragHandler = view.on("drag", (event) => {
          // prevent navigation in the view
          event.stopPropagation();

          // when the user starts dragging or is dragging
          if (event.action !== "end") {
            // calculate the extent of the area selected by dragging the cursor
            const xmin = clamp(Math.min(event.origin.x, event.x), 0, view.width);
            const xmax = clamp(Math.max(event.origin.x, event.x), 0, view.width);
            const ymin = clamp(Math.min(event.origin.y, event.y), 0, view.height);
            const ymax = clamp(Math.max(event.origin.y, event.y), 0, view.height);
            area = {
              x: xmin,
              y: ymin,
              width: xmax - xmin,
              height: ymax - ymin,
            };
            // set the position of the div element that marks the selected area
            setMaskPosition(area);
          }
          // when the user stops dragging
          else {
            // remove the drag event listener from the SceneView
            dragHandler.remove();
            // the screenshot of the selected area is taken
            let pixelRatio = 2;
            view.takeScreenshot({ width: view.width * pixelRatio, height: view.height * pixelRatio, area: area, format: "png" }).then((screenshot) => {
              // display a preview of the image
              showPreview(screenshot);

              // create the image for download
              downloadBtn.onclick = () => {
                const text = document.getElementById("textInput").value;
                // if a text exists, then add it to the image
                if (text) {
                  const dataUrl = getImageWithText(screenshot, text);
                  downloadImage("screenshot.png", dataUrl);
                }
                // otherwise download only the webscene screenshot
                else {
                  downloadImage("screenshot.png", screenshot.dataUrl);
                }
              };

              // the screenshot mode is disabled
              screenshotBtn.classList.remove("active");
              view.container.classList.remove("screenshotCursor");
              setMaskPosition(null);
            });
          }
        });

        function setMaskPosition(area) {
          if (area) {
            maskDiv.classList.remove("hide");
            maskDiv.style.left = `${area.x}px`;
            maskDiv.style.top = `${area.y}px`;
            maskDiv.style.width = `${area.width}px`;
            maskDiv.style.height = `${area.height}px`;
          } else {
            maskDiv.classList.add("hide");
          }
        }

        function clamp(value, from, to) {
          return value < from ? from : value > to ? to : value;
        }
      });

      // creates an image that will be appended to the DOM
      // so that users can have a preview of what they will download
      function showPreview(screenshot) {
        screenshotDiv.classList.remove("hide");
        // add the screenshot dataUrl as the src of an image element
        const screenshotImage = document.getElementsByClassName("js-screenshot-image")[0];
        screenshotImage.src = screenshot.dataUrl;
      }

      // returns a new image created by adding a custom text to the webscene image
      function getImageWithText(screenshot, text) {
        const imageData = screenshot.data;

        // to add the text to the screenshot we create a new canvas element
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = imageData.height;
        canvas.width = imageData.width;

        // add the screenshot data to the canvas
        context.putImageData(imageData, 0, 0);
        context.font = "20px Arial";
        context.fillStyle = "#000";
        context.fillRect(0, imageData.height - 40, context.measureText(text).width + 20, 30);

        // add the text from the textInput element
        context.fillStyle = "#fff";
        context.fillText(text, 10, imageData.height - 20);

        return canvas.toDataURL();
      }

      function downloadImage(filename, dataUrl) {
        // the download is handled differently in Microsoft browsers
        // because the download attribute for <a> elements is not supported
        if (!window.navigator.msSaveOrOpenBlob) {
          // in browsers that support the download attribute
          // a link is created and a programmatic click will trigger the download
          const element = document.createElement("a");
          element.setAttribute("href", dataUrl);
          element.setAttribute("download", filename);
          element.style.display = "none";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        } else {
          // for MS browsers convert dataUrl to Blob
          const byteString = atob(dataUrl.split(",")[1]);
          const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });

          // download file
          window.navigator.msSaveOrOpenBlob(blob, filename);
        }
      }
      // hide the print preview html element on click
      closeBtn.addEventListener("click", () => {
        screenshotDiv.classList.add("hide");
      });
  
  
});