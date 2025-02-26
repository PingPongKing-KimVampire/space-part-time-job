import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import formatTimeAgo from "../../utils/formatTimeAgo";
import { MouseEventHandlers } from "./PostList";
import {
  ERROR,
  APPLICATION_STATUS,
  JOB_POST_STATUS,
} from "../../constants/constants";
import { ListItem } from "../../styles/pages/MyPage.styles";
import { WarningText, CloseTag } from "../../styles/global";
import { AcceptedBadge, RejectedBadge } from "../Badges";
import { LIST_MY_JOB_APPLICATIONS } from "../../api/graphql/queries";
import { processListMyApplications } from "../../api/graphql/processData";
import { CANCEL_JOB_APPLICATION } from "../../api/graphql/mutations";
import { processCancelApplication } from "../../api/graphql/processData";
import { Application } from "../../types/types";
import ViewMyApplicationModal from "./ViewMyApplicationModal";

type MyAppliedPostListProp = {
  mouseEventHandlers: MouseEventHandlers;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const MyAppliedPostList: React.FC<MyAppliedPostListProp> = ({
  mouseEventHandlers,
  setIsLoading,
}) => {
  const {
    onItemMouseEnter,
    onItemMouseLeave,
    onItemClick,
    onInnerClickableMouseEnter,
    onInnerClickableMouseLeave,
  } = mouseEventHandlers;

  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [getApplicationsFinalError, setGetApplicationsFinalError] =
    useState<Error | null>(null);
  const {
    data: myApplicationsData,
    loading: getMyApplicationsLoading,
    error: getMyApplicationsError,
  } = useQuery(LIST_MY_JOB_APPLICATIONS, { fetchPolicy: "network-only" });
  useEffect(() => {
    if (!myApplicationsData || !myApplicationsData.listMyJobApplications)
      return;
    try {
      const applications = processListMyApplications(myApplicationsData).filter(
        ({ status }) => status !== APPLICATION_STATUS.CANCELED
      );
      const sortedApplications = applications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMyApplications(
        sortedApplications.map((application) => ({
          ...application,
          createdAt: formatTimeAgo(application.createdAt),
        }))
      );
    } catch (e) {
      setGetApplicationsFinalError(e);
    }
  }, [myApplicationsData]);
  useEffect(() => {
    if (getMyApplicationsError)
      setGetApplicationsFinalError(new Error(ERROR.SERVER));
  }, [getMyApplicationsError]);

  const [cancelApplicationFinalError, setCancelApplicationFinalError] =
    useState<Error | null>(null);
  const [
    cancelApplication,
    { loading: cancelApplicationLoading, error: cancelApplicationError },
  ] = useMutation(CANCEL_JOB_APPLICATION);
  useEffect(() => {
    if (cancelApplicationError)
      setCancelApplicationFinalError(new Error(ERROR.SERVER));
  }, [cancelApplicationError]);

  const onCancelClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const applicationId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-application-id");
    try {
      let response;
      try {
        response = await cancelApplication({
          variables: { id: applicationId },
        });
      } catch {
        throw new Error(ERROR.SERVER);
      }
      processCancelApplication(response.data);
    } catch (e) {
      setCancelApplicationFinalError(e);
      return;
    }
    setMyApplications((state) =>
      state.filter((application) => application.id !== applicationId)
    );
  };

  const [detailApplication, setDetailApplication] = useState({
    coverLetter: "",
    isVisible: false,
  });

  const onViewApplicationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const applicationId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-application-id");
    const application = myApplications.find(
      (application) => application.id === applicationId
    );
    if (!application) return;
    setDetailApplication({
      coverLetter: application.coverLetter,
      isVisible: true,
    });
  };

  useEffect(() => {
    setIsLoading(cancelApplicationLoading);
  }, [cancelApplicationLoading]);

  if (getMyApplicationsLoading) {
    return (
      <>
        <ListItem className="loadingItem" />
        <ListItem className="loadingItem" />
        <ListItem className="loadingItem" />
      </>
    );
  }
  if (myApplications.length === 0) {
    return <div className="noJobNotice">아직 지원한 알바가 없어요.</div>;
  }
  return (
    <>
      {myApplications.map(({ id, jobPost, status, createdAt }) => (
        <ListItem
          className="item appliedPostItem"
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
          onClick={onItemClick}
          key={id}
          data-application-id={id}
          data-post-id={jobPost?.id}
        >
          <div className="main">
            {jobPost?.status === JOB_POST_STATUS.CLOSE && (
              <CloseTag>마감</CloseTag>
            )}
            <div className="title">{jobPost?.title || "불러오기 실패"}</div>
          </div>
          <div className="interaction">
            <div className="createdAt">{createdAt} 전</div>
            <button
              className="viewApplicationButton"
              onMouseEnter={onInnerClickableMouseEnter}
              onMouseLeave={onInnerClickableMouseLeave}
              onClick={onViewApplicationClick}
            >
              지원서 보기
            </button>
            {status === APPLICATION_STATUS.ACCEPTED && (
              <AcceptedBadge style={{ padding: "5px 0" }} />
            )}
            {status === APPLICATION_STATUS.REJECTED && (
              <RejectedBadge style={{ padding: "5px 0" }} />
            )}
            {status === APPLICATION_STATUS.PENDING && (
              <button
                className="cancelButton"
                onMouseEnter={onInnerClickableMouseEnter}
                onMouseLeave={onInnerClickableMouseLeave}
                onClick={onCancelClick}
              >
                지원 취소
              </button>
            )}
          </div>
        </ListItem>
      ))}
      {cancelApplicationFinalError && (
        <WarningText>{cancelApplicationFinalError.message}</WarningText>
      )}
      {getApplicationsFinalError && (
        <WarningText>{getApplicationsFinalError.message}</WarningText>
      )}
      {detailApplication.isVisible && (
        <ViewMyApplicationModal
          coverLetter={detailApplication.coverLetter}
          setDetailApplication={setDetailApplication}
        />
      )}
    </>
  );
};

export default MyAppliedPostList;
