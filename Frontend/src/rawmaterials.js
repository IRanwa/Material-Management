import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class RawMaterials extends Component{
    constructor(props){
        super(props);
        this.state = {
            addStatus:false,
            deleteStatus:false,
            updateStatus:false,
            popupId:0,
            tableData:[]
        }
        this.statusChange = this.statusChange.bind(this);
        this.modalClose = this.modalClose.bind(this);
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/rawmaterials/getRawMaterialList")
        .then(function(res){
            console.log(res);
            that.setState({
                tableData:res.data.rawmaterials
            })
        }).catch(function(error){
            console.log(error.response);
            if(error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Raw material data retrieve error!");
            }
            
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



    render(){
        return(
            <div className="card w-90 p-3 m-5">
                {
                    this.state.addStatus?(
                        <PopupWindow windowStatus="add" modalClose={this.modalClose}/>
                    ):(
                        ""
                    )
                }
                {
                    this.state.deleteStatus?(
                        <PopupWindow windowStatus="delete" modalClose={this.modalClose} id={this.state.popupId}/>
                    ):(
                        ""
                    )
                }
                {
                    this.state.updateStatus?(
                        <PopupWindow windowStatus="update" modalClose={this.modalClose} id={this.state.popupId} />
                    ):(
                        ""
                    )
                }
                <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center">
                        <h5 className="w-100 m-0">
                            Raw Materials
                        </h5>
                    </div>
                    <div className="row mb-1">
                        <button className="btn btn-sm addBtn" onClick={()=>this.statusChange("add")}>
                            New Raw Material
                        </button>                        
                    </div>
                    <div className="row">
                        <table className="table category-table ">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Re-Order Level</th>
                                    <th>Re-Order Qty</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.tableData.map(data=>{
                                        console.log(data)
                                        return (
                                            <tr key={data.raw_material_id}>
                                                <td>{data.name}</td>
                                                <td>{data.description}</td>
                                                <td>{data.quantity}</td>
                                                <td>{data.reorderLevel}</td>
                                                <td>{data.reorderQty}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-update w-50 my-1 mr-1" onClick={()=>this.statusChange("update",data.raw_material_id)}>Update</button>
                                                    <button className="btn btn-sm btn-delete w-50 my-1 mr-1" onClick={()=>this.statusChange("delete",data.raw_material_id)}>Delete</button>
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
                name:"",
                description:"",
                quantity:"",
                reorderLevel:"",
                reorderQty:""
            },
            errors:{
                name:"",
                description:"",
                quantity:"",
                reorderLevel:"",
                reorderQty:""
            }
        }
        this.btnSubmit = this.btnSubmit.bind(this);
        this.btnDelete = this.btnDelete.bind(this);
        this.btnReset = this.btnReset.bind(this);
    }


    handleChange(field, e){
        let fields = this.state.fields; 
        if(field==="quantity" || field==="reorderLevel" || field==="reorderQty"){
            
        }
        fields[field] = e.target.value;        
        this.setState({fields});
        return true;
        
    }

    keyDownClick(field,e){
        console.log(field);
        console.log(e.keyCode);
        if(e.keyCode===69 || e.keyCode===190 || e.keyCode===189){
            e.preventDefault();
            return false;
        }
        return true;
    }

    componentDidMount(){
        const that = this;
        if(this.state.windowStatus!=="add"){
            this.setState({
                id:this.props.id
            })
            if(this.state.windowStatus==="update"){
                axios.get(BASE_URL+"/rawmaterials/getRawMaterial?raw_material_id="+this.props.id)
                .then(function(res){
                    const data = res.data;
                    that.setState({
                        fields:data
                    })
                }).catch(function(error){
                    console.log(error.response);
                    if(error.response.data!==undefined){
                        alert(error.response.data.message);
                    }else{
                        alert("Raw Material details retrieve error!");
                    }
                    
                })
            }
        }
    }

    btnSubmit(){
        let fields = this.state.fields;
        let errors = this.state.errors;
        const fieldsKeys = Object.keys(this.state.fields);
        const errorsKeys = Object.keys(this.state.errors);
        
        let formCompleteStatus = true;
        
        fieldsKeys.forEach(key=>{
            if(fields[key]===""){
                errors[key] = "Required *";
                formCompleteStatus = false;
            }else if(fields[key]==="0"){
                errors[key] = "Value must be positive *";
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
            if(this.state.windowStatus==="add"){
                axios.post(BASE_URL+"/rawmaterials/newRawMaterial",this.state.fields)
                .then(function(res){
                    console.log(res);
                    alert(res.data.message);
                    window.location.reload();
                }).catch(function(error){
                    console.log(error);
                    if(error.response.data!==null){
                        alert(error.response.data.message);
                    }else{
                        alert("Raw material adding error!");
                    }
                });
            }else{
                axios.put(BASE_URL+"/rawmaterials/updateRawMaterial?raw_material_id="+this.state.id,this.state.fields)
                .then(function(res){
                    console.log(res);
                    alert(res.data.message);
                    window.location.reload();
                }).catch(function(error){
                    console.log(error.response);
                    alert(error.response.data.message);
                })
            }
            
        }
        
        
    }

    btnDelete(){

    }

    btnReset(){
        this.setState({
            fields: {
                name:"",
                description:"",
                quantity:"",
                reorderLevel:"",
                reorderQty:""
            },
            errors:{
                name:"",
                description:"",
                quantity:"",
                reorderLevel:"",
                reorderQty:""
            }
        })
    }

    render(){
        
        let header;
        let footer;
        if(this.state.windowStatus=="add"){
            header = "New Raw Material";
            footer = "Submit";
        }else if(this.state.windowStatus=="delete"){
            header = "Delete Raw Material";
            footer = "Delete";
        }else if(this.state.windowStatus=="update"){
            header = "Update Raw Material";
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
                                        <button className="btn-sm btn-danger"  onClick={this.btnDelete}>
                                            {footer}
                                        </button>
                                    </div>
                                </div>
                            ):(
                                <div>
                                        <h6>Name</h6>
                                        <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "name")} ref="name" value={this.state.fields["name"]}/>
                                        <h6 className="text-danger">{this.state.errors["name"]!==""?(this.state.errors["name"]):("")}</h6>

                                        <h6>Description</h6>
                                        <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "description")} ref="description" value={this.state.fields["description"]}/>
                                        <h6 className="text-danger">{this.state.errors["description"]!==""?(this.state.errors["description"]):("")}</h6>

                                        <h6>Quantity</h6>
                                        <input className="w-100 my-2" type="number" onChange={this.handleChange.bind(this, "quantity")} onKeyDown={this.keyDownClick.bind(this,"quantity")} ref="quantity" value={this.state.fields["quantity"]}/>
                                        <h6 className="text-danger">{this.state.errors["quantity"]!==""?(this.state.errors["quantity"]):("")}</h6>

                                        <h6>Re-Order Level</h6>
                                        <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "reorderLevel")} ref="reorderLevel" value={this.state.fields["reorderLevel"]}/>
                                        <h6 className="text-danger">{this.state.errors["reorderLevel"]!==""?(this.state.errors["reorderLevel"]):("")}</h6>

                                        <h6>Re-Order Level Quantity</h6>
                                        <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "reorderQty")} ref="reorderQty" value={this.state.fields["reorderQty"]}/>
                                        <h6 className="text-danger">{this.state.errors["reorderQty"]!==""?(this.state.errors["reorderQty"]):("")}</h6>
                                        
                                        <div className="modal-footer ">
                                            <button className="btn-sm btn-success"  onClick={this.btnSubmit}>
                                                {footer}
                                            </button>
                                            <button className="btn-sm btn-danger" onClick={this.btnReset}>Reset</button>                                            
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

export default RawMaterials;