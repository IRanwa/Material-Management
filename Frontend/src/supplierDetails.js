import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class SupplierDetails extends Component{
    constructor(props){
        super(props);
        this.state={
            id:props.id,
            supplier:{},
            redirectToAddStock:false,
            addStockStatus:"",
            updateStockItem:{},
            windowStatus:""
        }
        this.addStockItem = this.addStockItem.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/supplier/getSupplier?supplierId="+this.state.id)
        .then(function(res){
            console.log("res ",res)
            that.setState({
                supplier:res.data
            })
        }).catch(function(error){
            console.log(error.response);
            if(error.response!==undefined && error.response.data!==undefined){
                alert(error.response.data.message);
            }else{
                alert("Supplier data retrieve error!");
            }
        });
    }

    addStockItem(status,stockItem){
        this.setState({
            redirectToAddStock:true,
            addStockStatus:status,
            updateStockItem:stockItem
        })
    }

    modalClose(){
        const that = this;
        const modal = document.getElementsByClassName("modal")[0];
        window.onclick = function(event) {
            if (event.target === modal) {
              that.setState({
                    redirectToAddStock:false,
                    addStockStatus:"",
                    updateStockItem:{}
              });
            }
        }
    }

    changeStatus(status,id){
        this.setState({
            windowStatus:status
        })
    }

    render(){
        const supplier = this.state.supplier;
        return(
            <div className="card w-90 p-3 m-5">
                {
                    this.state.redirectToAddStock?(
                        <AddStockItem id={this.state.id}  modalClose={this.modalClose} status={this.state.addStockStatus} stockItem={this.state.updateStockItem}/>
                    ):(
                        ""
                    )
                }
                {
                    this.state.windowStatus!==""?(
                        <PopupWindow windowStatus={this.state.windowStatus} modalClose={this.modalClose} id={this.state.id} />
                    ):(
                        ""
                    )
                }
                <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center mb-2">
                        <h5 className="w-100 m-0">
                            Supplier Details
                        </h5>
                    </div>
                    <hr></hr>
                    <div >
                        <label className="row m-0">
                            Supplier Id : {supplier.supplierId}
                        </label>
                        <label className="row m-0">
                            Username : {supplier.username}
                        </label>
                        <label className="row m-0">
                            Name : {supplier.name}
                        </label>
                        <label className="row m-0">
                            Business Name : {supplier.businessName}
                        </label>
                        <div className="mt-3">
                            <input type="submit" className="btn-sm btn-success mr-3" value="Update Supplier" onClick={()=>{this.changeStatus("update")}}/>
                            <input type="submit" className="btn-sm btn-danger" value="Delete Supplier" onClick={()=>{this.changeStatus("delete")}}/>
                        </div>
                        <hr></hr>
                        <div className="row">
                            <h5>Contact List</h5>
                        </div>
                        <div>
                            {
                                supplier.contactDetails!==undefined && supplier.contactDetails.map(contact=>{
                                    return(
                                        <div className="row">
                                            <div className="col">
                                                Contact Name : {contact.contactName}
                                            </div>
                                            <div className="col">
                                                Contact Number : {contact.contactNumber}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <hr></hr>
                        <div className="row">
                            <h5>Email List</h5>
                        </div>
                        <div>
                            {
                                supplier.emailDetails!==undefined && supplier.emailDetails.map(email=>{
                                    return(
                                        <div className="row">
                                            <div className="col">
                                                Contact Name : {email.emailName}
                                            </div>
                                            <div className="col">
                                                Email Address : {email.emailAddress}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <hr></hr>
                        <div className="row">
                            <h5>Stock Items</h5>
                        </div>
                        <div>
                            <input type="submit" className="btn-sm btn-success float-left mb-3" value="Add Stock Item" onClick={()=>this.addStockItem("add",{})}/>
                        </div>
                        <div>
                            <table className="table category-table ">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Stock Id</th>
                                        <th>Cost</th>
                                        <th>quantity</th>
                                        <th>Re-Order Quantity</th>
                                        <th>Lead Time (In Hours)</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        supplier.stockItems!==undefined && supplier.stockItems.map((stockItem,index)=>{
                                            return(
                                                <tr key={index}>
                                                    <td>{stockItem.type}</td>
                                                    <td>{stockItem.name}</td>
                                                    {/* {
                                                        stockItem.type==="Raw Material"?(
                                                            <td>{stockItem.raw_material_id}</td>
                                                        ):(
                                                            <td>{stockItem.product_id}</td>
                                                        )
                                                    } */}
                                                    <td>{stockItem.cost}</td>
                                                    <td>{stockItem.quantity}</td>
                                                    <td>{stockItem.reorderQty}</td>
                                                    <td>{stockItem.leadTime}</td>
                                                    <td>
                                                        <div>
                                                            <button className="btn btn-sm btn-update w-50 my-1 mr-1" onClick={()=>this.addStockItem("update",stockItem)}>Update</button>
                                                            <button className="btn btn-sm btn-delete w-50 my-1 mr-1"  onClick={()=>this.deleteStockItem(stockItem)}>Delete</button>
                                                        </div>
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
            </div>
        )
    }
}

class AddStockItem extends Component{
    constructor(props){
        super(props);
        this.state={
            id:props.id,
            status:props.status,
            stockItems:[],
            fields:{
                type:"",
                stockItem:"",
                cost:"",
                leadTime:"",
                reorderQty:""
            },
            errors:{
                type:"",
                cost:"",
                leadTime:"",
                reorderQty:""
            }
        }
        // if(props.status==="update"){
        //     console.log(props.stockItem)
        // }
        this.btnReset = this.btnReset.bind(this);
        this.btnSubmit = this.btnSubmit.bind(this);
        this.keyDownClick = this.keyDownClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        if(this.state.status==="update"){
            const item = this.props.stockItem;
            if(item.type==="Raw Material"){
                this.getRawMaterials(item);
            }else{
                this.getStockAccessories(item);
            }
        }
    }

    keyDownClick(field,e){
        console.log(field);
        console.log(e.keyCode);
        if(e.keyCode===69 || e.keyCode===189  || e.keyCode===187 || e.keyCode===190){
            if(field==="cost" && e.keyCode===190){
                return true;
            }
            e.preventDefault();
            return false;
        }
        return true;
    }

    handleChange(field, e){
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});

        if(field==="type" && e.target.value!==""){
            if(e.target.value==="Raw Material"){
                this.getRawMaterials();
            }else{
                this.getStockAccessories();
            }
        }else if(field==="type"){
            this.setState({
                stockItems:[]
            })
        }
        return true;
    }

    getRawMaterials(item){
        const that = this;
        axios.get(BASE_URL+"/rawmaterials/getRawMaterialList")
        .then(function(res){
            const data = res.data.rawmaterials;
            let fields = that.state.fields;
            if(item!==undefined){
                fields = item;
                data.forEach((raw_material,index)=>{
                    if(raw_material.raw_material_id===item.raw_material_id){
                        fields.stockItem = index;
                    }
                });
            }
            that.setState({
                stockItems:data,
                fields
            })
        }).catch(function(error){
            console.log(error);
            if(error.response!==undefined && error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Raw Materials searching error!");
            }
        });
    }

    getStockAccessories(item){
        const that = this;
        axios.get(BASE_URL+"/product/getStockAccessoriesList")
        .then(function(res){
            const data = res.data.products;
            let fields = that.state.fields;
            if(item!==undefined){
                fields = item;
                data.forEach((raw_material,index)=>{
                    if(raw_material.raw_material_id===item.raw_material_id){
                        fields.stockItem = index;
                    }
                });
            }
            that.setState({
                stockItems:data,
                fields
            })
        }).catch(function(error){
            console.log(error);
            if(error.response!==undefined && error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Product searching error!");
            }
        });
    }

    btnReset(){
        this.setState({
            fields:{
                type:"",
                stockItem:"",
                cost:"",
                leadTime:"",
                reorderQty:""
            },
            errors:{
                type:"",
                stockItem:"",
                cost:"",
                leadTime:"",
                reorderQty:""
            }
        })
    }

    btnSubmit(){
        let fields = this.state.fields;
        let errors = this.state.errors;
        const fieldsKeys = Object.keys(fields);
        let status = true;
        fieldsKeys.forEach(key=>{
            if(fields[key]===""){
                errors[key]="Required *";
                status = false;
            }
        });

        if(status){
            let stockItems = this.state.stockItems;
            fields.quantity = 0;
            fields.cost = parseFloat(fields.cost);
            fields.leadTime = parseInt(fields.leadTime);
            fields.reorderQty = parseInt(fields.reorderQty);
            
            if(fields.type==="Raw Material"){
                fields.raw_material_id = stockItems[fields.stockItem].raw_material_id;
                delete fields.product_id;
            }else{
                fields.product_id = stockItems[fields.stockItem].product_id;
                delete fields.raw_material_id;
            }
            delete fields.stockItem;

            console.log(fields);
            if(this.state.status==="add"){
                axios.post(BASE_URL+"/supplier/addStockItem?supplierId="+this.state.id,fields)
                .then(function(res){
                    console.log(res);
                    alert(res.data.message);
                    window.location.reload();
                }).catch(function(error){
                    console.log(error);
                    if(error.response!==undefined && error.response.data!==null){
                        alert(error.response.data.message);
                    }else{
                        alert("Supplier stock item adding error!");
                    }
                });
            }else{

            }
        }else{
            this.setState({
                fields,
                errors
            })
        }
    }

    render(){
        let header;
        let footer;
        if(this.state.status==="add"){
            header = "Add Stock Item";
            footer = "Add";
        }else{
            header = "Update Stock Item";
            footer = "Update";
        }
        return(
            <div className="modal" onClick={this.props.modalClose}>
                <div className="card modal-content  add-supplier-popup">
                    <div className="modal-header">
                        <h5>{header}</h5>
                    </div>
                    <div className="modal-body add-cat-popup-body">
                        <div>
                            <h6>Type</h6>
                            <select className="w-100 my-2" value={this.state.fields["type"]} onChange={this.handleChange.bind(this, "type")}>
                                <option value=""></option>
                                <option value="Raw Material">Raw Material</option>
                                <option value="Stock Accessories">Stock Accessories</option>
                            </select>
                            <h6 className="text-danger">{this.state.errors["type"]!==""?(this.state.errors["type"]):("")}</h6>

                            <h6>Stock Item</h6>
                            <select className="w-100 my-2" value={this.state.fields["stockItem"]} onChange={this.handleChange.bind(this, "stockItem")}>
                                <option value=""></option>
                                {
                                    this.state.stockItems.map((stockItem,index)=>{
                                        return <option value={index} key={index}>{stockItem.name}</option>
                                    })
                                }
                            </select>
                            <h6 className="text-danger">{this.state.errors["type"]!==""?(this.state.errors["type"]):("")}</h6>

                            <h6>Cost</h6>
                            <input className="w-100 my-2" type="number" onKeyDown={this.keyDownClick.bind(this,"cost")} onChange={this.handleChange.bind(this, "cost")} ref="cost" value={this.state.fields["cost"]}/>
                            <h6 className="text-danger">{this.state.errors["cost"]!==""?(this.state.errors["cost"]):("")}</h6>

                            <h6>Lead Time (In Hours)</h6>
                            <input className="w-100 my-2" type="number" onKeyDown={this.keyDownClick.bind(this,"leadTime")} onChange={this.handleChange.bind(this, "leadTime")} ref="leadTime" value={this.state.fields["leadTime"]}/>
                            <h6 className="text-danger ">{this.state.errors["leadTime"]!==""?(this.state.errors["leadTime"]):("")}</h6>

                            <h6>Re-Order Qty</h6>
                            <input className="w-100 my-2" type="number" onKeyDown={this.keyDownClick.bind(this,"reorderQty")} onChange={this.handleChange.bind(this, "reorderQty")} ref="reorderQty" value={this.state.fields["reorderQty"]}/>
                            <h6 className="text-danger ">{this.state.errors["reorderQty"]!==""?(this.state.errors["reorderQty"]):("")}</h6>
                        </div>
                    </div>
                    <div className="modal-footer ">
                        <button className="btn btn-success"  onClick={this.btnSubmit}>
                            {footer}
                        </button>
                        <button className="btn btn-danger" onClick={this.btnReset}>Reset</button>                                            
                    </div>
                </div>
            </div>
        )
    }
}

class PopupWindow extends Component{

    constructor(props){
        super(props);
        this.state = {
            windowStatus:props.windowStatus,
            id:0,
            fields: {
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
            fields[field] = e.target.value;        
            this.setState({fields,errors});
        }
        
    }

    componentDidMount(){
        const that = this;
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

    btnSubmit(){
        const that = this;
        let fields = this.state.fields;
        let errors = this.state.errors;
        const fieldsKeys = Object.keys(this.state.fields);
        const errorsKeys = Object.keys(this.state.errors);
        
        let formCompleteStatus = true;
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
        if(this.state.windowStatus=="delete"){
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


export default SupplierDetails;