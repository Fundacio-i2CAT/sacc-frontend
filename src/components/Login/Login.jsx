import React, { Component } from 'react';
import styles from './Login.module.scss';
import copy from './Login.copy';

// react bootstrap
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import singleClickImg from '../../assets/img/single-click.png';
import earthBackgroundImg from '../../assets/img/background-earth.jpeg';

import { setTokenHeader, apiCall } from '../../network/api';

class Login extends Component {
  handleLogin = async e => {
    e.preventDefault();
    const { web3, accounts, auth } = this.props;
    let response;

    try {
      const challenge = await apiCall('post', 'login', { address: accounts[0] });
      const signature = await web3.eth.sign(
        web3.utils.keccak256(challenge.data.challenge),
        accounts[0]
      );
      response = await apiCall('post', 'login', {
        address: accounts[0],
        signature
      });
      if (response.status === 200) {
        const token = response.data.accessToken;
        setTokenHeader(token);
        auth(token);
      } else {
        console.error(`Error de autenticació`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <Container fluid={true} className='min-vh-100'>
        <Row className='min-vh-100'>
          <Col className={styles.leftCol} md={5}>
            <div className={styles.leftContainer}>
              <div className={{marginBottom: '44px', textAlign: 'center'}}>
                <h1 className='m-0 p-0 text-center'>{copy.title}</h1>
                <h4 className={`${styles.subtitle} mt-0 mb-lg-4 p-0 text-center`}>{copy.subtitle}</h4>
              </div>
              <Image src={singleClickImg} className={styles.singleClickSvg} />
              <Button
                className={styles.loginButtonStyle}
                variant='outline-info btn-lg'
                onClick={this.handleLogin}
              >
                {copy.button}
              </Button>
            </div>
          </Col>
          <Col className={styles.rightContainer} md={7}>
            <div className={styles.parafContainer}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.icons} />
              <h6 className={styles.texts}>{copy.info.first}</h6>
            </div>
            <div className={styles.parafContainer}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.icons} />
              <h6 className={styles.texts}>{copy.info.second}</h6>
            </div>
            <div className={styles.parafContainer}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.icons} />
              <h6 className={styles.texts}>{copy.info.third}</h6>
            </div>
            <Image src={earthBackgroundImg} className={`${styles.backgroundImage} zoomIn`} />
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Login;
