import React from 'react'
import Lottie from "lottie-react";
import LoaderAnimation from "../assets/animations/loader.json"

export default function Loader() {
  return (
    <div>
       <Lottie animationData={LoaderAnimation} loop={true} />;
    </div>
  )
}
