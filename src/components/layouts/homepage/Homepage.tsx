import React from "react";
import image13 from "../../images/slider-component/image 12.png";
import image36 from "../../images/slider-component/image 36.png";
import image37 from "../../images/slider-component/image 37.png";
import image38 from "../../images/slider-component/image 38.png";

import "./style.css";

export const Slider = () => {
    return (
        <div className="final">
            <img className="image" alt="Image" src={image36} />

            <img className="img" alt="Image" src={image37} />

            <img className="image-2" alt="Image" src={image38} />

            <div className="text-wrapper">EV RENTAL</div>

            <div className="div">Bên nhau trọn đường</div>

        </div>
    );
};
