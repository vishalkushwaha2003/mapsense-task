import { useEffect, useState } from "react";
import Chip from '@mui/material/Chip';

// Define the type for your GeoJSON data
interface GeoJsonData {
  type: string;
  name: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    properties: Record<string, any>;
  }[];
}

function LayersItems() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonData | null>(null);

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

  return <div className="p-2 flex justify-center"><Chip label={geoJsonData!==null && geoJsonData.name} className="hover:cursor-pointer hover:bg-slate-400 duration-100" /></div>;
}

export default LayersItems;
