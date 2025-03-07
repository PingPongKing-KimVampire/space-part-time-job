import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GET_MY_ID } from "../api/graphql/queries.js";
import { useLazyQuery } from "@apollo/client";
import LoadingOverlay from "../components/LoadingOverlay";
import { WarningText } from "../styles/global";
import { ERROR } from "../constants/constants";

const AuthRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // 로그인된 유저가 아닐 경우 login 화면으로 이동
  const [getMyId, { error }] = useLazyQuery(GET_MY_ID, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setLoading(false);
      if (!data?.me?.id) navigate("/login");
    },
    onError: () => {
      setLoading(false);
      navigate("/login");
    },
  });
  useEffect(() => {
    try {
      setLoading(true);
      getMyId(); // url 변경 시 마다 호출
    } catch (e) {
      console.error("GetMyId Query Error: ", e.message);
    }
  }, [location]);

  if (loading) return <LoadingOverlay />;
  if (error) return <WarningText>{ERROR.SERVER}</WarningText>;
  return <Outlet />;
};

export default AuthRoute;
