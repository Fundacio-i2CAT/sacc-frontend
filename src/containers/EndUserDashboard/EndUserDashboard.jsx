// @flow

import React, { Component } from "react";
import styles from "./EndUserDashboard.module.scss";
import copy from "./EndUserDashboard.copy";

import EthCrypto from "eth-crypto";

// react bootstrap
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// components
import EmptyRequests from "../../components/EmptyRequests/EmptyRequests";
import ModalForm from "../../components/ModalForm/ModalForm";

import { apiCall } from "../../network/api";

type Props = { accounts: any[], contract: any };
type State = {
  requesters: any[],
  granted: any[],
  showModal: boolean,
  filePassword: string
};

class EndUserDashboard extends Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      requesters: [],
      granted: [],
      showModal: false,
      filePassword: ""
    };
  }

  providePassword = filePassword => {
    this.setState({ filePassword });
  };

  handleAccept = async (address: string, publicKey: string, e: any): void => {
    const { accounts, contract } = this.props;
    const { requesters, filePassword } = this.state;

    if (filePassword === "") {
      this.setState({ showModal: true });
    } else {
      e.preventDefault();
      const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey,
        filePassword
      );
      contract.methods
        .grantPermissionToInstitution(address)
        .send({ from: accounts[0], gas: "500000" })
        .on("transactionHash", async () => {
          try {
            await apiCall("put", `/accessRequest/${address}`, {
              pendingBC: true,
              encryptedPassword: encrypted
            });
            const updatedRequesters = requesters.filter(
              e => e.address !== address
            );
            this.setState({ requesters: updatedRequesters });
          } catch (err) {
            console.log(err);
          }
        });
    }
  };

  handleReject = async (address: string, e: any): void => {
    e.preventDefault();
    const { requesters } = this.state;

    try {
      await apiCall("delete", `/accessRequest/${address}`);
      const updatedRequesters = requesters.filter(e => e.address !== address);
      this.setState({
        requesters: updatedRequesters
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleRevoke = (address: string, e: any): void => {
    e.preventDefault();
    const { accounts, contract } = this.props;
    const { granted } = this.state;

    contract.methods
      .revokePermissionToInstitution(address)
      .send({ from: accounts[0], gas: "500000" })
      .on("transactionHash", async () => {
        try {
          await apiCall("put", `/accessRequest/${address}`, {
            pendingBC: true
          });
          const updatedRequesters = granted.filter(e => e.address !== address);
          this.setState({ granted: updatedRequesters });
        } catch (err) {
          console.log(err);
        }
      });
  };

  async componentDidMount() {
    const response = await apiCall("get", "/accessRequests");
    const requesters = response.data.accessRequests
      .filter(
        e => e.granted === false && e.revoked === false && e.pendingBC === false
      )
      .map(e => {
        return {
          institutionName: e.researchInstitutionManager.institutionName,
          address: e.publicKey.address,
          publicKey: e.publicKey.publicKey
        };
      });
    const granted = response.data.accessRequests
      .filter(
        e => e.granted === true && e.revoked === false && e.pendingBC === false
      )
      .map(e => e.researchInstitutionManager);
    this.setState({ requesters, granted });
  }

  render() {
    const { requesters, granted, showModal } = this.state;
    const requestedList = requesters.map((r, i) => (
      <ListGroup variant="flush" key={i}>
        <ListGroup.Item>
          <ButtonGroup className="mr-5">{r.institutionName}</ButtonGroup>
          <ButtonGroup className="mr-5">{r.address}</ButtonGroup>
          <ButtonGroup className="mr-2">
            <Button
              variant="outline-info"
              onClick={this.handleAccept.bind(this, r.address, r.publicKey)}
            >
              {copy.application.listItemAccept}
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              variant="outline-danger"
              onClick={this.handleReject.bind(this, r.address)}
            >
              {copy.application.listItemDecline}
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      </ListGroup>
    ));
    const grantedList = granted.map((g, i) => (
      <ListGroup variant="flush" key={i}>
        <ListGroup.Item>
          <ButtonGroup className="mr-5">{g.institutionName}</ButtonGroup>
          <ButtonGroup className="mr-5">{g.address}</ButtonGroup>
          <ButtonGroup>
            <Button
              variant="outline-dark"
              onClick={this.handleRevoke.bind(this, g.address)}
            >
              {copy.granted.listItemRevoke}
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      </ListGroup>
    ));
    return (
      <Container
        fluid={true}
        className={`${styles.container} full-height-container`}
      >
        <div className={styles.mask} />
        <Container
          className={`d-flex ${styles.containerContent} full-height-container`}
        >
          <Row>
            <Col className={`${styles.sectionContainer} ${styles.requested}`}>
              <div className={styles.title}>
                <h4>{copy.application.title}</h4>
              </div>
              {requestedList.length !== 0 ? (
                <ul>{requestedList}</ul>
              ) : (
                <EmptyRequests
                  imageAlt={copy.imgAlts.noRequests}
                  text={copy.application.noRequests}
                />
              )}
            </Col>
            <Col className={`${styles.sectionContainer} ${styles.granted}`}>
              <div className={styles.title}>
                <h4>{copy.granted.title}</h4>
              </div>
              {grantedList.length !== 0 ? (
                <ul>{grantedList}</ul>
              ) : (
                <EmptyRequests
                  imageAlt={copy.imgAlts.noRequests}
                  text={copy.application.noRequests}
                />
              )}
            </Col>
          </Row>
        </Container>
        <ModalForm
          show={showModal}
          onHide={() => this.setState({ showModal: false })}
          providePassword={this.providePassword}
          type={"passwordProvider"}
        />
      </Container>
    );
  }
}
export default EndUserDashboard;
