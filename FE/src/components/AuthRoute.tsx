import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { GET_MY_ID } from "../graphql/queries.js";
import { useQuery } from "@apollo/client";
import LoadingOverlay from "../components/LoadingOverlay.tsx";

const AuthRoute = () => {
  // 로그인된 유저가 아닐 경우 login 화면으로 이동
  const { loading, error, data } = useQuery(GET_MY_ID);
  if (loading) return <LoadingOverlay />;
  if (error || !data?.me?.id) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default AuthRoute;
