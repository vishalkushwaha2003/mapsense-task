import { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import { get as getProjection, toLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import Circle from "ol/geom/Circle";
import * as turf from "@turf/turf";
import MapBrowserEvent from "ol/MapBrowserEvent";


interface FeatureProperties {
  name: string;
  type: string;
  navigable: boolean;
  entryPoint: boolean;
  status: boolean;
}

interface FeatureGeometry {
  type: "Polygon" | "MultiPolygon" | "Point";
  coordinates: number[] | number[][][] | number[][][][];
}

interface GeoJsonFeature {
  type: "Feature";
  id: string;
  properties: FeatureProperties;
  geometry: FeatureGeometry;
}

interface GeoJsonData {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}
interface MainMapProp {
  radiusData: number;
  zoomValSlider: number;
  isFixSidebarItemClicked: boolean;
}

const MainMap: React.FC<MainMapProp> = ({
  radiusData,
  isFixSidebarItemClicked,
}) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonData | null>(null);

  const viewRef = useRef<View | null>(null);
  const mapRef = useRef<Map | undefined>(undefined);
  const markerSourceRef = useRef<VectorSource | null>(null);
  const pointSourceRef = useRef<VectorSource | null>(null);
  const circleRadiusRef = useRef<number>(100);
  const highlightedPointsRef = useRef<Feature[]>([]);

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverContent, setPopoverContent] =
    useState<FeatureProperties | null>(null);

 

  //fetch check and set geojson data

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await fetch("src/components/data/testData.geojson", {
          headers: {
            Accept: "application/geo+json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/geo+json")) {
          throw new Error("Response is not GeoJSON");
        }

        const data: GeoJsonData = await res.json();
        setGeoJsonData(data);
      } catch (error: unknown) {
        console.error("Fetch error:", error);
      }
    };

    fetchApi();
  }, []);



  //this is for map rendering useEffect
  useEffect(() => {

      //check the conditon of geojson data is present and the map is render or not 
    if (geoJsonData && !mapRef.current) {
      

      //vector source is used to check for vector geometric elements such as point, line , polygon basically for vector objects
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(geoJsonData, {
          featureProjection: "EPSG:3857",
        }),
      });
      pointSourceRef.current = vectorSource;


      //this is layer on which vectors are drawn
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        //style function for styling
        style: (feature) => {
          const geometryType = feature.getGeometry()?.getType();
          let style;
        // check for points and give style
          if (geometryType === "Point") {
            style = new Style({
              image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: "#0000ff" }),
                stroke: new Stroke({ color: "#000", width: 1 }),
              }),
            });
          } else {
            style = new Style({
              stroke: new Stroke({
                color: "#000",
                width: 0.5,
              }),
            });

           
          }

          return style;
        },
      });





   
//marker sourse is use for marker generation
      const markerSource = new VectorSource();
      //marker layer is used to drow or show the marker
      const markerLayer = new VectorLayer({
        source: markerSource,
        //give styling to the marker
        style: (feature) => {
          const geometryType = feature.getGeometry()?.getType();
          if (geometryType === "Point") {
            return new Style({
              image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: "#ff0000" }),
                stroke: new Stroke({ color: "#fff", width: 1 }),
              }),
            });
            //this is generation of circle around the marker
          } else if (geometryType === "Circle") {
            const count = feature.get("count");
            return new Style({
              stroke: new Stroke({
                color: "rgb(255,0,0)",
                width: 1,
              }),
              fill: new Fill({
                color: "rgba(255, 0, 0, 0.1)",
              }),
              text: new Text({
                text: count !== undefined ? count.toString() : "",
                font: "24px Calibri,sans-serif ",
                fill: new Fill({ color: "#f00" }),
                textAlign: "center",
                offsetY: -25,
              }),
            });
          }
        },
      });
      markerSourceRef.current = markerSource;
