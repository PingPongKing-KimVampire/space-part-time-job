import React, { useMemo } from "react";
import {
  JobItemContainer,
  JobItemContextBox,
} from "../../styles/ExploreJobsPage.styles.ts";
import {
  converPayToDisplayable,
  converTimeToDisplayable,
  converPeriodToDisplayable,
} from "../../utils/convertJobInfoToDisplayable.ts";
import { PAY_TYPES } from "../../constants/constants.ts";

type JobItemProps = {
  title: string;
  location: string;
  postTime: string;
  pay: { type: string; amount: number };
  period: { type: string; dates?: string[]; days?: string[] };
  time: { type: string; startTime: string; endTime: string };
  photos: string[];
};

const JobItem: React.FC<JobItemProps> = (props) => {
  const { title, location, postTime, pay, period, time, photos } = props;

  const payToDisplay = useMemo(() => converPayToDisplayable(pay), [pay]);

  const timeToDisplay = useMemo(() => converTimeToDisplayable(time), [time]);

  const periodToDisplay = useMemo(
    () => converPeriodToDisplayable(period),
    [period]
  );

  return (
    <JobItemContainer>
      <JobItemContextBox>
        <div className="mainInfo">
          <div className="title">{title}</div>
          <div className="locationAndPostTime">
            {location} ㆍ {postTime}
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
