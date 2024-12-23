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
import { LIST_MY_JOB_APPLICATIONS } from "../../graphql/queries.js";
import { CANCEL_JOB_APPLICATION } from "../../graphql/mutations.js";

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

const APPLICATIONS: Application[] = [
  {
    id: "1",
    jobPost: {
      id: "1",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    status: APPLICATION_STATUS["ACCEPTED"],
    createdAt: "1일 전 지원",
  },
  {
    id: "2",
    jobPost: {
      id: "2",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    status: APPLICATION_STATUS["REJECTED"],
    createdAt: "2일 전 지원",
  },
  {
    id: "3",
    jobPost: {
      id: "3",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "CLOSE",
    },
    coverLetter: `안녕하세요! 저는 항상 최선을 다해 모든 일에 임하는 사람입니다. 어떤 일이든지 시키기만 하시면, 그 어떤 일이든지 열심히, 그리고 성실하게 해낼 자신이 있습니다. 책임감이 매우 강해서 맡겨주신 일은 절대로 중간에 포기하지 않고 끝까지 잘 해내겠습니다.
그리고 힘도 상당히 강합니다. 몸이 좋다고 자부할 수는 없지만, 어려운 일이나 힘든 작업도 게으르지 않고 최선을 다해 맡아서 할 수 있습니다. 아무리 힘든 일이라도 포기하지 않는타입입니다.
어떤 일이든지 믿고 맡겨주시면, 제가 최고의 결과를 만들어내겠습니다. 시키기만 하면, 그 어떤 일이든지 다 해낼 자신이 있습니다. 언제든지 저를 필요로 하시면 믿고 맡겨 주세요. 제가 가진 모든 열정과 성실함, 책임감을 다해 맡은 바를 완벽히 해낼 준비가 되어 있습니다.
여러분이 저를 믿고 맡겨주시면, 그에 걸맞은 결과로 보답할 것을 약속드립니다!`,
    status: APPLICATION_STATUS["PENDING"],
    createdAt: "4일 전 지원",
  },
  {
    id: "4",
    jobPost: {
      id: "4",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "CLOSE",
    },
    coverLetter: `뜨면 안 되는 유저`,
    status: APPLICATION_STATUS["CANCELED"],
    createdAt: "4일 전 지원",
  },
  {
    id: "5",
    jobPost: {
      id: "5",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    status: APPLICATION_STATUS["REJECTED"],
    createdAt: "2일 전 지원",
  },
  {
    id: "6",
    jobPost: {
      id: "6",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    status: APPLICATION_STATUS["REJECTED"],
    createdAt: "2일 전 지원",
  },
  {
    id: "7",
    jobPost: {
      id: "7",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    status: APPLICATION_STATUS["REJECTED"],
    createdAt: "2일 전 지원",
  },
  {
    id: "8",
    jobPost: {
      id: "8",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    status: APPLICATION_STATUS["REJECTED"],
    createdAt: "2일 전 지원",
  },
  {
    id: "9",
    jobPost: {
      id: "9",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    status: APPLICATION_STATUS["REJECTED"],
    createdAt: "2일 전 지원",
  },
  {
    id: "10",
    jobPost: {
      id: "10",
      title: "국밥집 주말 홀서빙 구합니다 (하루 10시간 근무)",
      status: "OPEN",
    },
    coverLetter:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
    status: APPLICATION_STATUS["REJECTED"],
    createdAt: "2일 전 지원",
  },
];

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
  //   const {
  //     data: myApplicationsData,
  //     loading: getMyApplicationsLoading,
  //     error: getMyApplicationsError,
  //   } = useQuery(LIST_MY_JOB_APPLICATIONS);
  //   useEffect(() => {
  //     if (!myApplications || !myApplicationsData.listMyJobApplications) return;
  //     setMyApplications(
  //       myApplicationsData.listMyJobApplications.map((application) => ({
  //         ...application,
  //         createdAt: formatTimeAgo(application.createdAt),
  //       }))
  //     );
  //   }, [myApplications]);

  const [isSelected, setIsSelected] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setIsSelected(
      APPLICATIONS.reduce((acc, current) => {
        acc[current.id] = false;
        return acc;
      }, {})
    );
  }, []);

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
    const applicationId = (e.target as HTMLElement)
      .closest(".item")
      ?.getAttribute("data-application-id");
    await cancelApplication({ variables: { id: applicationId } });
    setMyApplications((state) =>
      state.filter((application) => application.id !== applicationId)
    );
  };

  // TODO : myApplications로 교체
  return (
    <>
      {APPLICATIONS.filter(
        ({ status }) => status !== APPLICATION_STATUS.CANCELED
      ).map(({ id, jobPost, coverLetter, status, createdAt }) => (
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
              <a
                onMouseEnter={onInnerClickableMouseEnter}
                onMouseLeave={onInnerClickableMouseLeave}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/view-job/${jobPost.id}`);
                }}
              >
                {jobPost.title}
              </a>
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
            <div className="createdAt">{createdAt}</div>
          </TogglePanel>
        </ListItem>
      ))}
    </>
  );
};

export default MyAppliedPostList;
