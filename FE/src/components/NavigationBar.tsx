import React, { useMemo } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import { ReactComponent as WriteIcon } from "../assets/icons/write.svg";
import { ReactComponent as ProfileIcon } from "../assets/icons/profile.svg";
import { ReactComponent as BackIcon } from "../assets/icons/arrow-left.svg";
import { Container } from "../styles/NavigationBar.styles.ts";

const BAR = {
  MAIN: "main",
  NONE: "none",
  VIEW_APPLICANTS: "view-applicants",
  CREATE_JOB: "create-job",
};

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isViewJobPage = useMatch("/view-job/*");
  const isViewApplicantsPage = useMatch("/view-applicants/*");

  const bar = useMemo(() => {
    if (!location.pathname) return BAR.NONE;
    if (
      isViewJobPage ||
      ["/explore-jobs", "/mypage"].includes(location.pathname)
    )
      return BAR.MAIN;
    if (location.pathname === "/create-job") return BAR.CREATE_JOB;
    if (isViewApplicantsPage) return BAR.VIEW_APPLICANTS;
    return BAR.NONE;
  }, [location, isViewJobPage, isViewApplicantsPage]);

  const mainBarElement = (
    <Container type="main">
      <div
        className="logo"
        onClick={() => {
          navigate("/explore-jobs");
        }}
      >
        우주 알바
      </div>
      <div className="buttons">
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
    </Container>
  );

  const localBarElement = (title) => (
    <Container type="local">
      <div className="title">{title}</div>
      <BackIcon
        onClick={() => {
          window.history.back();
        }}
      />
    </Container>
  );

  return (
    <>
      {bar === BAR.MAIN && mainBarElement}
      {bar === BAR.CREATE_JOB && localBarElement("알바 공고 작성")}
      {bar === BAR.VIEW_APPLICANTS && localBarElement("지원자 확인")}
      <Outlet />
    </>
  );
};

export default NavigationBar;
