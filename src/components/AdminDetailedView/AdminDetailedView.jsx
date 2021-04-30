// @flow

import React, { Component } from 'react'
import copy from './AdminDetailedView.copy';

// react bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';

import profileImage from "../../assets/img/user_profile_female.jpg";

type Props = {show: boolean, onHide: Function, type: string, endUser: object}

class AdminDetailedView extends Component<Props> {
  render() {
    const { show, onHide } = this.props;
    return (
      <Modal
        show={show}
        onHide={onHide}
        size='md'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
      <Card style={{ width: '32rem' }}>
        <Card.Header>{copy.details}</Card.Header>
        <Card.Body>
        <div>
              <img
                src={profileImage}
                alt={copy.profilePicture}
                className="rounded-circle mr-3"
                width="100"
              />
            </div>
           <Card.Title>{this.props.user.surnames}, {this.props.user.firstName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{this.props.user.institutionName}</Card.Subtitle>
            <Card.Text>
                    {copy.phone}: <b>{this.props.user.phone}</b>
                    <br/>
                    {copy.email}: <b>{this.props.user.email}</b>
                    <br/>
                    {copy.address}: <b>{this.props.user.address}</b>
           </Card.Text>
           <Button variant="primary" onClick={this.props.hideDetails}>{copy.close}</Button>
         </Card.Body>
          <footer className="blockquote-footer">
            {this.props.user.createdAt}
          </footer>
        </Card>
      </Modal>
    );
  }
}

export default AdminDetailedView;
