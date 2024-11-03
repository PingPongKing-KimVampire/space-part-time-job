import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SetLocationScopePage = () => {
  const location = useLocation();
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const locationsParam = queryParams.get("locations");
    setLocations(locationsParam ? locationsParam.split(",") : []);
  }, [location.search]);

  return <div>{locations.join(",")}</div>;
};

export default SetLocationScopePage;