// this is for the view of the map set center and intial zoom level
      const view = new View({
        center: [12895536.850603264, -3757448.414444618],
        zoom: 17,
      });
      viewRef.current = view;

      // render the map with different properties below
      const map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
          
          markerLayer,
        ],
        view: view,
      });

      mapRef.current = map;



                
 //add interaction when sigle click
      map.on("singleclick", function (event) {
        const coordinates = event.coordinate;
      
        const projection = getProjection("EPSG:3857");

        const currentRadius = circleRadiusRef.current;

        if (projection && markerSourceRef.current && pointSourceRef.current) {
          highlightedPointsRef.current.forEach((point) => {
            point.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 5,
                  fill: new Fill({ color: "#0000ff" }),
                  stroke: new Stroke({ color: "#000", width: 1 }),
                }),
              })
            );
          });
          
          highlightedPointsRef.current = [];

          // Clear the previous marker and circle
          markerSourceRef.current.clear();

          // Convert radius to map units
          let radiusInMapUnits;
          if (projection) {
            const metersPerUnit = projection.getMetersPerUnit();
            if (metersPerUnit !== undefined) {
              radiusInMapUnits =
                (currentRadius + currentRadius / 10) / metersPerUnit;
            }
          }

          // Create marker and circle features
          const marker = new Feature({
            geometry: new Point(coordinates),
          });
          const circle = new Feature({
            geometry: new Circle(coordinates, radiusInMapUnits),
          });

          const lonLat = toLonLat(coordinates);
          const center = turf.point(lonLat);
          const radius = currentRadius / 1000;
          const buffered = turf.buffer(center, radius, { units: "kilometers" });

          // Extract the points from the vector source
          const olFeatures = pointSourceRef.current.getFeatures();
          const points = olFeatures.filter((olFeature) => {
            const geometry = olFeature.getGeometry();
            if (geometry && geometry.getType() === "Point") {
              const coords = (geometry as Point).getCoordinates();
              const lonLatCoords = toLonLat(coords);
              //locate the points on buffer
              if (buffered) {
                return turf.booleanPointInPolygon(
                  turf.point(lonLatCoords),
                  buffered
                );
              }
            }
            return false;
          });

          // Style points within the circle with yellow color
          points.forEach((olFeature) => {
            olFeature.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({ color: "rgb(234 179 8)" }),
                  stroke: new Stroke({ color: "#000", width: 1 }),
                }),
              })
            );
          });

          // Update highlighted points state
         
          highlightedPointsRef.current = points;

          // Add features to source
          markerSourceRef.current.addFeature(marker);
          markerSourceRef.current.addFeature(circle);
          circle.set("count", points.length);
        }
      });


      //now add content when hover on the point
      const handleHover = (event: MapBrowserEvent<PointerEvent>) => {
        const feature = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature
        );

        if (feature) {
          const properties = feature.getProperties();
          const coordinates = event.coordinate;

          if (properties) {
            const content: FeatureProperties = {
              name: properties.name,
              type: properties.sporttype,
              navigable: properties.navigable,
              status: properties.status,
              entryPoint: properties.entryPoint,
            };
           
            setPopoverContent(content);
          }

          setPopoverVisible(true);

          if (popoverRef.current) {
            const pixel = map.getPixelFromCoordinate(coordinates);

            

            let top = pixel[1] - 90 + "px";

            let left = pixel[0] + 80 + "px";

           

            popoverRef.current.style.display = "relative";
            popoverRef.current.style.left = left;

            popoverRef.current.style.top = top;
          }
        } else {
          setPopoverVisible(false);
        }
      };

      // event handler on pointermove
      map.on("pointermove", handleHover);
    }
  }, [geoJsonData, isFixSidebarItemClicked]);


    //set the radius data from the radiusData coming from the input value in toggle sidebar by prop drillings
  useEffect(() => {
    circleRadiusRef.current = radiusData;
  }, [radiusData]);

  return (
    <div className="flex">
      <div className="w-full h-[100vh]" id="map"></div>
      {popoverVisible && popoverContent && (
        <div
          ref={popoverRef}
          style={{
            position: "absolute",
            background: "white",
            border: "1px solid black",
            padding: "5px",
            borderRadius: "5px",
            pointerEvents: "none",
          }}
        >
          <div>
            <strong>Name:</strong> {popoverContent.name}
          </div>
          {popoverContent.type !== null ? (
            <div>
              <strong>Type:</strong> {popoverContent.type}
            </div>
          ) : (
            ""
          )}
          <div>
            <strong>Navigable:</strong>{" "}
            {popoverContent.navigable ? "Yes" : "No"}
          </div>
          <div>
            <strong>Entry Point:</strong>{" "}
            {popoverContent.entryPoint ? "Yes" : "No"}
          </div>
          <div>
            <strong>Status:</strong>{" "}
            {popoverContent.status ? "Active" : "Inactive"}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMap;
