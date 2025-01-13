import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import formatTimeAgo from "../../utils/formatTimeAgo.ts";
import { MouseEventHandlers } from "./PostList.tsx";
import {
  ERROR,
  APPLICATION_STATUS,
  JOB_POST_STATUS,
} from "../../constants/constants.ts";
import { ListItem } from "../../styles/pages/MyPage.styles.ts";
import { WarningText, CloseTag } from "../../styles/global.ts";
import { AcceptedBadge, RejectedBadge } from "../Badges.tsx";
import { LIST_MY_JOB_APPLICATIONS } from "../../api/graphql/queries.js";
import { CANCEL_JOB_APPLICATION } from "../../api/graphql/mutations.js";
import { Application } from "../../types/types.ts";
import ViewMyApplicationModal from "./ViewMyApplicationModal.tsx";

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
  const {
    data: myApplicationsData,
    loading: getMyApplicationsLoading,
    error: getMyApplicationsError,
  } = useQuery(LIST_MY_JOB_APPLICATIONS, { fetchPolicy: "network-only" });
  useEffect(() => {
    if (!myApplicationsData || !myApplicationsData.listMyJobApplications)
      return;
    const applications = [...myApplicationsData.listMyJobApplications];
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
  }, [myApplicationsData]);

  const [
    cancelApplication,
    { loading: cancelApplicationLoading, error: cancelApplicationError },
  ] = useMutation(CANCEL_JOB_APPLICATION);
  const onCancelClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const applicationId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-application-id");
    try {
      await cancelApplication({ variables: { id: applicationId } });
    } catch (e) {
      console.error("CancelJobApplication Mutation Error: ", e.message);
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
    setIsLoading(getMyApplicationsLoading || cancelApplicationLoading);
  }, [getMyApplicationsLoading, cancelApplicationLoading]);

  return (
    <>
      {myApplications
        .filter(({ status }) => status !== APPLICATION_STATUS.CANCELED)
        .map(({ id, jobPost, status, createdAt }) => (
          <ListItem
            className="item"
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
              <div className="title">{jobPost?.title}</div>
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
      {(getMyApplicationsError || cancelApplicationError) && (
        <WarningText>{ERROR.SERVER}</WarningText>
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
