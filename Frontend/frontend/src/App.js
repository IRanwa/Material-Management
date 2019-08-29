import React, { Component } from 'react';
import { BrowserRouter as Router, Route,Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Suppliers from './suppliers';
import RawMaterials from './rawmaterials';


class App extends Component {
  render(){
    return(
      <Router>
        <div>
          <Route exact path="/" component={Index} />
          <Route path="/homepage" component={HomePage} />
          <Route path="/suppliers" component={SuppliersPage} />
          <Route path="/rawmaterials" component={RawMaterialsPage} />
        </div>
      </Router>
    );
  }
}

class Index extends Component{
  constructor(props){
    super(props);
    this.state = {
      email:"",
      password:""
    }
    this.changeInput = this.changeInput.bind(this);
    this.signBtn = this.signBtn.bind(this);
    this.resetBtn = this.resetBtn.bind(this);
  }

  changeInput(target){
    const name = target.name;
    const value = target.value;
    switch(name){
      case "email":
        this.setState({
          email:value
        })
        break;
      case "password":
        this.setState({
          password:value
        })
        break;
    }
  }

  resetBtn(){
    this.setState({
      email:"",
      password:""
    })
  }

  signBtn(){

  }

  render(){
    return(
      <div>
        <div className="card signin-container">
          <h3 className="text-center">Login</h3>
          <h6 className="signin-text my-2" >Email</h6>
          <input type="text" className="card" value={this.state.email} onChange={(event)=>this.changeInput(event.target)} name="email"/>
          <h6 className="signin-text my-2">Password</h6>
          <input type="password" className="card" value={this.state.password} onChange={(event)=>this.changeInput(event.target)} name="password"/>
          <div className="row text-nowrap">
              <div className="col-lg-6 col-md-12 text-center p-2">
                  <button className="btn-sm btn-danger w-75" onClick={this.resetBtn}>Reset</button>
              </div>
              <div className="col-lg-6 col-md-12 text-center p-2">
                  <button className="btn-sm btn-success w-75" onClick={this.signBtn}>Sign In</button>
              </div>
              
          </div>
        </div>
      </div>
    )
  }
}

class HomePage extends Component{
  render(){
    return(
      <div>

      </div>
    )
  }
}

class SuppliersPage extends Component{
  render(){
    return(
      <div>
        <NavBar/>
        <Suppliers/>
      </div>
    )
  }
}

class RawMaterialsPage extends Component{
  render(){
    return(
      <div>
        <NavBar/>
        <RawMaterials/>
      </div>
    );
  }
}

class NavBar extends Component{
  constructor(props){
    super(props);
    this.state={
      showNav:false,
      mouseMove:false
    }
    this.toggleClick = this.toggleClick.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  toggleClick(){
    this.setState({
      showNav:!this.state.showNav
    })
  }

  signOut(){
    console.log(localStorage);
  }

  render(){
    return(
      <div>
        <nav className="navbar navbar-expand-lg bg-light">
          <a className="navbar-brand" href="/">HomePage</a>
          
          <button className="navbar-toggler" type="button" onClick={this.toggleClick} aria-controls="navbarNavAltMarkup" aria-expanded={this.state.showNav}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" style={{display:this.state.showNav?("block"):("")}}  id="navbarNavAltMarkup">
            
            <div className="navbar-nav w-100">
              <div className="navbar-nav mr-auto">
                <a className="nav-item nav-link nav-sub" href="/suppliers">Suppliers</a>
                <div className="dropdown">
                  <a className="nav-item nav-link" href="#">Materials</a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a className="nav-item nav-link" href="/rawmaterials">Raw Materials</a>
                    <a className="nav-item nav-link" href="/products">Products</a>
                  </div>
                </div>
              </div>
              
             
              <div>
                <div className="dropdown">
                    <a className="nav-item nav-link profile-icon-container">
                      <img src="https://cdn4.iconfinder.com/data/icons/standard-free-icons/139/Profile01-512.png" alt="profile-icon" className="profile-icon"/>
                        
                    </a>
                    <div className="dropdown-menu profile-icon-subcontainer row">
                      {
                        localStorage.email!=undefined?(
                          <div>
                            <div className="column w-100">
                              <h6>Welcome back {localStorage.name}</h6>
                            </div>
                            <div className="column w-100">
                              <a className="profile-icon-item" href="/" onClick={this.signOut}>
                                <img src="https://icon-library.net/images/icon-logout/icon-logout-22.jpg" className="login-sub-icon mr-3"/>Sign Out
                              </a>
                            </div>
                          </div>
                        ):(""
                        )
                      }
                    </div>
                </div>
              </div>
              {/* <a className="nav-item nav-link mr-3" href="/">Log out</a> */}
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default App;
