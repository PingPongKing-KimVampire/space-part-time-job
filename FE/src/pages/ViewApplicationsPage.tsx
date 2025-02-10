import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import useBackgroundColor from "../utils/useBackgroundColor";
import { MainBackgroundColor, WarningText } from "../styles/global";
import {
  Container,
  UserInfo,
} from "../styles/pages/ViewApplicationsPage.styles";
import { ReactComponent as ProfileIcon } from "../assets/icons/profile.svg";
import { AcceptedBadge, RejectedBadge } from "../components/Badges";
import { ERROR, APPLICATION_STATUS } from "../constants/constants";
import { GET_JOB_POST_APPLICATIONS } from "../api/graphql/queries";
import { processGetApplications } from "../api/graphql/processData";
import { DECIDE_JOB_APPLICATION } from "../api/graphql/mutations";
import { processDecideApplication } from "../api/graphql/processData";
import formatTimeAgo from "../utils/formatTimeAgo";
import { Application } from "../types/types";
import LoadingOverlay from "../components/LoadingOverlay";

const ViewApplicantsPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [applications, setApplications] = useState<Application[]>([]);

  const { id = "" } = useParams();

  const [getApplicationsFinalError, setGetApplicationsFinalError] =
    useState<Error | null>(null);
  const {
    data: applicationsData,
    error: getApplicationsError,
    loading: getApplicationsLoading,
  } = useQuery(GET_JOB_POST_APPLICATIONS, {
    variables: { id },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (!applicationsData) return;
    try {
      const applications = processGetApplications(applicationsData);
      setApplications(
        applications.map((application) => ({
          ...application,
          createdAt: formatTimeAgo(application.createdAt),
        }))
      );
    } catch (e) {
      setGetApplicationsFinalError(e);
    }
  }, [applicationsData]);
  useEffect(() => {
    if (getApplicationsError)
      setGetApplicationsFinalError(new Error(ERROR.SERVER));
  }, [getApplicationsError]);

  const [
    decideJobApplication,
    { error: decideApplicationError, loading: decideApplicationLoading },
  ] = useMutation(DECIDE_JOB_APPLICATION);
  const [decideApplicationFinalError, setDecideApplicationFinalError] =
    useState<Error | null>(null);
  useEffect(() => {
    if (decideApplicationError)
      setDecideApplicationFinalError(new Error(ERROR.SERVER));
  }, [decideApplicationError]);

  const onDecideButtonClick = async (e, status) => {
    const applicationId = e.target.closest(".item")?.getAttribute("data-id");
    if (!applicationId) return;
    try {
      let response;
      try {
        response = await decideJobApplication({
          variables: {
            input: { id: applicationId, status },
          },
        });
      } catch {
        throw new Error(ERROR.SERVER);
      }
      processDecideApplication(response.data);
    } catch (e) {
      setDecideApplicationFinalError(e);
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
              <div className="nickname">
                {applicant?.nickname || "불러오기 실패"}
              </div>
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
      {decideApplicationFinalError && (
        <WarningText>{decideApplicationFinalError.message}</WarningText>
      )}
      {getApplicationsFinalError && (
        <WarningText>{getApplicationsFinalError.message}</WarningText>
      )}
    </Container>
  );
};

export default ViewApplicantsPage;
