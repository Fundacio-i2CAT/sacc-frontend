import React, { Component } from "react";
import "../scss/styles.scss";

// react bootstrap
import Container from "react-bootstrap/Container";

import getWeb3 from "../shared/utils/getWeb3";
import { setTokenHeader } from "../network/api";
import contractAbi from "../contracts/abi";

// components
import RequestAccessUserContainer from "./RequestAccessUserContainer/RequestAccessUserContainer";
import Header from "../layout/Header/Header";
import Loading from "../layout/Loading";
import Login from "../components/Login/Login";
import EndUserDashboard from "./EndUserDashboard/EndUserDashboard";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import ResearchInstitutionManagerDashboard from "./ResearchInstitutionManagerDashboard/ResearchInstitutionManagerDashboard";

class App extends Component {
  state = {
    accounts: null,
    contract: null,
    role: null,
    web3: null,
    token: sessionStorage.token || ""
  };

  changeView(token) {
    this.setState({ token });
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
        contractAbi,
        process.env.REACT_APP_CONTRACT_ADDRESS
      );
      const role = await contract.methods.userRoles(accounts[0]).call();
      this.setState({ web3, accounts, contract, role });
    } catch (error) {
      alert(
        `Error al carregar el web3, els comptes o el contracte. Consulta la consulta per a veure els detalls.`
      );
      console.error(error);
    }

    window.ethereum.on("accountsChanged", async accounts => {
      setTokenHeader(false);
      const { contract } = this.state;
      const role = await contract.methods.userRoles(accounts[0]).call();
      this.setState({ accounts, role, token: "" });
    });
  };

  render() {
    const { web3, accounts, contract, role, token } = this.state;
    // loading screen
    if (!web3) {
      return <Loading />;
    }
    // login screen
    if (token === "") {
      return (
        <Login
          web3={web3}
          accounts={accounts}
          auth={this.changeView.bind(this)}
        />
      );
    }
    return (
      <Container fluid={true} className="d-flex flex-column p-0">
        <Header accounts={accounts} role={role} />
        {role === 0 && (
          <RequestAccessUserContainer accounts={accounts} contract={contract} />
        )}
        {role === 1 && (
          <EndUserDashboard accounts={accounts} contract={contract} />
        )}
        {role === 3 && (
          <AdminDashboard
            accounts={accounts}
            contract={contract}
            auth={this.changeView.bind(this)}
          />
        )}
        {role === 4 && (
          <ResearchInstitutionManagerDashboard
            accounts={accounts}
            contract={contract}
          />
        )}
      </Container>
    );
  }
}
export default App;
