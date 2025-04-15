import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ConferenceCard.css";

const SkeletonConferenceCard = () => {
  return (
    <div className="card">
      <div className="card-content-container">
        <ul>
          <li className="card-title">
            <Skeleton width={100} height="2rem" />
          </li>
          <li>
            <Skeleton width={100} height={"1rem"} />
          </li>
          <li>
            <Skeleton width={150} height={"1rem"} />
          </li>
          <li>
            <Skeleton width={100} height={"1rem"} />
          </li>
          <li>
            <Skeleton width={400} height={"1rem"} />
          </li>
          <li>
            <Skeleton width={100} height={"1rem"} />
          </li>
          <li>
            <Skeleton width={150} height={"1rem"} />
          </li>
        </ul>
        <Skeleton width={120} height={35} />
      </div>
      <div className="button-container">
        <Skeleton width={60} height={35} />
        <Skeleton width={60} height={35} />
      </div>
    </div>
  );
};

export default SkeletonConferenceCard;
