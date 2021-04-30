// @flow

import React, { Component } from 'react';
import styles from './Header.module.scss';
import copy from './Header.copy';

// react bootstrap
import ListGroup from 'react-bootstrap/ListGroup';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import getUser from '../../services/getUser.service';
import { Roles } from '../../shared/utils/roles';
import type { UserType } from '../../shared/types/UserType';

type Props = { accounts: string[], role: number };
type State = { user: UserType };


class Header extends Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = { user: undefined };
  }

  async componentDidMount() {
    const { accounts, role } = this.props;

    if (role === 1 || role === 4) {
      const user = await getUser(accounts[0]);

      this.setState({ user })
    }
  }

  renderOverlay(user: UserType): any {
    return (
      <Popover title='Dades'>
        <ListGroup variant='flush'>
          {user.email && <ListGroup.Item>{user.email}</ListGroup.Item>}
          {user.phone && <ListGroup.Item>{user.phone}</ListGroup.Item>}
          {user.cardId && <ListGroup.Item>{user.cardId}</ListGroup.Item>}
        </ListGroup>
      </Popover>
    )
  }

  render() {
    const { role } = this.props;
    const { user } = this.state;

    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">{copy.appTitle}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" />
        <div className={styles.userInfoContainer}>
          {user &&
            <>
              <h5 className={styles.label}>{copy.userNameLabel}</h5>
              <OverlayTrigger trigger='hover' placement='right' overlay={this.renderOverlay(user)}>
                <h5 className={styles.badge}>
                  {user.institutionName ? user.institutionName : `${user.surnames}, ${user.name}`}
                </h5>
              </OverlayTrigger>
            </>
          }
          <h5 className={styles.label}>{copy.userRoleLabel}</h5>
          <h5 className={styles.badge}>{Roles[role]}</h5>
        </div>
      </Navbar>
    );
  }
}
export default Header;
