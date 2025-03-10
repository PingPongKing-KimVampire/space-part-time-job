import React, { useMemo } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import { ReactComponent as ProfileIcon } from "../assets/icons/profile.svg";
import { ReactComponent as BackIcon } from "../assets/icons/arrow-left.svg";
import logoImage from "../assets/images/logo.png";
import {
  Container,
  Content,
} from "../styles/components/NavigationBar.styles.ts";

const BAR = {
  MAIN: "main",
  NONE: "none",
  VIEW_APPLICATIONS: "view-applications",
  CREATE_JOB: "create-job",
};

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isViewJobPage = useMatch("/view-job/*");
  const isViewApplicationsPage = useMatch("/view-applications/*");

  const bar = useMemo(() => {
    if (!location.pathname) return BAR.NONE;
    if (
      isViewJobPage ||
      ["/explore-jobs", "/mypage"].includes(location.pathname)
    )
      return BAR.MAIN;
    if (location.pathname === "/create-job") return BAR.CREATE_JOB;
    if (isViewApplicationsPage) return BAR.VIEW_APPLICATIONS;
    return BAR.NONE;
  }, [location, isViewJobPage, isViewApplicationsPage]);

  const mainBarElement = (
    <Container>
      <Content type="main">
        <div
          className="logo"
          onClick={() => {
            navigate("/explore-jobs");
          }}
        >
          <img src={logoImage} />
          <div className="text">우주 알바</div>
        </div>
        <ProfileIcon
          onClick={() => {
            navigate("/mypage");
          }}
        />
      </Content>
    </Container>
  );

  const localBarElement = (title) => (
    <Container>
      <Content type="local">
        <div className="title">{title}</div>
        <BackIcon
          onClick={() => {
            window.history.back();
          }}
        />
      </Content>
    </Container>
  );

  return (
    <>
      {bar === BAR.MAIN && mainBarElement}
      {bar === BAR.CREATE_JOB && localBarElement("알바 공고 작성")}
      {bar === BAR.VIEW_APPLICATIONS && localBarElement("지원자 확인")}
      <Outlet />
    </>
  );
};

export default NavigationBar;
