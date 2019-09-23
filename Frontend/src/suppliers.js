import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Redirect} from "react-router-dom";
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class Suppliers extends Component{
    constructor(props){
        super(props);
        this.state = {
            addStatus:false,
            deleteStatus:false,
            updateStatus:false,
            popupId:0,
            tableData:[],
            redirectToViewPage:false
        }
        this.statusChange = this.statusChange.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.viewDetails = this.viewDetails.bind(this);
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/supplier/getSupplierList")
        .then(function(res){
            console.log(res);
            that.setState({
                tableData:res.data.suppliers
            })
        }).catch(function(error){
            console.log(error.response);
            alert(error.response.data.message);
        });
    }

    modalClose(){
        const that = this;
        const modal = document.getElementsByClassName("modal")[0];
        window.onclick = function(event) {
            if (event.target === modal) {
              that.setState({
                    addStatus:false,
                    deleteStatus:false,
                    updateStatus:false,
                    popupId:0
              });
            }
        }
    }

    statusChange(command,id){
        if(command==="add"){
            this.setState({
                addStatus:true
            })
        }else if(command==="update"){
            this.setState({
                updateStatus:true,
                popupId:id
            })
        }
        else if(command==="delete"){
            this.setState({
                deleteStatus:true,
                popupId:id
            })
        }
    }

    viewDetails(id){
        this.setState({
            redirectToViewPage:true,
            popupId:id
        });
    }



    render(){
        return(
            <div className="card w-90 p-3 m-5">
                {
                    this.state.addStatus?(
                        <PopupWindow windowStatus="add" modalClose={this.modalClose} popupSubmit={this.popupSubmit}/>
                    ):(
                        ""
                    )
                }
                {
                    this.state.deleteStatus?(
                        <PopupWindow windowStatus="delete" modalClose={this.modalClose} id={this.state.popupId} />
                    ):(
                        ""
                    )
                }
                {
                    this.state.updateStatus?(
                        <PopupWindow windowStatus="update" modalClose={this.modalClose} id={this.state.popupId}/>
                    ):(
                        ""
                    )
                }
                {
                    this.state.redirectToViewPage?(
                        <Redirect to={{pathname:"/supplierDetails",state:{id:this.state.popupId}}}/>
                    ):("")
                }
                <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center">
                        <h5 className="w-100 m-0">
                            Suppliers
                        </h5>
                    </div>
                    <div className="row mb-1">
                        <button className="btn btn-sm addBtn" onClick={()=>this.statusChange("add")}>
                            New Supplier
                        </button>                        
                    </div>
                    <div className="row">
                        <table className="table category-table ">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Business Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.tableData.map(data=>{
                                        console.log(data)
                                        return (
                                            <tr key={data.supplierId}>
                                                <td>{data.supplierId}</td>
                                                <td>{data.name}</td>
                                                <td>{data.businessName}</td>
                                                <td>
                                                    <input type="submit" className="btn-sm btn-success" onClick={()=>this.viewDetails(data.supplierId)} value="View Details"/>
                                                    
                                                    {/* <button className="btn btn-sm btn-update w-50 my-1 mr-1" onClick={()=>this.statusChange("update",data.supplierId)}>Update</button>
                                                    <button className="btn btn-sm btn-delete w-50 my-1 mr-1" onClick={()=>this.statusChange("delete",data.supplierId)}>Delete</button> */}
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

class PopupWindow extends Component{

    constructor(props){
        super(props);
        this.state = {
            windowStatus:props.windowStatus,
            id:0,
            fields: {
                username:"",
                pass:"",
                conpass:"",
                name:"",
                businessName:"",
                contactDetails:[],
                emailDetails:[]
            },
            contactDetails:{
                contactNumber:"",
                contactName:""
            },
            emailDetails:{
                emailName:"",
                emailAddress:""
            },
            errors:{
                username:"",
                pass:"",
                conpass:"",
                name:"",
                businessName:""
            }
        }
        this.btnSubmit = this.btnSubmit.bind(this);
        this.btnDelete = this.btnDelete.bind(this);
        this.btnReset = this.btnReset.bind(this);
        this.submitContact = this.submitContact.bind(this);
        this.submitAddress = this.submitAddress.bind(this);
    }

    handleChange(field, e){
        let errors = this.state.errors; 
        if(field==="contactName" || field==="contactNumber"){
            let contactDetails = this.state.contactDetails
            contactDetails[field] = e.target.value;        
            this.setState({contactDetails,errors});
        }else if(field==="emailName" || field==="emailAddress"){
            let emailDetails = this.state.emailDetails;
            emailDetails[field] = e.target.value;        
            this.setState({emailDetails,errors});
        }else{
            let fields = this.state.fields;

            if(field==="conpass"){
                if(e.target.value!=="" && e.target.value!==fields["pass"]){
                    errors["conpass"] = "Password not matched";
                }else{
                    errors["conpass"] = "";
                }
            }else if(field==="pass"){
                if(e.target.value!=="" && e.target.value!==fields["conpass"]){
                    errors["conpass"] = "Password not matched";
                }else{
                    errors["conpass"] = "";
                }
            }
            fields[field] = e.target.value;        
            this.setState({fields,errors});
        }
        
    }

    componentDidMount(){
        const that = this;
        if(this.state.windowStatus!=="add"){
            this.setState({
                id:this.props.id
            })
            if(this.state.windowStatus==="update"){
                axios.get(BASE_URL+"/supplier/getSupplier?supplierId="+this.props.id)
                .then(function(res){
                    const data = res.data;
                    data.conpass = data.pass;
                    that.setState({
                        fields:data
                    })
                }).catch(function(error){
                    console.log(error.response);
                    if(error.response.data!==undefined){
                        alert(error.response.data.message);
                    }else{
                        alert("Supplier details retrieve error!");
                    }
                    
                })
            }
        }
    }

    btnSubmit(){
        const that = this;
        let fields = this.state.fields;
        let errors = this.state.errors;
        const fieldsKeys = Object.keys(this.state.fields);
        const errorsKeys = Object.keys(this.state.errors);
        
        let formCompleteStatus = true;
        if(this.state.windowStatus==="add"){
            errorsKeys.forEach(key=>{
                if(key==="conpass" && errors[key]!==""){
                    formCompleteStatus = false;
                }
            });
        }
        if(!formCompleteStatus){
            console.log("Please fill the empty fields!");
            alert("Please fill the empty fields!");
        }else{
            fieldsKeys.forEach(key=>{
                if(fields[key]===""){
                    if(key!=="contactDetails" || key!=="emailDetails"){
                        errors[key] = "Required *";
                    }
                    formCompleteStatus = false;
                }
            });
            if(!formCompleteStatus){
                console.log("Please fill the empty fields!");
                alert("Please fill the empty fields!");

                this.setState({
                    errors
                })
            }else{
                fields.userRole = "supplier";
                delete fields["conpass"];
                if(this.state.windowStatus==="add"){
                    axios.post(BASE_URL+"/supplier/registerSupplier",this.state.fields)
                    .then(function(res){
                        console.log(res);
                        alert(res.data.message);
                        window.location.reload();
                    }).catch(function(error){
                        console.log(error.response);
                        if(error.response.data!==null){
                            alert(error.response.data.message);
                        }
                        alert("Supplier Delete Error!");
                    })
                }else{
                    axios.put(BASE_URL+"/supplier/updateSupplier?supplierId="+this.state.id,this.state.fields)
                    .then(function(res){
                        console.log(res);
                        alert(res.data.message);
                        window.location.reload();
                    }).catch(function(error){
                        console.log(error.response);
                        if(error.response.data!==null){
                            alert(error.response.data.message);
                        }
                        alert("Supplier Delete Error!");
                    })
                }
                
            }
        }
        
    }

    btnDelete(){
        axios.delete(BASE_URL+"/supplier/deleteSupplier?supplierId="+this.state.id)
        .then(function(res){
            console.log("res : ",res);
            alert(res.data.message);
            window.location.reload();
        }).catch(function(error){
            console.log(error.response);
            if(error.response.data!==null){
                alert(error.response.data.message);
            }
            alert("Supplier Delete Error!");
        })

    }

    btnReset(){
        this.setState({
            fields: {
                username:"",
                pass:"",
                conpass:"",
                name:"",
                businessName:"",
                contactDetails:[],
                emailDetails:[]
            },
            contactDetails:{
                contactNumber:"",
                contactName:""
            },
            emailDetails:{
                emailName:"",
                emailAddress:""
            },
            errors:{
                username:"",
                pass:"",
                conpass:"",
                name:"",
                businessName:""
            }
        })
    }

    submitContact(){
        let contactDetailsList = this.state.fields.contactDetails;
        contactDetailsList.push(this.state.contactDetails);
        this.setState({
            contactDetailsList,
            contactDetails:{
                contactName:"",
                contactNumber:""
            }
        })
    }

    submitAddress(){
        let emailDetailsList = this.state.fields.emailDetails;
        emailDetailsList.push(this.state.emailDetails);
        this.setState({
            emailDetailsList,
            emailDetails:{
                emailName:"",
                emailAddress:""
            }
        })
    }

    render(){
        
        let header;
        let footer;
        if(this.state.windowStatus=="add"){
            header = "New Supplier";
            footer = "Submit";
        }else if(this.state.windowStatus=="delete"){
            header = "Delete Supplier";
            footer = "Delete";
        }else if(this.state.windowStatus=="update"){
            header = "Update Supplier";
            footer = "Update";
        }
        return(
            <div className="modal" onClick={this.props.modalClose}>
                <div className="card modal-content  add-supplier-popup">
                    <div className="modal-header">
                        <h5>{header}</h5>
                    </div>
                    <div className="modal-body add-cat-popup-body">
                        {
                            this.state.windowStatus=="delete"?(
                                <div>
                                    Are you sure you want to delete?
                                    <div className="modal-footer">
                                        <button className="btn btn-danger"  onClick={this.btnDelete}>
                                            {footer}
                                        </button>
                                    </div>
                                </div>
                            ):(
                                <div>
                                    {
                                        this.state.windowStatus==="add"?(
                                            <div>
                                                <h6>Username</h6>
                                                <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "username")} ref="username" value={this.state.fields["username"]}/>
                                                <h6 className="text-danger">{this.state.errors["username"]!==""?(this.state.errors["username"]):("")}</h6>

                                                <h6>Password</h6>
                                                <input className="w-100 my-2" type="password" onChange={this.handleChange.bind(this, "pass")} ref="pass" value={this.state.fields["pass"]}/>
                                                <h6 className="text-danger">{this.state.errors["pass"]!==""?(this.state.errors["pass"]):("")}</h6>

                                                <h6>Confirm Password</h6>
                                                <input className="w-100 my-2" type="password" onChange={this.handleChange.bind(this, "conpass")} ref="conpass" value={this.state.fields["conpass"]}/>
                                                <h6 className="text-danger ">{this.state.errors["conpass"]!==""?(this.state.errors["conpass"]):("")}</h6>
                                            </div>
                                        ):(
                                            ""
                                        )
                                    }
                                        <h6>Supplier Name</h6>
                                        <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "name")} ref="name" value={this.state.fields["name"]}/>
                                        <h6 className="text-danger">{this.state.errors["name"]!==""?(this.state.errors["name"]):("")}</h6>
                                        
                                        <h6>Business Name</h6>
                                        <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "businessName")} ref="businessName" value={this.state.fields["businessName"]}/>
                                        <h6 className="text-danger">{this.state.errors["businessName"]!==""?(this.state.errors["businessName"]):("")}</h6>

                                        <div className="card p-3">
                                            <h5>Contact Details</h5>
                                            <hr></hr>
                                            <div className="row">
                                                <div className="col">
                                                    <h6>Contact Person Name</h6>
                                                    <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "contactName")} ref="contactName" value={this.state.contactDetails["contactName"]}/>
                                                </div>
                                                <div className="col">
                                                    <h6>Contact Number</h6>
                                                    <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "contactNumber")} ref="contactNumber" value={this.state.contactDetails["contactNumber"]}/>
                                                </div>
                                                
                                            </div>
                                            <div className="w-100">
                                                    <button type="button" className="btn btn-success float-right" onClick={this.submitContact}>
                                                        Add
                                                    </button>
                                            </div>
                                            <hr></hr>
                                            {
                                                this.state.fields.contactDetails!==undefined && this.state.fields.contactDetails.map((contactInfo,index)=>{
                                                    return(
                                                        <div key={index}>
                                                            <div className="row">
                                                                <div className="col">Contact Name : {contactInfo.contactName}</div>
                                                                <div className="col">Contact Number : {contactInfo.contactNumber}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>

                                        <div className="card p-3">
                                            <h5>Email Details</h5>
                                            <hr></hr>
                                            <div className="row">
                                                <div className="col">
                                                    <h6>Contact Person Name</h6>
                                                    <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "emailName")} ref="emailName" value={this.state.emailDetails["emailName"]}/>
                                                </div>
                                                <div className="col">
                                                    <h6>Email Address</h6>
                                                    <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "emailAddress")} ref="emailAddress" value={this.state.emailDetails["emailAddress"]}/>
                                                </div>
                                            </div>
                                            <div className="w-100">
                                                <button type="button" className="btn btn-success float-right" onClick={this.submitAddress}>
                                                    Add
                                                </button>
                                            </div>
                                            <hr></hr>
                                            {
                                                this.state.fields.emailDetails!==undefined && this.state.fields.emailDetails.map((emailInfo,index)=>{
                                                    return(
                                                        <div key={index}>
                                                            <div className="row">
                                                                <div className="col">Contact Person Name : {emailInfo.emailName}</div>
                                                                <div className="col">Email Address : {emailInfo.emailAddress}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                        
                                        <div className="modal-footer ">
                                            <button className="btn btn-success"  onClick={this.btnSubmit}>
                                                {footer}
                                            </button>
                                            <button className="btn btn-danger" onClick={this.btnReset}>Reset</button>                                            
                                        </div>
                                </div>
                            )
                        }
                    </div>
                    
                </div>

            </div>
        );
    }
}

export default Suppliers;