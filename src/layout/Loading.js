import React, { Component } from 'react';
import '../components/Login/Login.module.scss';

// react bootstrap
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

class Loading extends Component {
  render() {
    return (
      <Container fluid={true} style={Styles.loadingContainer}>
        <h1>Loading</h1>
        <div style={{ marginTop: '2.2em' }}>
          <Spinner animation='grow' variant='info' />
          <Spinner animation='grow' variant='info' />
          <Spinner animation='grow' variant='info' />
        </div>
      </Container>
    );
  }
}
export default Loading;

const Styles = {
  loadingContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '77vh',
  }
};
