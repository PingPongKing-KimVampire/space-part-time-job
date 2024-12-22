import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GET_MY_ID } from "../graphql/queries.js";
import { useLazyQuery } from "@apollo/client";
import LoadingOverlay from "../components/LoadingOverlay.tsx";

const AuthRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 로그인된 유저가 아닐 경우 login 화면으로 이동
  const [getMyId, { loading }] = useLazyQuery(GET_MY_ID, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (!data?.me?.id) navigate("/login");
    },
    onError: () => {
      navigate("/login");
    },
  });
  useEffect(() => {
    getMyId(); // url 변경 시 마다 호출
  }, [location]);

  if (loading) return <LoadingOverlay />;
  return <Outlet />;
};

export default AuthRoute;
