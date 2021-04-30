// @flow

import React, { Component } from "react";
import copy from "./RequestAccessEndUserForm.copy";

// react bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type Props = {
  handleSubmit: (event: any) => Promise<void>,
  handleBack: () => void
};
type State = {};

class RequestAccessEndUserForm extends Component<Props, State> {
  handleSubmit(e: any): void {
    e.preventDefault();
    this.props.handleSubmit(e);
  }

  handleBack = (e: any): void => {
    e.preventDefault();
    this.props.handleBack();
  };

  render():
    | boolean
    | number
    | string
    | React$Element<*>
    | React$Portal
    | Iterable<any>
    | null {
    return (
      <Container className="bg-white pt-lg-5 pr-5 pb-3 pl-5 shadow full-height-container">
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <Form.Row>
                <Form.Label>
                  <h3 className="text-primary">{copy.title}</h3>
                </Form.Label>
              </Form.Row>
              <Form.Row className="mt-3">
                <Form.Group as={Col}>
                  <Form.Label>{copy.form.labels.lastName}</Form.Label>
                  <Form.Control
                    required
                    placeholder={copy.form.placeholders.lastName}
                    size="lg"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>{copy.form.labels.firstName}</Form.Label>
                  <Form.Control
                    required
                    placeholder={copy.form.placeholders.firstName}
                    size="lg"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row className="mt-3">
                <Form.Group as={Col}>
                  <Form.Label>{copy.form.labels.email}</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder={copy.form.placeholders.email}
                    size="lg"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>{copy.form.labels.phone}</Form.Label>
                  <Form.Control
                    placeholder={copy.form.placeholders.phone}
                    size="lg"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row className="mt-3">
                <Form.Group as={Col}>
                  <Form.Label>{copy.form.labels.cardId}</Form.Label>
                  <Form.Control
                    placeholder={copy.form.placeholders.cardId}
                    size="lg"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>{copy.form.labels.url}</Form.Label>
                  <Form.Control
                    placeholder={copy.form.placeholders.url}
                    size="lg"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row className="mt-3">
                <p>
                  Al proporcionar un telèfon s'escau que se'm pugui contactar
                  per mitjà d'ell. Més sobre la política de privacitat a
                </p>
                <Nav.Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.i2cat.net/privacy-policy/"
                >
                  https://www.i2cat.net/privacy-policy/
                </Nav.Link>
              </Form.Row>
              <Form.Row className="mt-5">
                <Form.Group as={Col}>
                  <Button
                    variant="primary"
                    onClick={this.handleBack.bind(this)}
                    className="mr-3"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    {copy.buttons.back}
                  </Button>
                  <Button variant="primary" type="submit">
                    {copy.buttons.accept}
                  </Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default RequestAccessEndUserForm;
