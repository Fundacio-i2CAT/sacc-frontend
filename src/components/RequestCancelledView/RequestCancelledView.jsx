// @flow

import React, { Component } from 'react';
import copy from './RequestCancelledView.copy';
import styles from './RequestCancelledView.module.scss';

// react bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';


class RequestCancelledView extends Component<any, any>{
  render(): boolean | number | string | React$Element<*> | React$Portal | Iterable<any> | null {
    return (
      <Container className='d-flex justify-content-center align-items-center mt-5'>
        <Card className='pt-3 pr-4 pb-3 pl-4'>
          <Card.Body>
            <div className='d-flex flex-column justify-content-center'>
              <Row>
                <Col xs={12}>
                  <div className='d-flex justify-content-center'>
                    <FontAwesomeIcon icon={faTimesCircle} className={styles.cancelIcon} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className='d-flex justify-content-center'>
                    <Alert variant='warning' className={styles.warnText}>{copy.message}</Alert>
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
export default RequestCancelledView;
