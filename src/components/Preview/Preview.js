import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import "./style.css";
import "../Card/style1.css";

function Preview(props) {
  let pushdata = props.data;
  var Imageurl = `https://rdfolder.s3.ap-south-1.amazonaws.com/`;
  return (
    <>
      <div className="preview">
        {pushdata &&
          pushdata.map((d) => {
            return (
              <>
                <div className="card">
                  <img className="card-img" src={Imageurl + d.img} />
                  <div className="card-title">
                    <input
                      type="text"
                      value={d.title}
                      className="hdr-card"
                      placeholder="Story Title"
                    />
                    <OutlinedInput
                      rows={5}
                      multiline
                      type="text"
                      className="card-story"
                      value={d.description}
                      placeholder="This is yout TL Tales || Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    />
                  </div>
                  <div className="card-actions">
                    {/* <img className='card-icon-edit' onClick={editFun} src='https://i.ibb.co/gwMddh7/pencil.png'/> */}
                    <img
                      className="card-icon-delete"
                      src="https://i.ibb.co/ymCBkTK/trash-1.png"
                    />
                  </div>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}
export default Preview;
