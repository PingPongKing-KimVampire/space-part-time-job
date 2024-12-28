import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import formatTimeAgo from "../../utils/formatTimeAgo.ts";
import { MouseEventHandlers } from "./PostList.tsx";
import {
  APPLICATION_STATUS,
  JOB_POST_STATUS,
} from "../../constants/constants.ts";
import {
  ListItem,
  MainPanel,
  TogglePanel,
  ArrowDownIcon,
} from "../../styles/MyPage.styles.ts";
import { CloseTag } from "../../styles/global.ts";
import { AcceptedBadge, RejectedBadge } from "../Badges.tsx";
import { LIST_MY_JOB_APPLICATIONS } from "../../api/graphql/queries.js";
import { CANCEL_JOB_APPLICATION } from "../../api/graphql/mutations.js";

type Application = {
  id: string;
  jobPost: { id: string; title: string; status: string };
  coverLetter: string;
  status: string;
  createdAt: string;
};

type MyAppliedPostListProp = {
  mouseEventHandlers: MouseEventHandlers;
};

const MyAppliedPostList: React.FC<MyAppliedPostListProp> = ({
  mouseEventHandlers,
}) => {
  const {
    onItemMouseEnter,
    onItemMouseLeave,
    onInnerClickableMouseEnter,
    onInnerClickableMouseLeave,
  } = mouseEventHandlers;
  const navigate = useNavigate();

  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const {
    data: myApplicationsData,
    loading: getMyApplicationsLoading,
    error: getMyApplicationsError,
  } = useQuery(LIST_MY_JOB_APPLICATIONS, { fetchPolicy: "network-only" });
  useEffect(() => {
    if (!myApplicationsData || !myApplicationsData.listMyJobApplications)
      return;
    setMyApplications(
      myApplicationsData.listMyJobApplications.map((application) => ({
        ...application,
        createdAt: formatTimeAgo(application.createdAt),
      }))
    );
  }, [myApplicationsData]);

  const [isSelected, setIsSelected] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setIsSelected(
      myApplications.reduce((acc, current) => {
        acc[current.id] = false;
        return acc;
      }, {})
    );
  }, [myApplications]);

  const onToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const applicationId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-application-id");
    if (!applicationId) return;
    setIsSelected((state) => ({
      ...state,
      [applicationId]: !state[applicationId],
    }));
  };

  const [
    cancelApplication,
    { loading: cancelApplicationLoading, error: cancelApplicationError },
  ] = useMutation(CANCEL_JOB_APPLICATION);
  const onCancelClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const applicationId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-application-id");
    await cancelApplication({ variables: { id: applicationId } });
    setMyApplications((state) =>
      state.filter((application) => application.id !== applicationId)
    );
  };

  return (
    <>
      {myApplications
        .filter(({ status }) => status !== APPLICATION_STATUS.CANCELED)
        .map(({ id, jobPost, coverLetter, status, createdAt }) => (
          <ListItem
            className="item"
            onMouseEnter={onItemMouseEnter}
            onMouseLeave={onItemMouseLeave}
            onClick={onToggle}
            key={id}
            data-application-id={id}
            data-post-id={jobPost.id}
            style={{ flexDirection: "column" }}
          >
            <MainPanel>
              <div className="title">
                {jobPost.status === JOB_POST_STATUS.CLOSE && (
                  <CloseTag>마감</CloseTag>
                )}
                <button
                  onMouseEnter={onInnerClickableMouseEnter}
                  onMouseLeave={onInnerClickableMouseLeave}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/view-job/${jobPost.id}`);
                  }}
                >
                  {jobPost.title}
                </button>
              </div>
              <div className="interaction">
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
                <ArrowDownIcon
                  className="arrowDownIcon"
                  isSelected={isSelected[id]}
                  onClick={onToggle}
                />
              </div>
            </MainPanel>
            <TogglePanel className={isSelected[id] ? "visible" : ""}>
              <div className="coverLetter">{coverLetter}</div>
              <div className="createdAt">{createdAt} 전</div>
            </TogglePanel>
          </ListItem>
        ))}
    </>
  );
};

export default MyAppliedPostList;
