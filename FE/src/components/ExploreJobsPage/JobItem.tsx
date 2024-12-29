import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  JobItemContainer,
  JobItemContextBox,
} from "../../styles/ExploreJobsPage.styles";
import {
  converPayToDisplayable,
  converTimeToDisplayable,
  converPeriodToDisplayable,
} from "../../utils/convertJobInfoToDisplayable";

type JobItemProps = {
  id: string;
  title: string;
  neighborhood: string;
  createdAt: string;
  pay: { type: string; amount: number };
  period: { type: string; dates?: string[]; days?: string[] };
  time: { type: string; startTime: string; endTime: string };
  photos: string[];
};

const JobItem: React.FC<JobItemProps> = (props) => {
  const { id, title, neighborhood, createdAt, pay, period, time, photos } =
    props;
  const navigate = useNavigate();

  const payToDisplay = useMemo(() => converPayToDisplayable(pay), [pay]);
  const timeToDisplay = useMemo(() => converTimeToDisplayable(time), [time]);
  const periodToDisplay = useMemo(
    () => converPeriodToDisplayable(period),
    [period]
  );

  return (
    <JobItemContainer
      onClick={() => {
        navigate(`/view-job/${id}`);
      }}
    >
      <JobItemContextBox>
        <div className="mainInfo">
          <div className="title">{title}</div>
          <div className="neighborhoodAndPostTime">
            {neighborhood} ㆍ {createdAt} 전
          </div>
        </div>
        <div className="subInfo">
          <span className="pay">{payToDisplay}</span>
          <span className="periodAndTime">
            {" "}
            ㆍ {periodToDisplay} ㆍ {timeToDisplay}
          </span>
        </div>
      </JobItemContextBox>
      {photos.length > 0 && (
        <div className="imageBox">
          <img src={photos[0]} alt="job" />
        </div>
      )}
      <div className="line" />
    </JobItemContainer>
  );
};

export default JobItem;
