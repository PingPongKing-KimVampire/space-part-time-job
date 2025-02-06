import React from "react";
import { Navigate } from "react-router-dom";
import { GET_MY_ID } from "../api/graphql/queries.js";
import { useQuery } from "@apollo/client";
import LoadingOverlay from "../components/LoadingOverlay";

const NotFoundRoute = () => {
  // 로그인된 경우 exlore-jobs, 안 된 경우 login 페이지로 이동
  const { loading, error, data } = useQuery(GET_MY_ID);
  if (loading) return <LoadingOverlay />;
  if (error || !data?.me?.id) return <Navigate to="/login" replace />;
  return <Navigate to="/explore-jobs" replace />;
};

export default NotFoundRoute;
