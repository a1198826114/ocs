import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
window.onload = function () {
  window.addEventListener("message", function (event) {
    //此处执行事件
    console.log(event.data, "safasf");

    let pageType = event.data;
    if (pageType) {
      root.render(<App pageType={pageType} />);
    }
  });
};
const root = ReactDOM.createRoot(document.getElementById("root"));
