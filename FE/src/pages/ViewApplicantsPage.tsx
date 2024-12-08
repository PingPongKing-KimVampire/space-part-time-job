import React from "react";
import useBackgroundColor from "../utils/useBackgroundColor";
import { MainBackgroundColor } from "../styles/global";
import { Container, Item } from "../styles/ViewApplicantsPage.styles";
import { ReactComponent as CheckBadgeIcon } from "../assets/icons/check-badge.svg";
import { ReactComponent as ProfileIcon } from "../assets/icons/profile.svg";

const APPLICANTS = [
  {
    nickname: "롤리",
    applyTime: "1일 전 지원",
    isRecruited: true,
    selfIntroduction:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
  },
  {
    nickname: "숄리",
    applyTime: "2일 전 지원",
    isRecruited: false,
    selfIntroduction:
      "안녕하세요! 시켜만 주시면 모든지 열심히 하겠습니다!!! 성실하고 책임감이 강합니다. 힘도 상당히 강합니다. 뭐든지 잘 해낼 수 있습니다. 믿고 맡겨 주십셔!",
  },
  {
    nickname: "알리",
    applyTime: "4일 전 지원",
    isRecruited: false,
    selfIntroduction: `안녕하세요! 저는 항상 최선을 다해 모든 일에 임하는 사람입니다. 어떤 일이든지 시키기만 하시면, 그 어떤 일이든지 열심히, 그리고 성실하게 해낼 자신이 있습니다. 책임감이 매우 강해서 맡겨주신 일은 절대로 중간에 포기하지 않고 끝까지 잘 해내겠습니다.
그리고 힘도 상당히 강합니다. 몸이 좋다고 자부할 수는 없지만, 어려운 일이나 힘든 작업도 게으르지 않고 최선을 다해 맡아서 할 수 있습니다. 아무리 힘든 일이라도 포기하지 않는타입입니다.
어떤 일이든지 믿고 맡겨주시면, 제가 최고의 결과를 만들어내겠습니다. 시키기만 하면, 그 어떤 일이든지 다 해낼 자신이 있습니다. 언제든지 저를 필요로 하시면 믿고 맡겨 주세요. 제가 가진 모든 열정과 성실함, 책임감을 다해 맡은 바를 완벽히 해낼 준비가 되어 있습니다.
여러분이 저를 믿고 맡겨주시면, 그에 걸맞은 결과로 보답할 것을 약속드립니다!`,
  },
];

const ViewApplicantsPage = () => {
  useBackgroundColor(MainBackgroundColor);

  return (
    <Container>
      {APPLICANTS.map(
        ({ nickname, applyTime, isRecruited, selfIntroduction }) => (
          <Item>
            {isRecruited && (
              <div className="recruitmentBadge">
                <CheckBadgeIcon />
                채용 확정
              </div>
            )}
            <div className="userInfo">
              <ProfileIcon />
              <div className="nickname">{nickname}</div>
              <div className="applyTime">ㆍ {applyTime}</div>
            </div>
            <div className="selfIntroduction">{selfIntroduction}</div>
            {!isRecruited && (
              <button className="recruitmentButton">채용</button>
            )}
          </Item>
        )
      )}
    </Container>
  );
};

export default ViewApplicantsPage;
