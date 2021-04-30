// @flow

import React, { Component } from "react";
import styles from "./RequestAccessUserContainer.module.scss";

// react bootstrap
import Container from "react-bootstrap/Container";

import { apiCall } from "../../network/api";
import Loading from "../../layout/Loading";
import { USER_TYPE_ENUM } from "../../shared/enums/UsersTypeEnum";
import type { UserTypesType } from "../../shared/enums/UsersTypeEnum";

// components
import AwaitRequestAccessConfirm from "../../components/AwaitRequestAccessConfirm/AwaitRequestAccessConfirm";
import RequestAccessResearchInstitutionManagerForm from "../../components/RequestAccessResearchInstitutionManagerForm/RequestAccessResearchInstitutionManagerForm";
import RequestAccessEndUserForm from "../../components/RequestAccessEndUserForm/RequestAccessEndUserForm";
import RequestCancelledView from "../../components/RequestCancelledView/RequestCancelledView";
import RequestLanding from "../../components/RequestLanding/RequestLanding";

// define component state structure
type Props = { accounts: any[] };
type State = {
  isRequested: boolean,
  isCanceled: boolean,
  loading: boolean,
  role?: UserTypesType
};

class RequestAccessUserContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isRequested: false,
      isCanceled: false,
      loading: false,
      role: undefined
    };
  }

  // lifecycle hooks
  async componentDidMount(): Promise<void> {
    const { accounts } = this.props;
    try {
      const response = await apiCall(
        "get",
        `registerRequest?address=${accounts[0]}`
      );
      if (response.status === 200) {
        this.setState({ isRequested: true, loading: false });
      } else if (response.status === 204) {
        this.setState({ loading: false });
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleBack = (): void => {
    this.setState({ role: undefined });
  };

  handleChange = (role: UserTypesType): void => {
    this.setState({ role });
  };

  handleSubmit = async (e: any): Promise<void> => {
    const { role } = this.state;

    let event = e.target;
    let user;

    switch (role) {
      case USER_TYPE_ENUM.END_USER:
        user = {
          surnames: event[0].value,
          firstName: event[1].value,
          email: event[2].value,
          phone: event[3].value,
          cardId: event[4].value,
          dataUrl: event[5].value,
          role: USER_TYPE_ENUM.END_USER
        };
        break;
      case USER_TYPE_ENUM.INSTITUTION:
        user = {
          institutionName: event[0].value,
          surnames: event[1].value,
          firstName: event[2].value,
          email: event[3].value,
          phone: event[4].value,
          cardId: event[5].value,
          role: USER_TYPE_ENUM.INSTITUTION
        };
        break;
      default:
    }

    try {
      await apiCall("post", "registerRequest", user);
      this.setState({ isRequested: true });
    } catch (err) {
      console.error(err);
    }
  };

  handleCancel = async (): Promise<void> => {
    const { accounts } = this.props;
    try {
      await apiCall("delete", "registerRequest/" + accounts[0]);
      this.setState({ isRequested: false, isCanceled: true, role: undefined });
      setTimeout(
        function() {
          this.setState({ isCanceled: false });
        }.bind(this),
        3000
      );
    } catch (err) {
      console.log(err);
    }
  };

  render(): any {
    const { isRequested, isCanceled, loading, role } = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <Container className={`${styles.container} full-height-container`} fluid>
        {isRequested ? (
          <AwaitRequestAccessConfirm
            handleCancel={this.handleCancel.bind(this)}
          />
        ) : isCanceled ? (
          <RequestCancelledView />
        ) : (
          <>
            {/*EndUser inscription form*/}
            {role === USER_TYPE_ENUM.END_USER && (
              <RequestAccessEndUserForm
                handleSubmit={this.handleSubmit.bind(this)}
                handleBack={this.handleBack.bind(this)}
              />
            )}
            {/*Salus info and request access action buttons*/}
            {role === USER_TYPE_ENUM.INSTITUTION && (
              <RequestAccessResearchInstitutionManagerForm
                handleSubmit={this.handleSubmit.bind(this)}
                handleBack={this.handleBack.bind(this)}
              />
            )}
            {/*Salus info and request access action buttons*/}
            {!role && <RequestLanding handleChange={this.handleChange} />}
          </>
        )}
      </Container>
    );
  }
}
export default RequestAccessUserContainer;
