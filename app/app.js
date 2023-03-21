import React, { useEffect, useState } from "react";
import typeMapping from "./utils/typeMapping";
function App({ pageType }) {
  useEffect(() => {
    if (typeof pageType === "number") {
      typeMapping["ocs1   "]().then((value) => {
        setPage(value.default);
      });
    }
  }, [pageType]);
  const [page, setPage] = useState("");
  return <div>app4{page}</div>;
}

export default App;
