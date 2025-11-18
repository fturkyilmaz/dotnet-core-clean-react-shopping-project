import React, { useEffect } from "react";
import Slider from "../components/Slider";
import SliderReact from "react-slick";
import { toast } from "react-toastify";
import { FaBeer } from "react-icons/fa";
import Loader from "../components/Loader";

export default function HomeScreen() {
  const baseUrl = "./src/assets/images";

  const notify = () => toast("Wow so easy!");

  useEffect(() => {
    notify();
  }, []);

  return (
    <div className="slider-container">
      <h3>
        Lets go for a <FaBeer />?
      </h3>
      <Loader/>

      <SliderReact
        {...{
          dots: true,
          fade: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          waitForAnimate: false,
        }}
      >
        <div>
          <img src={"https://picsum.photos/200/300"} />
        </div>
        <div>
          <img src={"https://picsum.photos/200/300"} />
        </div>
        <div>
          <img src={"https://picsum.photos/200/300"} />
        </div>
        <div>
          <img src={"https://picsum.photos/200/300"} />
        </div>
      </SliderReact>

      <span>TEST İkinci Slider</span>

      <Slider />
    </div>
  );
}
