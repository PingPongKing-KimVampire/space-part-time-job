import React, { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ProfileInteraction from "./ProfileInteraction";
import { ProfileContainer } from "../../styles/pages/MyPage.styles";
import { WarningText } from "../../styles/global";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";

const Profile = () => {
  const [warning, setWarning] = useState<string>("");

  return (
    <ProfileContainer>
      <div className="content">
        <ProfileIcon className="profileIcon" />
        <ProfileInfo setWarning={setWarning} />
        <ProfileInteraction setWarning={setWarning} />
      </div>
      <WarningText>{warning}</WarningText>
    </ProfileContainer>
  );
};

export default Profile;
