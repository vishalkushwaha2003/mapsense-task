import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import { fromLonLat, get as getProjection, toLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import Circle from "ol/geom/Circle";
import * as turf from "@turf/turf";
import MapBrowserEvent from "ol/MapBrowserEvent";

interface FeatureProperties {
  name: string;
  address: string;
  male: boolean;
  female: boolean;
  paymentRequired: boolean;
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
interface MainMapProp{
    radiusData: number;
}

const MainMap:React.FC<MainMapProp> = ({radiusData}) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonData | null>(null);

  const viewRef = useRef<View | null>(null);
  const mapRef = useRef<Map | undefined>(undefined);
  const markerSourceRef = useRef<VectorSource | null>(null);
  const pointSourceRef = useRef<VectorSource | null>(null);
  const circleRadiusRef = useRef<number>(100);
  const highlightedPointsRef = useRef<Feature[]>([]);
  const [highlightedPoints, setHighlightedPoints] = useState<Feature[]>([]);
  const [circleRadius, setCircleRadius] = useState<number>(radiusData);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverContent, setPopoverContent] =
    useState<FeatureProperties | null>(null);



  useEffect(() => {

      setCircleRadius(radiusData);


  },[radiusData])


//fetch check and set geojson data


  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await fetch(
          "src/components/data/toiletmap_sydney.geojson",
          {
            headers: {
              Accept: "application/geo+json",
            },
          }
        );

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





  useEffect(() => {
    if (geoJsonData && !mapRef.current) {
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(geoJsonData, {
          featureProjection: "EPSG:3857",
        }),
      });
      pointSourceRef.current = vectorSource;

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          const geometryType = feature.getGeometry()?.getType();
          let style;

          if (geometryType === "Point") {
            style = new Style({
              image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: "#ff0000" }),
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

            const text = feature.get("name");
            if (text) {
              style.setText(
                new Text({
                  text: text,
                  font: "12px Calibri,sans-serif",
                  fill: new Fill({ color: "#fff" }),
                  offsetX: 0,
                  offsetY: -10,
                  textAlign: "center",
                  textBaseline: "middle",
                })
              );
            }
          }

          return style;
        },
      });

      const drawSource = new VectorSource();
      const drawVector = new VectorLayer({
        source: drawSource,
        style: new Style({
          fill: new Fill({ color: "rgba(255, 255, 255, 0.2)" }),
          stroke: new Stroke({ color: "#2eca6f", width: 0 }),
          image: new CircleStyle({
            radius: 400,
            fill: new Fill({ color: "#2eca6f" }),
          }),
        }),
      });

      const markerSource = new VectorSource();
      const markerLayer = new VectorLayer({
        source: markerSource,
        style: (feature) => {
          const geometryType = feature.getGeometry()?.getType();
          if (geometryType === "Point") {
            return new Style({
              image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: "#0000ff" }),
                stroke: new Stroke({ color: "#fff", width: 2 }),
              }),
            });
          } else if (geometryType === "Circle") {
            const count = feature.get("count");
            return new Style({
              stroke: new Stroke({
                color: "#2eca6f",
                width: 2,
              }),
              fill: new Fill({
                color: "rgba(0, 255, 0, 0.1)",
              }),
              text: new Text({
                text: count !== undefined ? count.toString() : "",
                font: "24px Calibri,sans-serif",
                fill: new Fill({ color: "#000" }),
                textAlign: "center",
                offsetY: -20,
              }),
            });
          }
        },
      });
      markerSourceRef.current = markerSource;

      const view = new View({
        center: [12895536.850603264, -3757448.414444618],
        zoom: 17,
      });
      viewRef.current = view;

      const map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
          drawVector,
          markerLayer,
        ],
        view: view,
      });
      mapRef.current = map;

      map.on("singleclick", function (event) {
        const coordinates = event.coordinate;
        console.log("Cor:", coordinates);
        const projection = getProjection("EPSG:3857");

        const currentRadius = circleRadiusRef.current;

        if (projection && markerSourceRef.current && pointSourceRef.current) {
          highlightedPointsRef.current.forEach((point) => {
            point.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 5,
                  fill: new Fill({ color: "#ff0000" }),
                  stroke: new Stroke({ color: "#000", width: 1 }),
                }),
              })
            );
          });
          setHighlightedPoints([]);
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
              if (buffered) {
                return turf.booleanPointInPolygon(
                  turf.point(lonLatCoords),
                  buffered
                );
              }
            }
            return false;
          });

          // Style points within the circle
          points.forEach((olFeature) => {
            olFeature.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 8,
                  fill: new Fill({ color: "rgb(234 179 8)" }),
                  stroke: new Stroke({ color: "#000", width: 1 }),
                }),
              })
            );
          });

          // Update highlighted points state
          setHighlightedPoints(points);
          highlightedPointsRef.current = points;

          // Add features to source
          markerSourceRef.current.addFeature(marker);
          markerSourceRef.current.addFeature(circle);
          circle.set("count", points.length);
        }
      });

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
              name: properties.Name,
              male: properties.Male,
              female: properties.Female,
              address: properties.Address1,
              paymentRequired: properties.PaymentRequired,
            };

            setPopoverContent(content);
          }

          setPopoverVisible(true);

          if (popoverRef.current) {
            const pixel = map.getPixelFromCoordinate(coordinates);
            const left = pixel[0] + 280 + "px";
            const top = pixel[1] - 150 + "px";

            popoverRef.current.style.left = left;
            popoverRef.current.style.top = top;
          }
        } else {
          setPopoverVisible(false);
        }
      };

      map.on("pointermove", handleHover);

      map.on("loadstart", function () {
        map.getTargetElement().classList.add("spinner");
      });
      map.on("loadend", function () {
        map.getTargetElement().classList.remove("spinner");
      });
    }
  }, [geoJsonData]);

//   const radiusChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    
//     if (newRadius < 100 || newRadius > 3000) return;
//     setCircleRadius();
//     circleRadiusRef.current = newRadius; // Update the ref with the new value
//   };


  useEffect(()=>{

    if(radiusData < 100 || radiusData>3000)return;
    setCircleRadius(radiusData);
    circleRadiusRef.current = radiusData; 
  },[radiusData])

  return (
    <div className="flex">
      {/* <div className="w-[25vw] h-[100vh] pl-9 pt-10">
        <label htmlFor="radius">
          Radius of circle between 100 to 3000 meters
        </label>
        <input
          type="number"
          min={100}
          max={3000}
          className="border border-black px-2 py-1 rounded-lg w-40"
          name="radius"
          placeholder="Enter the radius "
          defaultValue={500}
          onChange={radiusChangeHandler}
        />
      </div> */}
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
          <div>
            <strong>Address:</strong> {popoverContent.address}
          </div>
          <div>
            <strong>Male:</strong> {popoverContent.male}
          </div>
          <div>
            <strong>Female:</strong> {popoverContent.female}
          </div>
          <div>
            <strong>Payment Required:</strong> {popoverContent.paymentRequired}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMap;
