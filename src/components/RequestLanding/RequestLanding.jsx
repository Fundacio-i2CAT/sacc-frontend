// @flow

import React, { Component } from 'react';
import copy from './RequestLanding.copy';
import styles from './RequestLanding.module.scss';

// react bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import conditionsImg from '../../assets/img/lsc.png';

import { USER_TYPE_ENUM } from '../../shared/enums/UsersTypeEnum';
import type { UserTypesType } from '../../shared/enums/UsersTypeEnum';


class RequestLanding extends Component<any, any> {
  handleChange = (role: UserTypesType) => {
    this.props.handleChange(role);
  };

  render(): boolean | number | string | React$Element<*> | React$Portal | Iterable<any> | null {
    return (
      <Container className='full-height-container bg-white'>
        <Row>
          <Col xs={12}>
            <div className='d-flex justify-content-center'>
              <Image src={conditionsImg} className={styles.thumbImg} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className='d-flex justify-content-center'>
              <h5 className={styles.registrationTitle}>{copy.title}</h5>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className='d-flex justify-content-center'>
              <Button
                onClick={() => this.handleChange(USER_TYPE_ENUM.END_USER)}
                className={`${styles.actionButtons} mr-3`}
              >
                {copy.endUser}
              </Button>
              <Button
                onClick={() => this.handleChange(USER_TYPE_ENUM.INSTITUTION)}
                className={`${styles.actionButtons}`}
              >
                {copy.institution}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default RequestLanding;
