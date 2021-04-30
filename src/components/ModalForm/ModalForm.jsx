// @flow

import React, { Component } from "react";
import copy from "./ModalForm.copy";

import EthCrypto from "eth-crypto";

// react bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

type Props = {
  show: boolean,
  onHide: Function,
  type: string,
  endUser: object,
  encryptedData: string,
};
type State = { privateKey: string, password: string, error: any };

class PasswordProviderModal extends Component<Props, State> {
  state = { privateKey: "", password: "", error: "" };

  handleSubmitProvidePassword = (e: any): void => {
    e.preventDefault();
    const { onHide, providePassword } = this.props;
    providePassword(e.target[0].value);
    onHide();
  };

  handleSubmitProvidePrivateKey = async (endUser: any, e: any): void => {
    e.preventDefault();
    const privateKey = e.target[0].value;
    if (privateKey === "") {
      return;
    }
    try {
      const password = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        endUser.encryptedPassword
      );
      this.setState({ privateKey, password });
    } catch (err) {
      this.setState({ privateKey, error: err });
    }
  };

  handleCleanError = (e: any) => {
    e.preventDefault();
    const { onHide } = this.props;
    onHide();
    this.setState({ error: "", privateKey: "" });
  };

  render() {
    const { show, onHide, type, endUser, link, encryptedData } = this.props;
    const { privateKey, password, error } = this.state;
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {type === "info" && (
          <>
            <Modal.Body>
              <Col>
                <Form.Label>{copy[type].url}</Form.Label>
              </Col>
              <Col>
                <Form.Label>{link}</Form.Label>
              </Col>
              <Col>
                <Form.Label>
                  <a href={link}>{copy[type].link}</a>
                </Form.Label>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={onHide}>{copy.closeButton}</Button>
            </Modal.Footer>
          </>
        )}
        {type === "passwordProvider" && (
          <>
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                {copy[type].modalHeader}
              </Modal.Title>
            </Modal.Header>
            <Form onSubmit={this.handleSubmitProvidePassword}>
              <Modal.Body>
                <Form.Label>{copy[type].form.label}</Form.Label>
                <Form.Control size="lg" />
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit">{copy.confirmButton}</Button>
                <Button onClick={onHide}>{copy.closeButton}</Button>
              </Modal.Footer>
            </Form>
          </>
        )}
        {type === "ipfsContingency" && (
          <>
            <Modal.Body>
              <Col>
                <Form.Label>{copy.ipfsContingency.encryptedData}</Form.Label>
              </Col>
              <Col>
                <Form.Label>{encryptedData}</Form.Label>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={onHide}>{copy.closeButton}</Button>
            </Modal.Footer>
          </>
        )}
        {type === "passwordGetter" && (
          <>
            {privateKey === "" && error === "" && (
              <>
                <Modal.Header>
                  <Modal.Title id="contained-modal-title-vcenter">
                    {copy[type].modalHeader}
                  </Modal.Title>
                </Modal.Header>
                <Form
                  onSubmit={this.handleSubmitProvidePrivateKey.bind(
                    this,
                    endUser
                  )}
                >
                  <Modal.Body>
                    <Form.Label>{copy[type].form.label}</Form.Label>
                    <Form.Control size="lg" />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit">{copy.confirmButton}</Button>
                    <Button onClick={onHide}>{copy.closeButton}</Button>
                  </Modal.Footer>
                </Form>
              </>
            )}
            {privateKey !== "" && error === "" && (
              <>
                <Modal.Header>
                  <Modal.Title id="contained-modal-title-vcenter">
                    {copy[type].modalHeader}
                  </Modal.Title>
                </Modal.Header>
                <Form>
                  <Modal.Body>
                    <Col>
                      <Form.Label>{copy[type].password}</Form.Label>
                    </Col>
                    <Col>
                      <Form.Label>{password}</Form.Label>
                    </Col>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={onHide}>{copy.closeButton}</Button>
                  </Modal.Footer>
                </Form>
              </>
            )}
            {privateKey !== "" && error !== "" && (
              <Form>
                <Modal.Body>
                  <Form.Label>{copy[type].incorrectKey}</Form.Label>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.handleCleanError}>
                    {copy.closeButton}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </>
        )}
      </Modal>
    );
  }
}

export default PasswordProviderModal;
