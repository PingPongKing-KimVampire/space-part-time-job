import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import { MainBackgroundColor, WarningText } from "../styles/global.ts";
import { Container, UserInfo } from "../styles/ViewApplicationsPage.styles.ts";
import { ReactComponent as ProfileIcon } from "../assets/icons/profile.svg";
import { AcceptedBadge, RejectedBadge } from "../components/Badges.tsx";
import { ERROR, APPLICATION_STATUS } from "../constants/constants.ts";
import { GET_JOB_POST_APPLICATIONS } from "../api/graphql/queries.js";
import { DECIDE_JOB_APPLICATION } from "../api/graphql/mutations.js";
import formatTimeAgo from "../utils/formatTimeAgo.ts";
import { Application } from "../types/types.ts";
import LoadingOverlay from "../components/LoadingOverlay.tsx";

const ViewApplicantsPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [applications, setApplications] = useState<Application[]>([]);

  const { id = "" } = useParams();

  const {
    data: applicationsData,
    error: getApplicationsError,
    loading: getApplicationsLoading,
  } = useQuery(GET_JOB_POST_APPLICATIONS, {
    variables: { id },
  });
  useEffect(() => {
    if (!applicationsData) return;
    const data = applicationsData.getJobPost.applications;
    setApplications(
      data.map((application) => ({
        ...application,
        createdAt: formatTimeAgo(application.createdAt),
      }))
    );
  }, [applicationsData]);

  const [
    decideJobApplication,
    { error: decideApplicationError, loading: decideApplicationLoading },
  ] = useMutation(DECIDE_JOB_APPLICATION);
  const onDecideButtonClick = async (e, status) => {
    const applicationId = e.target.closest(".item")?.getAttribute("data-id");
    if (!applicationId) return;
    try {
      await decideJobApplication({
        variables: {
          input: { id: applicationId, status },
        },
      });
    } catch (e) {
      console.error("DecideJobApplication Mutation Error: ", e.message);
      return;
    }
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
      {(getApplicationsLoading || decideApplicationLoading) && (
        <LoadingOverlay />
      )}
      {applications
        .filter(({ status }) => status !== APPLICATION_STATUS.CANCELED)
        .map(({ id, coverLetter, applicant, status, createdAt }) => (
          <div className="item" key={id} data-id={id}>
            {status === APPLICATION_STATUS.ACCEPTED && <AcceptedBadge />}
            {status === APPLICATION_STATUS.REJECTED && <RejectedBadge />}
            <UserInfo>
              <ProfileIcon />
              <div className="nickname">{applicant?.nickname}</div>
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
      {(getApplicationsError || decideApplicationError) && (
        <WarningText>{ERROR.SERVER}</WarningText>
      )}
    </Container>
  );
};

export default ViewApplicantsPage;
