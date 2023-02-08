import React, { useState,useRef,useMemo,useEffect } from "react";
import "./map.css";
import { MapContainer, TileLayer, Marker,Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import Markers from "./Markers";

export const icon = new Icon({
  iconUrl: "./glowing-dot.png",
  iconSize: [50, 50],
});

export const iconMarker = new Icon({
  iconUrl: "./map-marker-gif-three.gif",
  iconSize: [110, 80],
});

const center = [12.971599, 77.594566];

function Map(props) {
  const markerRef = useRef(null);


  const [markerhide, setmarkerhide] = useState(false);
  const [latpoints, setlatpoints] = useState();
  const [lngpoints, setlngpoints] = useState();
  const [dynamicpos, setdynamicpos] = useState();
  const [northtEastbound,setnorthtEastbound] = useState();
  const [southwestbound,setsouthwestbound] = useState();

  const getmap = (hide, pos, map,northtEastbound,southwestbound) => {
    setmarkerhide(hide);
    setdynamicpos(pos);
    setlatpoints(pos.lat);
    setlngpoints(pos.lng);
    setnorthtEastbound(northtEastbound);
    setsouthwestbound(southwestbound);
  };

  const eventHandlers = useMemo(()=>({  
        dragend(){
        const marker = markerRef.current;
        setlatpoints(marker.getLatLng().lat);
        setlngpoints(marker.getLatLng().lng);
      },
    }),[]);

    useEffect(() => {
      props.getcoordinatepoint(latpoints,lngpoints,northtEastbound,southwestbound);
    }, [latpoints,lngpoints])

    const getdataa = (data)=>{
    props.getrelateddata(data)
    }
   
  return (
    < div style={{height:"800px"}}>
      <MapContainer
        className="map-container"
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          width={"500px"}
        />
        <Markers getmap={getmap} getdataa={getdataa} relatedlayer={props.relatedlayer}/>

        {markerhide ? (
          <Marker
            position={dynamicpos}
            draggable="true"
            eventHandlers={eventHandlers}
            icon={iconMarker}
            ref={markerRef}
          >
            // <Tooltip>You can also drag the marker to get next location</Tooltip>
          </Marker>
        ) : (
          ""
        )}
      </MapContainer>
      </div>
    
  
  );
}
export default Map;
