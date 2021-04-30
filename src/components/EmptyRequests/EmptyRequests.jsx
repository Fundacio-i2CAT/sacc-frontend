// @flow

import React from 'react';
import styles from './EmptyRequests.module.scss';

import emptyRequestsImage from '../../assets/img/no-requests.png';

type Props = { imageAlt: string, text: string }

const EmptyRequests = (props: Props) => {
  return (
    <div className="d-flex flex-column align-items-center">
      <img
        src={emptyRequestsImage}
        className={`${styles.empty} mb-5`}
        alt={props.imageAlt}
        width="222"
      />
      <p>{props.text}</p>
    </div>
  );
};
export default EmptyRequests;
