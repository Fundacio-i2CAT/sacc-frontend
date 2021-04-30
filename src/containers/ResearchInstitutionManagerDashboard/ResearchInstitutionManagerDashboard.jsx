// @flow

import React, { Component } from "react";
import styles from "./ResearchInstitutionManagerDashboard.module.scss";
import copy from "./ResearchInstitutionManagerDashboard.copy";
import profileImage from "../../assets/img/user_profile_female.jpg";
import { apiCall } from "../../network/api";

// react bootstrap
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import ListGroup from "react-bootstrap/ListGroup";
import { Form } from "react-bootstrap";

// recharts components
import { PieChart, Pie, Cell } from "recharts";

// components
import ModalForm from "../../components/ModalForm/ModalForm";
import EmptyRequests from "../../components/EmptyRequests/EmptyRequests";

const REQUEST_TYPES_NUMBER = 4;
const VIEWS = {
  REQUEST_ACCESS: "REQUEST_ACCESS",
  SUMMARY: "SUMMARY",
  AVAILABLE_DATA_LIST: "AVAILABLE_DATA_LIST",
  NOT_AVAILABLE_DATA_LIST: "NOT_AVAILABLE_DATA_LIST",
  PENDING_DATA_LIST: "PENDING_DATA_LIST",
  REJECTED_DATA_LIST: "REJECTED_DATA_LIST",
};
type Props = {};
type State = {
  view: string,
  totalEndUsers: string,
  alertSuccess: boolean,
  showModalLink: [boolean],
  showModalPrivateKey: [boolean],
  projectTitle: [string],
  projectDescription: [string],
  secretKey: string,
  showModalData: [boolean],
  encryptedData: [string],
};

