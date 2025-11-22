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
 "esri/widgets/BasemapGallery",
 "esri/widgets/Legend",
  "esri/layers/support/LabelClass",
  "esri/PopupTemplate"
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
 BasemapGallery,
 Legend,
 LabelClass,
 PopupTemplate
) {


  // Helper function to create a dynamic popup template
  function createPopupTemplate(layer, fieldInfos) {
    layer.popupTemplate = new PopupTemplate({
      title: layer.title,
      content: [{
        type: "fields",
        fieldInfos: fieldInfos
      }]
    });
  }

   // 3. Define Helper Functions for LayerList
  function createOpacitySliderPanel(item) {
   const label = document.createElement("calcite-label");
   label.innerText = "Opacity";
   label.scale = "s";

   const slider = document.createElement("calcite-slider");
   slider.labelHandles = true;
   slider.labelTicks = true;
   slider.min = 0;
   slider.minLabel = "0";
   slider.max = 1;
   slider.maxLabel = "1";
   slider.scale = "s";
   slider.step = 0.01;
   slider.value = item.layer.opacity || 1; 

   slider.addEventListener("calciteSliderChange", () => {
    item.layer.opacity = parseFloat(slider.value);
   });

   label.appendChild(slider);
   return label;
  }
  
  // A function that executes each time a ListItem is created for a layer.
  function setLayerListActions(event) {
   const item = event.item;
   const layer = item.layer;

   // A. Add custom ActionButtons to the FeatureLayers to control panels
   if (item.layer.type === "feature") {

    item.actionsSections = new Collection([
     new Collection([
      new ActionButton({
       title: "Toggle legend",
       icon: "legend",
       id: "toggle-legend",
      }),
      new ActionButton({
        title: "Change layer opacity",
        icon: "sliders-horizontal",
        id: "toggle-opacity-slider"
      })
     ]),
    ]);

   }

   // For other layer types that are not group layers, show the legend panel by default.
   // Feature layer panels are handled by the actions above.
    if (item.layer.type !== "group" && item.layer.type !== "feature") {
      item.panel = {
        content: "legend",
        open: true,
      };
    }
  }

 // Create GroupLayer with exclusive visibility mode
 const demographicGroupLayer = new GroupLayer({
  title: "US Demographics Data",
  visible: true,
  layers: [
    new FeatureLayer({
    url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0",
    title: "US Cities",
    visible: true
    }),
    new FeatureLayer({
      url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1",
      title: "US Highways",
      visible: true
    }),
    new FeatureLayer({
      url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2",
      title: "US States",
      visible: true
    }),
    new FeatureLayer({
      url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3",
      title: "US Counties",
      visible: false
    })
  ]
 });

 // ~~~~~~~~~~~ DEFINE POP-UP TEMPLATES ~~~~~~~~~~~~~~~~
  createPopupTemplate(demographicGroupLayer.layers.getItemAt(0), [
    { fieldName: "AREANAME", label: "City" },
    { fieldName: "CLASS", label: "Class" },
    { fieldName: "ST", label: "State" },
    { fieldName: "CAPITAL", label: "Capital" },
    { fieldName: "POP2000", label: "Population" }
  ]);
  createPopupTemplate(demographicGroupLayer.layers.getItemAt(1), [
    { fieldName: "ROUTE", label: "Route" },
    { fieldName: "TYPE", label: "Type" },
    { fieldName: "LENGTH", label: "Length" },
    { fieldName: "TOLL_RD", label: "Toll Road" },
    { fieldName: "RTE_NUM1", label: "RTE NO 1" },
    { fieldName: "RTE_NUM2", label: "RTE NO 2" },
    { fieldName: "ADMN_CLASS", label: "ADMIN CLASS" }
  ]);
  createPopupTemplate(demographicGroupLayer.layers.getItemAt(2), [
    { fieldName: "STATE_NAME", label: "State" },
    { fieldName: "SUB_REGION", label: "Sub-Region" },
    { fieldName: "area", label: "Area" },
    { fieldName: "POP2000", label: "Population" },
    { fieldName: "POP00_SQMI", label: "Population Density" },
    { fieldName: "STATE_ABBR", label: "State Abbreviation" }
  ]);
  createPopupTemplate(demographicGroupLayer.layers.getItemAt(3), [
    { fieldName: "NAME", label: "Name" },
    { fieldName: "STATE_NAME", label: "State" },
    { fieldName: "area", label: "Area" },
    { fieldName: "POP2000", label: "Population" },
    { fieldName: "POP00_SQMI", label: "Population Density" }
  ]);

 // 2. Initialize Map and MapView Widget
 const map = new Map({
  basemap: "gray-vector",
  layers: [
    demographicGroupLayer
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


 // 4. Configure LayerList Widget
 const layerList = new LayerList({
  view: view,
  visibleElements: {
   filter: true,
   heading: true,
   headingLevel: 3,
   collapseButton: true
  },
  filterPlaceholder : "Filter layers",
  listItemCreatedFunction: setLayerListActions
 });

 view.ui.add(layerList, "top-left");

 view.ui.add(new Home({ view: view }), "top-right");

 view.ui.move("zoom", "top-trailing");

 const compassWidget = new Compass({
        view: view,
  });

 view.ui.add(compassWidget, "top-right");

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

 // Handle LayerList Action Events
 layerList.on("trigger-action", (event) => {
  const { id } = event.action;
  const item = event.item;

  switch (id) {
    case "toggle-legend":
        // If panel is already a legend, remove it.
        if (item.panel && item.panel.content === "legend") {
            item.panel = null;
        } else { // Otherwise, set panel to legend.
            item.panel = {
                content: "legend",
                open: true
            };
        }
        break;

    case "toggle-opacity-slider":
        const isSliderPanel = item.panel && item.panel.content && item.panel.content.nodeName === 'CALCITE-LABEL';
        // If panel is already a slider, remove it.
        if (isSliderPanel) {
            item.panel = null;
        } else { // Otherwise, set panel to slider.
            item.panel = {
                content: createOpacitySliderPanel(item),
                open: true
            };
        }
        break;
  }

 });

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