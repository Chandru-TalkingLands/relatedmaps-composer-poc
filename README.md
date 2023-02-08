# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)







//marker.js
import React, { useState, useRef, useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import { Icon, map } from "leaflet";
import Plot from '../Assets/Plot.svg';
import axios from 'axios'
import L from 'leaflet'
// export const icon = new Icon({
//   iconUrl: "./glowing-dot.png",
//   iconSize: [50, 50],
// });

export const icon = new Icon({
  iconUrl: Plot,
  iconSize: [50, 50],
});


const center = [12.971599, 77.594566];

const Markers = (props) => {
  const markerRef = useRef(null);
  const [markerhide, setmarkerhide] = useState(false);
  const [pos, setpos] = useState([]);
  const [northtEastbound, setnorthtEastbound] = useState()
  const [southwestbound, setsouthwestbound] = useState()
  const [bounds, setbounds] = useState()
  const [relatedmaplayer,setrelatedmaplayer] = useState()

  let map = useMap();

  map.addEventListener("click", (e) => {
    let bounds = map.getBounds();
    if (!northtEastbound && !southwestbound) {
      setnorthtEastbound([bounds?._northEast.lat, bounds?._northEast.lng])
      setsouthwestbound([bounds?._southWest.lat, bounds?._southWest.lng])
    }
    setpos(e.latlng);
    setmarkerhide(true);
  });


  useEffect(() => {

    props.getmap(markerhide, pos, map, northtEastbound, southwestbound);
  }, [pos]);


  const [relateddata, setrelateddata] = useState([])

  // console.log(map.getBounds())

  // console.log(bounds)

  useEffect(() => {
    let uppercorner = map.getBounds()?._northEast;
    let lowercorner = map.getBounds()?._southWest;
    setbounds({

      "bbox": {
        "lowerCorner": `${lowercorner.lng} ${lowercorner.lat}`,
        "upperCorner": `${uppercorner.lng} ${uppercorner.lat}`,
      }
    })
  }, [])

  map.on('moveend', function () {
    let uppercorner = map.getBounds()?._northEast;
    let lowercorner = map.getBounds()?._southWest;
    setbounds({

      "bbox": {
        "lowerCorner": `${lowercorner.lng} ${lowercorner.lat}`,
        "upperCorner": `${uppercorner.lng} ${uppercorner.lat}`,
      }
    })

  });

  console.log(props.relatedlayer)
  

  //this code runs when related layer changes
  useEffect(() => {
    L.tileLayer.wms('https://103.66.50.180:8081/geoserver/psc/wms', {
      layers: `${props.relatedlayer}`,
      transparent: true,
      // zIndex : 10,
      format: 'image/png',
      maxZoom: 22,
      // tiled:true
    }).addTo(map);
  }, [props.relatedlayer])


  useEffect(() => {
    axios.post('http://localhost:3000/bbox', bounds)
      .then((res) => {
        // console.log(res.data.data)
        setrelateddata(res.data.data)
        props.getdataa(res.data.data)

      })
      .catch((err) => {
        console.log(err)
      })
  }, [bounds])



  //
  return (
    <div className="move">
      <Marker position={center} ref={markerRef} icon={icon} ></Marker>

    </div>
  );
};

export default Markers;



//composer.js
import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Map from "../Map/Map";
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

function Composer() {
  var Imageurl = `https://rdfolder.s3.ap-south-1.amazonaws.com/`;
  var countCards = -1;

  const [data, setData] = useState({
    title: "",
    img: "",
    description: "",
  });
  const [num, setnum] = useState(0);
  const [pushdata, setpushdata] = useState([]);
  const [coordinatepoint,setcoordinatepoint] = useState()
  const [bounds,setbounds] = useState()
  const [relateddata,setrelateddata] = useState()
  const [relatedlayer,setrelatedlayer] = useState('')


  //handle image change
  const handleImage = async (e) => {
    e.preventDefault();
    let imgName = e.target.files[0];
    const formData = new FormData();
    formData.append("file", imgName);

    let property_name = "Mysore";
    let sub_folder = "Tales";
    let category_name = "Amenities";

    try {
      const res = await axios.post(
        `http://localhost:7000/upload/${property_name}/${sub_folder}/${category_name}`,
        formData
      );
      console.log(res.data);
      setData(() => ({
        ...data,
        img: res.data,
        // setnum,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  //handle Inputs data change
  const handleInputs = (e) => {
    let value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  //add story to array
  const handleAddstory = (e) => {
    e.preventDefault();
    var val = 0;
    if (!coordinatepoint[0] || !data.title || !data.img) {
      alert("Please select marker and fill inputs");
    } else {
      setpushdata((prev) => [...prev, { ...data, id: uuidv4() }]);
      alert("Added Story");
      setData({
        title: "",
        img: "",
        description: "",
      });
      val = num + 1;
      setnum(val);
      return val + 1;
    }
  };

  //handle push story or save story
  const handlesaveStory = async (e) => {
    e.preventDefault();
      let property_name = "Mysore";
      let sub_folder = "Tales";
      let category_name = "Amenities";
      console.log(pushdata, "dataaaa");
      axios
        .post(
          `http://localhost:7000/create/json/${property_name}/${sub_folder}/${category_name}`,
          pushdata
        )
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
      alert("Added all Stories");
  };


  //checking code for Inputs
  const handleeditInputs = (e, cards, counter) => {
    const newData = e.target.value;
    setData({
      ...data,
      [e.target.name]: newData,
    });

    pushdata[counter] = {
      ...pushdata[counter],
      [e.target.name]: e.target.value,
    };
  };

  console.log(pushdata);

  //handle delete onClick
  const handleDelete = (e, object) => {
    e.preventDefault();
    let property_name = "Mysore";
    let sub_folder = "Tales";
    let category_name = "Amenities";
    let imgKey = object?.img;
    let imglength = imgKey.split("/").length;
    let file_key = imgKey.split("/")[imglength - 1];
    axios
      .delete(
        `http://localhost:7000/delete/file/${property_name}/${sub_folder}/${category_name}/${file_key}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
    let item = [];
    pushdata.filter((data) => {
      if (data.title != object.title) {
        item.push(data);
      }
    });
    setpushdata(item);
    console.log(pushdata);
    alert("Deleted Successfully");
  };

  //getting coordinates from map
  const getcoordinatepoint = (lat,lng,northbounds,southbounds)=>{
    setcoordinatepoint([lat,lng])
    setbounds({
      northbounds:northbounds,
      southbounds:southbounds
    })

   }

   const getrelateddata = (data) =>{
   console.log(data)
   setrelateddata(data)
   }


  // setting coordinates data
  useEffect(() => {
    if (coordinatepoint) {
      setData({
        ...data,
        coordinates: [coordinatepoint[0], coordinatepoint[1]],
        northbounds:bounds.northbounds,
        southbounds:bounds.southbounds
      });
    }
  }, [coordinatepoint]);

  const getLayers = (layer) =>{
    if(layer){
      setrelatedlayer(layer)
    }
 
console.log(layer)
  }



  return (
    <div className="composer">
      <div className="container">
        <div className="container-sidebar">
          <form>
            <div className="top-row">
              <h2 className="top-title-form">Related Map data</h2>
              {relateddata && relateddata.map(d =>{
                return(
                  <ul className="rel-data">
                  <p>{d.title}</p>
                  <p>{d.description}</p>
                  <p onClick={()=>getLayers(d.name)}>{d.name}</p>
                  
                  </ul>
                )
              })}
            </div>
          </form>
        </div>
        <div className="container-map">
          <Map  getcoordinatepoint={getcoordinatepoint} getrelateddata={getrelateddata} relatedlayer={relatedlayer}/>
        </div>
      </div>

      <div className="card-preview">
      <div class="right-sidebar-container">
                                        
      <div id="map">

      </div>
    
  </div>
      </div>

      
    </div>
  );
}
export default Composer;


//map.js
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

      
          <Marker
            position={dynamicpos}
            draggable="true"
            eventHandlers={eventHandlers}
            icon={iconMarker}
            ref={markerRef}
            
          >
            // <Tooltip>You can also drag the marker to get next location</Tooltip>
          </Marker>
       
      </MapContainer>
      </div>
    
  
  );
}
export default Map;