class ResearchInstitutionManagerDashboard extends Component<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      view: VIEWS.REQUEST_ACCESS,
      totalEndUsers: "",
      topics: [],
      alertSuccess: false,
      showModalLink: [],
      showModalPrivateKey: [],
      showModalData: [],
      encryptedData: [],
      projectTitle: "",
      projectDescription: "",
      secretKey: "",

      grantedUsersTotalPages: 0,
      currentPageGranted: [],
      grantedUsersPerPage: 2,
      grantedUsersPage: 1,

      revokedUsersTotalPages: 0,
      currentPageRevoked: [],
      revokedUsersPerPage: 2,
      revokedUsersPage: 1,

      pendingUsersTotalPages: 0,
      currentPagePending: [],
      pendingUsersPerPage: 2,
      pendingUsersPage: 1,

      rejectedUsersTotalPages: 0,
      currentPageRejected: [],
      rejectedUsersPerPage: 2,
      rejectedUsersPage: 1,

      projectsTotalPages: 0,
      currentPageProjects: [],
      projectsPerPage: 2,
      projectsPage: 1,
    };
  }

  async componentDidMount(): Promise<void> {
    const {
      grantedUsersPerPage,
      revokedUsersPerPage,
      pendingUsersPerPage,
      rejectedUsersPerPage,
      projectsPerPage,
    } = this.state;
    const endUsers = await apiCall("get", "/endUserCount");
    const projects = await apiCall("get", `/projects?limit=${projectsPerPage}`);
    const topics = await apiCall("get", "/topic");
    const grantedRequests = await apiCall(
      "get",
      `/accessRequests?filter=granted&limit=${grantedUsersPerPage}`
    );
    const revokedRequests = await apiCall(
      "get",
      `/accessRequests?filter=revoked&limit=${revokedUsersPerPage}`
    );
    const pendingRequests = await apiCall(
      "get",
      `/accessRequests?filter=pending&limit=${pendingUsersPerPage}`
    );
    const rejectedRequests = await apiCall(
      "get",
      `/accessRequests?filter=rejected&limit=${rejectedUsersPerPage}`
    );
    this.setState(
      {
        totalEndUsers: endUsers.data.endUserCount,
        topics: topics.data.topics,
        currentPageGranted: grantedRequests.data.accessRequests,
        grantedUsersTotalPages: grantedRequests.data.totalPages,
        currentPageRevoked: revokedRequests.data.accessRequests,
        revokedUsersTotalPages: revokedRequests.data.totalPages,
        currentPagePending: pendingRequests.data.accessRequests,
        pendingUsersTotalPages: pendingRequests.data.totalPages,
        currentPageRejected: rejectedRequests.data.accessRequests,
        rejectedUsersTotalPages: rejectedRequests.data.totalPages,
        projectsTotalPages: projects.data.totalPages,
        currentPageProjects: projects.data.projects,
        projectsPage: projects.data.page,
      },
      () => {
        const {
          showModalPrivateKey,
          showModalLink,
          showModalData,
          encryptedData,
          currentPageGranted,
        } = this.state;
        currentPageGranted.forEach((g) => {
          showModalPrivateKey.push(false);
          showModalLink.push(false);
          showModalData.push(false);
          encryptedData.push("");
        });
        this.setState({
          showModalPrivateKey,
          showModalLink,
          showModalData,
          encryptedData,
        });
      }
    );
  }

  showProvidePrivateKeyForm = (i: any, e: any): void => {
    e.preventDefault();
    const { showModalPrivateKey } = this.state;
    let newshowModalPrivateKey = showModalPrivateKey.map((element, index) => {
      if (i === index) {
        return true;
      } else {
        return false;
      }
    });
    this.setState({
      showModalPrivateKey: newshowModalPrivateKey,
    });
  };

  showLinkForm = (i: any, e: any): void => {
    const { showModalLink } = this.state;
    let newshowModalLink = showModalLink.map((element, index) => {
      if (i === index) {
        return true;
      } else {
        return false;
      }
    });
    this.setState({
      showModalLink: newshowModalLink,
    });
  };

  showGetCypheredData = async (
    endUserAddress: string,
    i: any,
    e: any
  ): Promise<void> => {
    e.preventDefault();
    const { showModalData, encryptedData } = this.state;
    let newshowModalData = showModalData.map((element, index) => {
      if (i === index) {
        return true;
      } else {
        return false;
      }
    });
    const file = await apiCall(
      "get",
      `/upload?endUserAddress=${endUserAddress}`
    );
    const newEncryptedData = encryptedData.map((element, index) => {
      if (i === index) {
        return file.data;
      } else {
        return element;
      }
    });
    this.setState({
      showModalData: newshowModalData,
      encryptedData: newEncryptedData,
    });
  };

  handleRequest = async (e: any): Promise<void> => {
    e.preventDefault();
    try {
      const body = {
        project: { title: e.target[0].value, description: e.target[1].value },
      };
      await apiCall("post", "/accessRequests", body);
      this.setState({ projectTitle: "", projectDescription: "" });
    } catch (err) {
      console.log(err);
    }
    this.setState({ alertSuccess: true });
  };

  handleViewChangeEvent(view: string): void {
    this.setState({ view });
  }

  handlePageChangeGranted = async (e: any): Promise<void> => {
    e.preventDefault();
    const { grantedUsersPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const grantedRequests = await apiCall(
      "get",
      `/accessRequests?filter=granted&limit=${grantedUsersPerPage}&page=${page}`
    );
    this.setState({
      grantedUsersPage: page,
      currentPageGranted: grantedRequests.data.accessRequests,
    });
  };

  handlePageChangeRevoked = async (e: any): Promise<void> => {
    e.preventDefault();
    const { revokedUsersPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const revokedRequests = await apiCall(
      "get",
      `/accessRequests?filter=revoked&limit=${revokedUsersPerPage}&page=${page}`
    );
    this.setState({
      revokedUsersPage: page,
      currentPageRevoked: revokedRequests.data.accessRequests,
    });
  };

  handlePageChangePending = async (e: any): Promise<void> => {
    e.preventDefault();
    const { pendingUsersPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const pendingRequests = await apiCall(
      "get",
      `/accessRequests?filter=pending&limit=${pendingUsersPerPage}&page=${page}`
    );
    this.setState({
      pendingUsersPage: page,
      currentPagePending: pendingRequests.data.accessRequests,
    });
  };

  handlePageChangeRejected = async (e: any): Promise<void> => {
    e.preventDefault();
    const { rejectedUsersPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const rejectedRequests = await apiCall(
      "get",
      `/accessRequests?filter=rejected&limit=${rejectedUsersPerPage}&page=${page}`
    );
    this.setState({
      rejectedUsersPage: page,
      currentPageRejected: rejectedRequests.data.accessRequests,
    });
  };

  handlePageChangeProjects = async (e: any): Promise<void> => {
    e.preventDefault();
    const { projectsPerPage } = this.state;
    const page: number = parseInt(e.target.innerText);
    const projects = await apiCall(
      "get",
      `/projects?limit=${projectsPerPage}&page=${page}`
    );
    this.setState({
      projectsPage: page,
      currentPageProjects: projects.data.projects,
    });
  };

  renderRequestAccessAlert(type: string, message: string): React$Element<*> {
    return (
      <>
        <Row>
          <Col className="d-flex justify-content-center mt-4">
            <Alert variant={type}>{message}</Alert>
          </Col>
        </Row>
      </>
    );
  }

  renderRequestAccess(totalEndUsers: string): React$Element<*> {
    const {
      alertSuccess,
      projectTitle,
      projectDescription,
      topics,
    } = this.state;
    return (
      <>
        <Row>
          <Col
            style={{ marginTop: "5%" }}
            className="d-flex justify-content-center"
          >
            <h3 className="text-primary">{copy.requestPermission.currently}</h3>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center mt-4">
            <h3
              className={`${styles.numberOfEndUsers} d-flex justify-content-center align-items-center`}
            >
              {totalEndUsers}
            </h3>
          </Col>
        </Row>
        {topics.length !== 0 && (
          <>
            <Row style={{ marginTop: "7.5%" }}>
              <Col className="d-flex justify-content-center">
                <h3 className="text-primary">{copy.topics.title}</h3>
              </Col>
            </Row>
            <Row
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {topics.map((t, i) => (
                <div
                  key={i}
                  style={{
                    marginRight: "7.5%",
                    marginLeft: "7.5%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <div className="mt-4">
                    <h3 style={{ color: "orange" }}>{t.title}</h3>
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-2">
                    <h3
                      className={`${styles.numberOfEndUsers} d-flex justify-content-center align-items-center`}
                    >
                      {t.userCount}
                    </h3>
                  </div>
                </div>
              ))}
            </Row>
          </>
        )}
        <Row style={{ marginTop: "7.5%" }}>
          <Col className="d-flex justify-content-center">
            <h3 className="text-primary">{copy.requestPermission.title}</h3>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Form onSubmit={this.handleRequest.bind(this)}>
              <Form.Group controlId="projectTitle">
                <Form.Control
                  onChange={(event) =>
                    this.setState({ projectTitle: event.target.value })
                  }
                  placeholder={copy.requestPermission.projectTitlePlaceholder}
                  value={projectTitle}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <Form.Group controlId="projectDescription">
                <Form.Control
                  placeholder={
                    copy.requestPermission.projectDescriptionPlaceholder
                  }
                  onChange={(event) =>
                    this.setState({ projectDescription: event.target.value })
                  }
                  value={projectDescription}
                  as="textarea"
                  rows="5"
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <div className="d-flex justify-content-center mt-3 mb-3">
                <Button variant="primary" type="submit">
                  {copy.requestPermission.acceptButton}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        {alertSuccess &&
          this.renderRequestAccessAlert(
            "success",
            copy.requestPermission.success
          )}
      </>
    );
  }

  renderPaginationItem(index, page, callback) {
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

  renderEndUsersList(type, availableList, items) {
    return (
      <div className="d-flex flex-column align-items-center pt-5">
        <h3 className="text-center text-primary mb-lg-4">{copy[type].title}</h3>
        {availableList.length !== 0 ? (
          <div className="d-flex flex-column w-50">
            <ListGroup className="w-100">{availableList}</ListGroup>
            <Pagination className="w-100 justify-content-end">
              {items}
            </Pagination>
          </div>
        ) : (
          <EmptyRequests text={copy[type].none} />
        )}
      </div>
    );
  }

  renderEndUserItems(type: string, accessRequests: any[]): React$Element<any> {
    const {
      showModalPrivateKey,
      showModalLink,
      showModalData,
      encryptedData,
    } = this.state;
    return accessRequests.map((accessRequest: any, i: number): any => (
      <ListGroup.Item
        key={i}
        className="d-flex justify-content-between align-items-center mb-4"
      >
        <div className="d-flex align-items-center">
          <div>
            <img
              src={profileImage}
              alt={copy.profilePicture}
              className="rounded-circle mr-3"
              width="66"
            />
          </div>
          <div>
            <h6 className="m-0 mb-3">{`Per al projecte: ${accessRequest.project.title}`}</h6>
            <h6 className="m-0 mb-2">{`Adreça usuari: ${accessRequest.endUserAddress}`}</h6>
            {type === "granted" && (
              <>
                {process.env.REACT_APP_IPFS_CONTINGENCY !== "true" ? (
                  <>
                    <Button
                      variant="outline-info"
                      className="mr-2"
                      onClick={this.showLinkForm.bind(this, i)}
                    >
                      {copy.granted.getLinkButton}
                    </Button>
                    <ModalForm
                      show={showModalLink[i]}
                      onHide={() => {
                        let { showModalLink } = this.state;
                        showModalLink = showModalLink.map(() => false);
                        this.setState({ showModalLink });
                      }}
                      type={"info"}
                      link={accessRequest.dataUrl}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline-info"
                      className="mr-2"
                      onClick={this.showGetCypheredData.bind(
                        this,
                        accessRequest.endUserAddress,
                        i
                      )}
                    >
                      {copy.granted.getEncryptedData}
                    </Button>
                    <ModalForm
                      show={showModalData[i]}
                      onHide={() => {
                        let { showModalData } = this.state;
                        showModalData = showModalData.map(() => false);
                        this.setState({ showModalData });
                      }}
                      type={"ipfsContingency"}
                      encryptedData={encryptedData[i]}
                    />
                  </>
                )}
                <Button
                  variant="outline-info"
                  className="mr-2"
                  onClick={this.showProvidePrivateKeyForm.bind(this, i)}
                >
                  {copy.granted.getFilePassword}
                </Button>
                <ModalForm
                  show={showModalPrivateKey[i]}
                  onHide={() => {
                    let { showModalPrivateKey } = this.state;
                    showModalPrivateKey = showModalPrivateKey.map(() => false);
                    this.setState({ showModalPrivateKey });
                  }}
                  type={"passwordGetter"}
                  endUser={accessRequest}
                />
              </>
            )}
          </div>
        </div>
      </ListGroup.Item>
    ));
  }

  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {percent !== 0 && `${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  renderSummary = (projects, paginationItems) => {
    const allRequestData = [];
    const requestDataPerProject = [];
    const colors = ["#9BB996", "#E8564A", "#EEAA40", "#C1BCBC"];
    const legendStyle = {
      color: "white",
      border: "none",
      padding: 5,
    };
    const names = projects.map((p) => Object.keys(p.stats));
    const requests = projects.map((p) => Object.values(p.stats));
    for (let i = 0; i < projects.length; i++) {
      for (let j = 0; j < REQUEST_TYPES_NUMBER; j++) {
        allRequestData.push({ name: names[i][j], value: requests[i][j] });
      }
    }
    for (let i = 0; i < projects.length; i++) {
      requestDataPerProject.push(
        allRequestData.splice(0, REQUEST_TYPES_NUMBER)
      );
    }
    return projects.length === 0 ? (
      <h3 className="d-flex flex-column text-center text-primary mt-lg-5 pt-5">
        {copy.summary.none}
      </h3>
    ) : (
      <>
        <div className="d-flex flex-column align-items-center pt-5">
          <h3 className="text-center text-primary mb-lg-4">
            {copy.summary.title}
          </h3>
          {projects.map((p, i) => (
            <div
              className="border d-flex flex-column w-100 align-items-center mb-lg-4"
              key={i}
            >
              <h3 className="text-center text-primary mt-lg-4 mb-lg-4 ">
                {p.title}
              </h3>
              <div className="d-flex flex-row" key={i}>
                <PieChart width={400} height={400}>
                  <Pie
                    data={requestDataPerProject[i]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={this.renderCustomizedLabel}
                    labelLine={false}
                  >
                    {requestDataPerProject[i].map((e, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={colors[i % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex-column-reverse">
                  <div className="text-left">
                    <div style={{ ...legendStyle, backgroundColor: colors[0] }}>
                      {`${p.stats.granted} ${copy.navigation.viewGranted}`}
                    </div>
                    <div style={{ ...legendStyle, backgroundColor: colors[1] }}>
                      {`${p.stats.revoked} ${copy.navigation.viewRevoked}`}
                    </div>
                    <div style={{ ...legendStyle, backgroundColor: colors[2] }}>
                      {`${p.stats.pending} ${copy.navigation.viewPending}`}
                    </div>
                    <div style={{ ...legendStyle, backgroundColor: colors[3] }}>
                      {`${p.stats.rejected} ${copy.navigation.viewRejected}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination className="w-100 justify-content-end pb-lg-4">
          {paginationItems}
        </Pagination>
      </>
    );
  };

  render() {
    const {
      view,
      totalEndUsers,
      currentPageGranted,
      currentPageRevoked,
      currentPagePending,
      currentPageRejected,
      currentPageProjects,
      grantedUsersTotalPages,
      revokedUsersTotalPages,
      pendingUsersTotalPages,
      rejectedUsersTotalPages,
      projectsTotalPages,
      grantedUsersPage,
      revokedUsersPage,
      pendingUsersPage,
      rejectedUsersPage,
      projectsPage,
    } = this.state;

    const itemsGranted = [];
    for (let i = 0; i < grantedUsersTotalPages; i++) {
      itemsGranted.push(
        this.renderPaginationItem(
          i,
          grantedUsersPage,
          this.handlePageChangeGranted
        )
      );
    }
    const itemsRevoked = [];
    for (let i = 0; i < revokedUsersTotalPages; i++) {
      itemsRevoked.push(
        this.renderPaginationItem(
          i,
          revokedUsersPage,
          this.handlePageChangeRevoked
        )
      );
    }
    const itemsPending = [];
    for (let i = 0; i < pendingUsersTotalPages; i++) {
      itemsPending.push(
        this.renderPaginationItem(
          i,
          pendingUsersPage,
          this.handlePageChangePending
        )
      );
    }
    const itemsRejected = [];
    for (let i = 0; i < rejectedUsersTotalPages; i++) {
      itemsRejected.push(
        this.renderPaginationItem(
          i,
          rejectedUsersPage,
          this.handlePageChangeRejected
        )
      );
    }
    const itemsProjects = [];
    for (let i = 0; i < projectsTotalPages; i++) {
      itemsProjects.push(
        this.renderPaginationItem(
          i,
          projectsPage,
          this.handlePageChangeProjects
        )
      );
    }

    return (
      <Container fluid className={`${styles.container} full-height-container`}>
        <Container className="full-height-container bg-white shadow">
          <Row>
            <Col className="p-0">
              <ToggleButtonGroup
                type="radio"
                name="toggleView"
                className="w-100"
                defaultValue={VIEWS.REQUEST_ACCESS}
                onChange={this.handleViewChangeEvent.bind(this)}
              >
                <ToggleButton
                  value={VIEWS.REQUEST_ACCESS}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.requestPermission}
                </ToggleButton>
                <ToggleButton
                  value={VIEWS.SUMMARY}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.summary}
                </ToggleButton>
                <ToggleButton
                  value={VIEWS.AVAILABLE_DATA_LIST}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.viewGranted}
                </ToggleButton>
                <ToggleButton
                  value={VIEWS.NOT_AVAILABLE_DATA_LIST}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.viewRevoked}
                </ToggleButton>
                <ToggleButton
                  value={VIEWS.PENDING_DATA_LIST}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.viewPending}
                </ToggleButton>
                <ToggleButton
                  value={VIEWS.REJECTED_DATA_LIST}
                  variant="outline-primary"
                  size="lg"
                  className="pointer rounded-0"
                >
                  {copy.navigation.viewRejected}
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>
          </Row>
          {view === VIEWS.REQUEST_ACCESS &&
            this.renderRequestAccess(totalEndUsers)}
          {view === VIEWS.AVAILABLE_DATA_LIST &&
            this.renderEndUsersList(
              "granted",
              this.renderEndUserItems("granted", currentPageGranted),
              itemsGranted
            )}
          {view === VIEWS.NOT_AVAILABLE_DATA_LIST &&
            this.renderEndUsersList(
              "revoked",
              this.renderEndUserItems("revoked", currentPageRevoked),
              itemsRevoked
            )}
          {view === VIEWS.PENDING_DATA_LIST &&
            this.renderEndUsersList(
              "pending",
              this.renderEndUserItems("pending", currentPagePending),
              itemsPending
            )}
          {view === VIEWS.REJECTED_DATA_LIST &&
            this.renderEndUsersList(
              "rejected",
              this.renderEndUserItems("rejected", currentPageRejected),
              itemsRejected
            )}
          {view === VIEWS.SUMMARY &&
            this.renderSummary(currentPageProjects, itemsProjects)}
        </Container>
      </Container>
    );
  }
}
export default ResearchInstitutionManagerDashboard;
