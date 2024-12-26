import React, { useMemo } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import { ReactComponent as WriteIcon } from "../assets/icons/write.svg";
import { ReactComponent as ProfileIcon } from "../assets/icons/profile.svg";
import { ReactComponent as BackIcon } from "../assets/icons/arrow-left.svg";
import { ReactComponent as LocationIcon } from "../assets/icons/location.svg";
import { Container, Content } from "../styles/NavigationBar.styles.ts";

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
          우주 알바
        </div>
        <div className="buttons">
          <LocationIcon
            onClick={() => {
              navigate("/search-neighbor");
            }}
          />
          <WriteIcon
            onClick={() => {
              navigate("/create-job");
            }}
          />
          <ProfileIcon
            onClick={() => {
              navigate("/mypage");
            }}
          />
        </div>
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
