// @flow

import React, { Component } from "react";
import styles from "./AdminDashboard.module.scss";
import copy from "./AdminDashboard.copy";
import "../../scss/custom.scss";

// react bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

// components
import EmptyRequests from "../../components/EmptyRequests/EmptyRequests";

import { apiCall } from "../../network/api";
import { USER_TYPE_ENUM } from "../../shared/enums/UsersTypeEnum";
import type { UserTypesType } from "../../shared/enums/UsersTypeEnum";
import ToggleButton from "react-bootstrap/ToggleButton";
import profileImage from "../../assets/img/user_profile_female.jpg";
import type { UserType } from "../../shared/types/UserType";
import AdminDetailedView from "../../components/AdminDetailedView/AdminDetailedView"

type Props = { accounts: any, contract: any };
type State = {
  isLoading: boolean,
  institutionsPage: number,
  institutionsPerPage: number,
  institutionsTotalPages: number,
  endUsersPage: number,
  endUsersPerPage: number,
  endUsersTotalPages: number,
  requestedInstitutions: any[],
  requestedEndUsers: any[],
  view: UserTypesType,
  showAdminDetailedView: boolean,
  selectedUserDetail: object
};

class AdminDashboard extends Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      isLoading: true,
      institutionsPage: 1,
      institutionsPerPage: 2,
      institutionsTotalPages: 0,
      endUsersPage: 1,
      endUsersPerPage: 2,
      endUsersTotalPages: 0,
      requestedInstitutions: [],
      requestedEndUsers: [],
      registeredInstitutions: [],
      registeredEndUsers: [],
      registeredEndUsersPage: 1,
      registeredEndUserTotalPages: 0,
      registeredInstitutionsPage: 1,
      registeredInstitutionsTotalPages: 0,
      view: USER_TYPE_ENUM.END_USER,
      showAdminDetailedView: false,
      selectedUserDetail: {}
    };
    this.hideDetails = this.hideDetails.bind(this);
  }

  // lifecycle hooks
  async componentDidMount() {
    const {
      endUsersPerPage,
      institutionsPerPage,
      endUsersPage,
      institutionsPage,
      registeredEndUsersPage,
      registeredInstitutionsPage
    } = this.state;
    const urlEndUsers: string = this.buildRegisterRequestUrl(
      endUsersPage,
      endUsersPerPage
    );
    const urlInstitutions: string = this.buildRegisterRequestUrl(
      institutionsPage,
      institutionsPerPage,
      true
    );
    const urlRegisteredEndUser = `/user?page=${registeredEndUsersPage}&limit=${endUsersPerPage}`;
    const urlRegisteredInstitutions = `/user?role=RESEARCH_INSTITUTION_MANAGER&page=${registeredInstitutionsPage}&limit=${institutionsPerPage}`;

    try {
      const endUsers = await apiCall("get", urlEndUsers);
      const institutions = await apiCall("get", urlInstitutions);
      const endUsersTotalPages = Math.ceil(
        endUsers.data.totalDocs / endUsersPerPage
      );
      const institutionsTotalPages = Math.ceil(
        institutions.data.totalDocs / institutionsPerPage
      );
      const endUsersRegistered = await apiCall("get", urlRegisteredEndUser);
      const institutionsRegistered = await apiCall(
        "get",
        urlRegisteredInstitutions
      );
      const registeredEndUserTotalPages = Math.ceil(
        endUsersRegistered.data.totalDocs / endUsersPerPage
      );
      const registeredInstitutionsTotalPages = Math.ceil(
        institutionsRegistered.data.totalDocs / institutionsPerPage
      );
      this.setState({
        isLoading: false,
        endUsersTotalPages,
        institutionsTotalPages,
        requestedEndUsers: endUsers.data.registerRequests,
        requestedInstitutions: institutions.data.registerRequests,
        registeredEndUsers: endUsersRegistered.data.users,
        registeredInstitutions: institutionsRegistered.data.users,
        registeredEndUserTotalPages,
        registeredInstitutionsTotalPages
      });
    } catch (err) {
      console.log(err);
    }
  }

  setUserRoleCode(role: UserTypesType): number | null {
    switch (role) {
      case USER_TYPE_ENUM.END_USER:
        return 1;
      case USER_TYPE_ENUM.INSTITUTION:
        return 4;
      default:
        return null;
    }
  }

  async setPagination(
    items: any,
    itemsPerPage: number,
    currentPage: number,
    isInstitution?: boolean
  ): Promise<void> {
    const totalPages: number = Math.ceil(items.data.totalDocs / itemsPerPage);
    let nextPage = currentPage;
    if (totalPages === currentPage - 1) {
      nextPage = currentPage - 1;
      const url: string = this.buildRegisterRequestUrl(
        nextPage,
        itemsPerPage,
        isInstitution
      );
      items = await apiCall("get", url);
    }

    this.setNewItemsAndPaginationState(
      items,
      totalPages,
      nextPage,
      isInstitution
    );
  }

  setNewItemsAndPaginationState(
    items: any,
    totalPages: number,
    nextPage?: number,
    isInstitution?: boolean
  ): void {
    if (isInstitution) {
      this.setState({
        requestedInstitutions: items.data.registerRequests,
        institutionsTotalPages: totalPages,
        institutionsPage: nextPage
      });
    } else {
      this.setState({
        requestedEndUsers: items.data.registerRequests,
        endUsersTotalPages: totalPages,
        endUsersPage: nextPage
      });
    }
  }

  buildRegisterRequestUrl(
    page: number,
    limit: number,
    isInstitution?: boolean
  ): string {
    const url = "registerRequest";
    const queryEndUsers = new URLSearchParams();
    if (isInstitution) {
      queryEndUsers.append("role", USER_TYPE_ENUM.INSTITUTION);
    }
    queryEndUsers.append("limit", limit.toString());
    queryEndUsers.append("page", page.toString());

    return [url, "?", queryEndUsers.toString()].join("");
  }

  hideDetails = () => {
    this.setState({ showAdminDetailedView: false })
  }

  // event handlers
  handleRegister = async (address: any, role: UserTypesType, e: any) => {
    e.preventDefault();
    const { accounts, contract } = this.props;
    const {
      endUsersPerPage,
      institutionsPerPage,
      endUsersPage,
      institutionsPage
    } = this.state;
    const roleCode: number | null = this.setUserRoleCode(role);

    try {
      contract.methods
        .setUserRole(address, roleCode)
        .send({ from: accounts[0], gas: "500000" })
        .on("transactionHash", async () => {
          try {
            await apiCall("put", `/registerRequest/${address}`, {
              pendingBC: true
            });
            if (roleCode === 1) {
              let endUsers: any;
              const url: string = this.buildRegisterRequestUrl(
                endUsersPage,
                endUsersPerPage
              );

              endUsers = await apiCall("get", url);
              this.setPagination(endUsers, endUsersPerPage, endUsersPage);
            } else if (roleCode === 4) {
              let institutions;
              const url: string = this.buildRegisterRequestUrl(
                institutionsPage,
                institutionsPerPage,
                true
              );

              institutions = await apiCall("get", url);
              this.setPagination(
                institutions,
                institutionsPerPage,
                institutionsPage,
                true
              );
            }
          } catch (err) {
            console.log(err);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleIgnore = async (address: any, role: UserTypesType, e: any) => {
    e.preventDefault();
    const {
      endUsersPerPage,
      institutionsPerPage,
      endUsersPage,
      institutionsPage
    } = this.state;
    const roleCode: number | null = this.setUserRoleCode(role);

    try {
      let endUsers, institutions;

      await apiCall("delete", "registerRequest/" + address);

      if (roleCode === 1) {
        const url: string = this.buildRegisterRequestUrl(
          endUsersPage,
          endUsersPerPage
        );

        endUsers = await apiCall("get", url);
        this.setPagination(endUsers, endUsersPerPage, endUsersPage);
      } else if (roleCode === 4) {
        const url: string = this.buildRegisterRequestUrl(
          institutionsPage,
          institutionsPerPage,
          true
        );

        institutions = await apiCall("get", url);
        this.setPagination(
          institutions,
          institutionsPerPage,
          institutionsPage,
          true
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  handlePageChangeEndUsers = async (e: any): Promise<void> => {
    e.preventDefault();
    const { endUsersPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const url: string = this.buildRegisterRequestUrl(page, endUsersPerPage);
    const endUsers = await apiCall("get", url);

    this.setState({
      requestedEndUsers: endUsers.data.registerRequests,
      endUsersPage: page
    });
  };

  handlePageChangeInstitutions = async (e: any): Promise<void> => {
    e.preventDefault();
    const { institutionsPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const url: string = this.buildRegisterRequestUrl(
      page,
      institutionsPerPage,
      true
    );
    const institutions = await apiCall("get", url);

    this.setState({
      requestedInstitutions: institutions.data.registerRequests,
      institutionsPage: page
    });
  };

  handlePageChangePendingEndUsers = async (e: any): Promise<void> => {
    e.preventDefault();
    const { endUsersPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const url: string = `/user?page=${page}&limit=${endUsersPerPage}`;
    const endUsers = await apiCall("get", url);
    this.setState({
      registeredEndUsers: endUsers.data.users,
      registeredEndUsersPage: page
    });
  };

  handlePageChangePendingInstitutions = async (e: any): Promise<void> => {
    e.preventDefault();
    const { institutionsPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const url: string = `/user?role=RESEARCH_INSTITUTION_MANAGER&page=${page}&limit=${institutionsPerPage}`;
    const institutions = await apiCall("get", url);
    this.setState({
      registeredInstitutions: institutions.data.users,
      registeredInstitutionsPage: page
    });
  };

  handleViewChangeEvent(val: UserTypesType): void {
    this.setState({ view: val });
  }

  // rendering
  /**
   * renders list of objects or empty state depending on the status of the requests list passed, it also
   * receives an object with all the literals needed to render the view, and they must follow certains structure in
   * order for all the literals contained to render properly
   */
  renderList(
    requestsList: any[],
    items: any[],
    literalsObj: { noRequests: string, requestsHeader: string }
  ): React$Element<any> {
    return (
      <div className="d-flex flex-column align-items-center">
        <h3 className="text-center text-primary mb-lg-4">
          {literalsObj.requestsHeader}
        </h3>
        {requestsList.length !== 0 ? (
          <div className="d-flex flex-column w-50">
            <ListGroup className="w-100">{requestsList}</ListGroup>
            <Pagination className="w-100 justify-content-end">
              {items}
            </Pagination>
          </div>
        ) : (
          <EmptyRequests
            imageAlt={copy.imgAlts.noRequests}
            text={literalsObj.noRequests}
          />
        )}
      </div>
    );
  }

  renderPaginationItem(
    index: number,
    page: number,
    callback: any => Promise<void>
  ): any {
    return (
      <Pagination.Item
        key={index}
        active={index === page - 1}
        onClick={callback}
      >
        {index + 1}
      </Pagination.Item>
    );
  }

  showDetailedView = async (user): void => {
    this.setState({ showAdminDetailedView: true,
      selectedUserDetail: user });
  }

  render() {
    const {
      endUsersPage,
      endUsersTotalPages,
      requestedEndUsers,
      institutionsPage,
      institutionsTotalPages,
      requestedInstitutions,
      registeredEndUsers,
      registeredInstitutions,
      registeredEndUsersPage,
      registeredInstitutionsPage,
      registeredEndUserTotalPages,
      registeredInstitutionsTotalPages,
      showAdminDetailedView
    } = this.state;
    const itemsEndUser = [];
    const itemsInstitution = [];
    const itemsRegisteredEndUser = [];
    const itemsRegisteredInstitution = [];

    for (let i = 0; i < endUsersTotalPages; i++) {
      itemsEndUser.push(
        this.renderPaginationItem(
          i,
          endUsersPage,
          this.handlePageChangeEndUsers
        )
      );
    }

    for (let i = 0; i < institutionsTotalPages; i++) {
      itemsInstitution.push(
        this.renderPaginationItem(
          i,
          institutionsPage,
          this.handlePageChangeInstitutions
        )
      );
    }

    for (let i = 0; i < registeredEndUserTotalPages; i++) {
      itemsRegisteredEndUser.push(
        this.renderPaginationItem(
          i,
          registeredEndUsersPage,
          this.handlePageChangePendingEndUsers
        )
      );
    }

    for (let i = 0; i < registeredInstitutionsTotalPages; i++) {
      itemsRegisteredInstitution.push(
        this.renderPaginationItem(
          i,
          registeredInstitutionsPage,
          this.handlePageChangePendingInstitutions
        )
      );
    }

    const requestedEndUsersList = requestedEndUsers.map(
      (endUser: UserType, i: number): any => (
        <ListGroup.Item
          key={i}
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center">
            <div>
              <img
                src={profileImage}
                alt={copy.common.profilePicture}
                className="rounded-circle mr-3"
                width="66"
              />
            </div>
            <div>
              <h6 className="m-0">
                {endUser.surnames + ", " + endUser.firstName}
              </h6>
              <p className={`${styles.email} m-0 text-secondary`}>
                {endUser.email}
              </p>
            </div>
          </div>
          <ButtonGroup className="mr-2">
            <Button
              variant="outline-info"
              onClick={this.handleRegister.bind(
                this,
                endUser.address,
                endUser.role
              )}
            >
              {copy.common.registerButton}
            </Button>
            <Button
              variant="outline-danger"
              onClick={this.handleIgnore.bind(
                this,
                endUser.address,
                endUser.role
              )}
            >
              {copy.common.ignoreButton}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={this.showDetailedView.bind(
                this,
                endUser
              )}
            >
              {copy.common.detailButton}
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      )
    );

    const requestedInstitutionsList = requestedInstitutions.map(
      (institution: UserType, i: number): any => (
        <ListGroup.Item
          key={i}
          className={`${styles.listItem} d-flex justify-content-between align-items-center`}
        >
          <div>
            <h6 className="m-0">{institution.institutionName}</h6>
            <p className={`${styles.email} m-0 text-secondary`}>
              {institution.surnames + ", " + institution.firstName}
            </p>
            <p className={`${styles.email} m-0 text-secondary`}>
              {institution.email}
            </p>
            <p className={`${styles.email} m-0 text-secondary`}>
              {institution.phone}
            </p>
          </div>
          <ButtonGroup className="mr-2">
            <Button
              variant="outline-info"
              onClick={this.handleRegister.bind(
                this,
                institution.address,
                institution.role
              )}
            >
              {copy.common.registerButton}
            </Button>
            <Button
              variant="outline-danger"
              onClick={this.handleIgnore.bind(
                this,
                institution.address,
                institution.role
              )}
            >
              {copy.common.ignoreButton}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={this.showDetailedView.bind(
                this,
                institution
              )}
            >
              {copy.common.detailButton}
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      )
    );

    const registeredEndUsersList = registeredEndUsers.map((endUser, i) => (
      <ListGroup.Item
        key={i}
        className="d-flex justify-content-between align-items-center"
      >
        <div className="d-flex align-items-center">
          <div>
            <img
              src={profileImage}
              alt={copy.common.profilePicture}
              className="rounded-circle mr-3"
              width="66"
            />
          </div>
          <div>
            <h6 className="m-0">
              {endUser.surnames + ", " + endUser.firstName}
            </h6>
            <p className={`${styles.email} m-0 text-secondary`}>
              {endUser.email}
            </p>
          </div>
        </div>
        <ButtonGroup className="mr-2">
          <Button
            variant="outline-secondary"
            onClick={this.showDetailedView.bind(
              this,
              endUser
            )}
          >
            {copy.common.detailButton}
          </Button>
        </ButtonGroup>
      </ListGroup.Item>
    ));

    const registeredInstitutionsList = registeredInstitutions.map(
      (institution, i) => (
        <ListGroup.Item
          key={i}
          className={`${styles.listItem} d-flex justify-content-between align-items-center`}
        >
          <div>
            <h6 className="m-0">{institution.institutionName}</h6>
            <p className={`${styles.email} m-0 text-secondary`}>
              {institution.surnames + ", " + institution.firstName}
            </p>
            <p className={`${styles.email} m-0 text-secondary`}>
              {institution.email}
            </p>
            <p className={`${styles.email} m-0 text-secondary`}>
              {institution.phone}
            </p>
          </div>
          <ButtonGroup className="mr-2">
            <Button
              variant="outline-secondary"
              onClick={this.showDetailedView.bind(
                this,
                institution
              )}
            >
              {copy.common.detailButton}
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      )
    );
    return (
      <Container
        fluid={true}
        className={`${styles.container} full-height-container pt-3 pb-5`}
      >
        <Container className="bg-white full-height-container shadow pb-4">
          <Row>
            <Col className="p-0">
              <ToggleButtonGroup
                type="radio"
                name="toggleView"
                className="w-100"
                defaultValue={USER_TYPE_ENUM.END_USER}
                onChange={this.handleViewChangeEvent.bind(this)}
              >
                <ToggleButton
                  value={USER_TYPE_ENUM.END_USER}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.endUserButton}
                </ToggleButton>
                <ToggleButton
                  value={USER_TYPE_ENUM.INSTITUTION}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.institutionButton}
                </ToggleButton>
                <ToggleButton
                  value={`${USER_TYPE_ENUM.END_USER}_REGISTERED`}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.endUserRegisteredButton}
                </ToggleButton>
                <ToggleButton
                  value={`${USER_TYPE_ENUM.INSTITUTION}_REGISTERED`}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.institutionRegisteredButton}
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              {this.state.view === USER_TYPE_ENUM.END_USER &&
                this.renderList(
                  requestedEndUsersList,
                  itemsEndUser,
                  copy.endUser
                )}
              {this.state.view === USER_TYPE_ENUM.INSTITUTION &&
                this.renderList(
                  requestedInstitutionsList,
                  itemsInstitution,
                  copy.institution
                )}
              {this.state.view === `${USER_TYPE_ENUM.END_USER}_REGISTERED` &&
                this.renderList(
                  registeredEndUsersList,
                  itemsRegisteredEndUser,
                  copy.endUserRegistered
                )}
              {this.state.view === `${USER_TYPE_ENUM.INSTITUTION}_REGISTERED` &&
                this.renderList(
                  registeredInstitutionsList,
                  itemsRegisteredInstitution,
                  copy.institutionRegistered
                )}
            </Col>
          </Row>

        </Container>
        <AdminDetailedView
          show={showAdminDetailedView}
          onHide={() => this.setState({ showAdminDetailedView: false })}
          hideDetails={this.hideDetails}
          user={this.state.selectedUserDetail}/>
      </Container>
    );
  }
}
export default AdminDashboard;
