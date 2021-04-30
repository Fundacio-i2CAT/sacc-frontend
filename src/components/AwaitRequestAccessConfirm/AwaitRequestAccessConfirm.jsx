// @flow

import React, { Component } from 'react';
import styles from './AwaitRequestAccessConfirm.module.scss';
import copy from './AwaitRequestAccessConfirm.copy';

// react bootstrap
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

import waitingConfirmImg from '../../assets/img/waiting-confirm.svg';
import Container from 'react-bootstrap/Container';
import { apiCall } from '../../network/api';

type State = {firstName: string, surnames: string, email: string, phone: string, cardID: string};

class AwaitRequestAccessConfirm extends Component<any, State> {
  constructor() {
    super();
    this.state = {firstName: '', surnames: '', email: '', phone: '', cardID: ''};
  }
  
  handleCancel = (e: any): void => {
    e.preventDefault();
    this.props.handleCancel();
  };

  async componentDidMount() {
    const response = await apiCall("get", "/registerRequest");
    const {firstName, surnames, email, phone, cardId, institutionName} = response.data;
    this.setState({firstName, surnames, email, phone, cardId, institutionName});
  };

  render(): boolean | number | string | React$Element<*> | React$Portal | Iterable<any> | null {
    const {firstName, surnames, email, phone, cardId, institutionName} = this.state;
    return (
      <Container className='d-flex justify-content-center align-items-center full-height-container'>
        <Card className={`${styles.awaitRequestAccessCard} shadow position-relative pt-3 pr-4 pb-3 pl-4`}>
          <Card.Body>
            <div className={`d-flex flex-column justify-content-center`}>
              <Row>
                <Col xs={12}>
                  <div className="d-flex justify-content-center">
                    <Image src={waitingConfirmImg} className={`${styles.hourGlassImage} mb-4`} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="d-flex justify-content-center">
                    <Alert variant='success' className={`${styles.alertSuccess} mb-4`}>
                      {copy.awaitText}
                    </Alert>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className='text-primary'>{copy.registerRequest.title}</h4>
                </Col>
              </Row>
              {institutionName !== undefined && (
                <Row>
                  <Col>
                    <p className={`${styles.fieldLabel} mb-1`}>{copy.registerRequest.institution}</p>
                    <p>{institutionName}</p>
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs={6}>
                  <p className={`${styles.fieldLabel} mb-1`}>{copy.registerRequest.name}</p>
                  <p>{firstName}</p>
                </Col>
                <Col xs={6}>
                  <p className={`${styles.fieldLabel} mb-1`}>{copy.registerRequest.surnames}</p>
                  <p>{surnames}</p>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <p className={`${styles.fieldLabel} mb-1`}>{copy.registerRequest.email}</p>
                  <p>{email}</p>
                </Col>
                <Col xs={6}>
                  <p className={`${styles.fieldLabel} mb-1`}>{copy.registerRequest.phone}</p>
                  <p>{phone}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className={`${styles.fieldLabel} mb-1`}>{copy.registerRequest.cardId}</p>
                  <p>{cardId}</p>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="d-flex justify-content-center mt-3">
                    <Button variant='outline-dark' className={styles.cancelButton} onClick={this.props.handleCancel}>
                      {copy.cancelButton }
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}
export default AwaitRequestAccessConfirm;
