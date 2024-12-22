import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import { MainBackgroundColor } from "../styles/global.ts";
import { Container, UserInfo } from "../styles/ViewApplicationsPage.styles.ts";
import { ReactComponent as ProfileIcon } from "../assets/icons/profile.svg";
import { AcceptedBadge, RejectedBadge } from "../components/Badges.tsx";
import { APPLICATION_STATUS } from "../constants/constants.ts";
import { GET_JOB_POST_APPLICATIONS } from "../graphql/queries.js";
import { DECIDE_JOB_APPLICATION } from "../graphql/mutations.js";
import formatTimeAgo from "../utils/formatTimeAgo.ts";

type Application = {
  id: string;
  coverLetter: string;
  applicant: { nickname: string };
  status: APPLICATION_STATUS;
  createdAt: string;
};

const APPLICANTS = [
  {
    id: "1",
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    applicant: { nickname: "롤리" },
    status: APPLICATION_STATUS["ACCEPTED"],
    createdAt: "1일 전 지원",
  },
  {
    id: "2",
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    applicant: { nickname: "숄리" },
    status: APPLICATION_STATUS["REJECTED"],
    createdAt: "2일 전 지원",
  },
  {
    id: "3",
    coverLetter: `안녕하세요! 저는 항상 최선을 다해 모든 일에 임하는 사람입니다. 어떤 일이든지 시키기만 하시면, 그 어떤 일이든지 열심히, 그리고 성실하게 해낼 자신이 있습니다. 책임감이 매우 강해서 맡겨주신 일은 절대로 중간에 포기하지 않고 끝까지 잘 해내겠습니다.
그리고 힘도 상당히 강합니다. 몸이 좋다고 자부할 수는 없지만, 어려운 일이나 힘든 작업도 게으르지 않고 최선을 다해 맡아서 할 수 있습니다. 아무리 힘든 일이라도 포기하지 않는타입입니다.
어떤 일이든지 믿고 맡겨주시면, 제가 최고의 결과를 만들어내겠습니다. 시키기만 하면, 그 어떤 일이든지 다 해낼 자신이 있습니다. 언제든지 저를 필요로 하시면 믿고 맡겨 주세요. 제가 가진 모든 열정과 성실함, 책임감을 다해 맡은 바를 완벽히 해낼 준비가 되어 있습니다.
여러분이 저를 믿고 맡겨주시면, 그에 걸맞은 결과로 보답할 것을 약속드립니다!`,
    applicant: { nickname: "알리" },
    status: APPLICATION_STATUS["PENDING"],
    createdAt: "4일 전 지원",
  },
  {
    id: "4",
    coverLetter: `뜨면 안 되는 유저`,
    applicant: { nickname: "뜨면 안 되는 유저" },
    status: APPLICATION_STATUS["CANCELED"],
    createdAt: "4일 전 지원",
  },
];

const ViewApplicantsPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [applications, setApplications] = useState<Application[]>([]);

  const { id = "" } = useParams();

  // const {
  //   data: applicationsData,
  //   error: getApplicationsError,
  //   loading: getApplicationsLoading,
  // } = useQuery(GET_JOB_POST_APPLICATIONS);
  // useEffect(() => {
  //   const data = applicationsData.getJobPost.node.applications;
  //   setApplications(
  //     data.map((application) => ({
  //       ...application,
  //       createdAt: formatTimeAgo(application.createdAt),
  //     }))
  //   );
  // }, [applicationsData]);

  const [
    decideJobApplication,
    { error: decideApplicationError, loading: decideApplicationLoading },
  ] = useMutation(DECIDE_JOB_APPLICATION);
  const onDecideButtonClick = async (e, status) => {
    const applicationId = e.target.closest(".item")?.getAttribute("data-id");
    if (!applicationId) return;
    await decideJobApplication({
      variables: {
        input: { id: applicationId, status },
      },
    });
    // 결정 사항에 따라 applications 직접 업데이트
    setApplications((state) =>
      state.map((application) => {
        if (application.id !== applicationId) return application;
        return { ...application, status };
      })
    );
  };

  return (
    <Container>
      {APPLICANTS.filter(
        // TODO : applications로 교체하기
        ({ status }) => status !== APPLICATION_STATUS.CANCELED
      ).map(({ id, coverLetter, applicant, status, createdAt }) => (
        <div className="item" key={id} data-id={id}>
          {status === APPLICATION_STATUS.ACCEPTED && <AcceptedBadge />}
          {status === APPLICATION_STATUS.REJECTED && <RejectedBadge />}
          <UserInfo>
            <ProfileIcon />
            <div className="nickname">{applicant.nickname}</div>
            <div className="createdAt">ㆍ {createdAt}</div>
          </UserInfo>
          <div className="coverLetter">{coverLetter}</div>
          {status === APPLICATION_STATUS.PENDING && (
            <div className="decideButtons">
              <button
                className="acceptButton"
                onClick={(e) => {
                  onDecideButtonClick(e, APPLICATION_STATUS.ACCEPTED);
                }}
              >
                채용
              </button>
              <button
                className="rejectButton"
                onClick={(e) => {
                  onDecideButtonClick(e, APPLICATION_STATUS.REJECTED);
                }}
              >
                채용 거절
              </button>
            </div>
          )}
        </div>
      ))}
    </Container>
  );
};

export default ViewApplicantsPage;
