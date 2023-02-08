import React, { useState, useRef, useEffect } from "react";
import { Marker, useMap, WMSTileLayer } from "react-leaflet";
import { Icon, map } from "leaflet";
import Plot from "../Assets/Plot.svg";
import axios from "axios";
import L from "leaflet";
// export const icon = new Icon({
//   iconUrl: "./glowing-dot.png",
//   iconSize: [50, 50],
// });

export const icon = new Icon({
  iconUrl: Plot,
  iconSize: [50, 50],
});

const center = [12.971599, 77.594566];

// export function  Aminitieslayer_line({ relatedlayer }) {
//   console.log(`${relatedlayer}`)
//   const WMSLayerFeatures = {
//     layers: `${relatedlayer}`,
//     zIndex: 10,
//     transparent: true,
//     format: 'image/png',
//     maxZoom: 22,
//     tiled: true,
//     // cql_filter: "propertyId='" + Layoutid + "'"
//   };
//   // WMSLayerFeatures.layers = `${relatedlayer}`;
//   console.log(WMSLayerFeatures)
//    return  <WMSTileLayer url='https://103.66.50.180:8081/geoserver/psc/wms' {...WMSLayerFeatures} />;
// }

const Markers = (props) => {
  const markerRef = useRef(null);
  const [markerhide, setmarkerhide] = useState(false);
  const [pos, setpos] = useState([]);
  const [northtEastbound, setnorthtEastbound] = useState();
  const [southwestbound, setsouthwestbound] = useState();
  const [bounds, setbounds] = useState();
  const [wmslayerpresent, setwmslayerpresent] = useState();

  let map = useMap();

  map.addEventListener("click", (e) => {
    console.log("HIiiii");
    map.addEventListener("click", function () {
      map.removeLayer(
        L.tileLayer.wms("https://103.66.50.180:8081/geoserver/psc/wms", {
          layers: `kanakpurasoilmap`,
          transparent: true,
          // zIndex : 10,
          format: "image/png",
          maxZoom: 22,
          // tiled:true
        })
      );
    });

    let bounds = map.getBounds();
    if (!northtEastbound && !southwestbound) {
      setnorthtEastbound([bounds?._northEast.lat, bounds?._northEast.lng]);
      setsouthwestbound([bounds?._southWest.lat, bounds?._southWest.lng]);
    }
    setpos(e.latlng);
    setmarkerhide(true);
  });

  useEffect(() => {
    props.getmap(markerhide, pos, map, northtEastbound, southwestbound);
  }, [pos]);

  const [relateddata, setrelateddata] = useState([]);

  // console.log(map.getBounds())

  // console.log(bounds)

  useEffect(() => {
    let uppercorner = map.getBounds()?._northEast;
    let lowercorner = map.getBounds()?._southWest;
    setbounds({
      bbox: {
        lowerCorner: `${lowercorner.lng} ${lowercorner.lat}`,
        upperCorner: `${uppercorner.lng} ${uppercorner.lat}`,
      },
    });
  }, []);

  map.on("moveend", function () {
    let uppercorner = map.getBounds()?._northEast;
    let lowercorner = map.getBounds()?._southWest;
    setbounds({
      bbox: {
        lowerCorner: `${lowercorner.lng} ${lowercorner.lat}`,
        upperCorner: `${uppercorner.lng} ${uppercorner.lat}`,
      },
    });
  });

  useEffect(() => {
    if (props.relatedlayer) {
      setwmslayerpresent(props.relatedlayer);
      L.tileLayer
        .wms("https://103.66.50.180:8081/geoserver/psc/wms", {
          layers: `${props.relatedlayer}`,
          transparent: true,
          // zIndex : 10,
          format: "image/png",
          maxZoom: 22,
          // tiled:true
        })
        .addTo(map);
    }
  }, [props.relatedlayer]);

  useEffect(() => {
    axios
      .post("http://localhost:3000/bbox", bounds)
      .then((res) => {
        // console.log(res.data.data)
        setrelateddata(res.data.data);
        props.getdataa(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [bounds]);

  //
  return (
    <div className="move">
      <Marker position={center} ref={markerRef} icon={icon}></Marker>
    </div>
  );
};

export default Markers;
