import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Map from "../Map/Map";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const [coordinatepoint, setcoordinatepoint] = useState()
  const [bounds, setbounds] = useState()
  const [relateddata, setrelateddata] = useState()
  const [relatedlayer,setrelatedlayer] = useState()


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
  const getcoordinatepoint = (lat, lng, northbounds, southbounds) => {
    setcoordinatepoint([lat, lng])
    setbounds({
      northbounds: northbounds,
      southbounds: southbounds
    })

  }

  const getrelateddata = (data) => {
    console.log(data)
    setrelateddata(data)
  }

  const getLayers = (layer) => {
    if (layer) {
      setrelatedlayer(layer)
    }

  }



  // setting coordinates data
  useEffect(() => {
    if (coordinatepoint) {
      setData({
        ...data,
        coordinates: [coordinatepoint[0], coordinatepoint[1]],
        northbounds: bounds.northbounds,
        southbounds: bounds.southbounds
      });
    }
  }, [coordinatepoint]);



  return (
    <div className="composer">
      <div className="container">
        <div className="container-sidebar">
          <form>
            <div className="top-row">
              <h2 className="top-title-form">Related Map data</h2>
              {relateddata && relateddata.map(d => {
                return (
                  <ul className="rel-data">
                    <p>{d.title}</p>
                    <p>{d.description}</p>
                    <p onClick={() => getLayers(d.name)}>{d.name}</p>

                  </ul>
                )
              })}
            </div>
          </form>
        </div>
        <div className="container-map">
          <Map getcoordinatepoint={getcoordinatepoint} getrelateddata={getrelateddata} relatedlayer={relatedlayer}/>
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
