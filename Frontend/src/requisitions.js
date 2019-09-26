import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Redirect} from "react-router-dom";
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class Requisitions extends Component{
    constructor(props){
        super(props);
        this.state={
            tableData:[],
            popupStatus:"",
            addStatus:false,
            popupId:0,
            viewDetails:false
        }
        this.modalClose = this.modalClose.bind(this);
        this.statusChange = this.statusChange.bind(this);
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/requisition/getRequisitionsList")
        .then(function(res){
            console.log(res.data)
            that.setState({
                tableData:res.data.requisitions
            })
        }).catch(function(error){
            console.log(error);
            if(error.response!==undefined && error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Requisition searching error!");
            }
        })
    }

    modalClose(){
        const that = this;
        const modal = document.getElementsByClassName("modal")[0];
        window.onclick = function(event) {
            if (event.target === modal) {
              that.setState({
                popupStatus:"",
                popupId:0
              });
            }
        }
    }

    statusChange(status,id){
        if(status==="add"){
            this.setState({
                addStatus:true
            })
        }else if(status==="view"){
            this.setState({
                viewDetails:true,
                popupId:id
            })
        }else{
            this.setState({
                popupStatus:status
            })
        }
        
    }

    render(){
        return(
            <div className="card w-90 p-3 m-5">
                {
                    this.state.addStatus?(
                        <Redirect to="/newRequisition"/>
                    ):(
                        ""
                    )
                }
                {
                    this.state.viewDetails?(
                        <Redirect to={{pathname:"/viewRequisition",state:{id:this.state.popupId}}}/>
                    ):(
                        ""
                    )
                }
                <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center">
                        <h5 className="w-100 m-0">
                            Requisitions
                        </h5>
                    </div>
                    <div className="row mb-1">
                        <button className="btn btn-sm addBtn" onClick={()=>this.statusChange("add")}>
                            New Purchase Requisition
                        </button>                        
                    </div>
                    <div className="row">
                        <table className="table category-table ">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Created Date</th>
                                    <th>No of Items</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.tableData.map((data,index)=>{
                                        console.log(data)
                                        return (
                                            <tr key={index}>
                                                <td>{data.requisition_id}</td>
                                                <td>{data.place_date}</td>
                                                <td>{data.requisitionItems.length}</td>
                                                <td>{data.status}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-success w-50 my-1 mr-1" onClick={()=>this.statusChange("view",data.requisition_id)}>View Details</button>
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
        this.state={
            status:props.windowStatus,
            fields:{
                type:"",
                stockItem:"",
                supplier:""
            },
            stockItems:[],
            suppliers:[],
            errors:{
                type:"",
                stockItem:"",
                supplier:""
            }
        }
        this.getRawMaterials = this.getRawMaterials.bind(this);
        this.getRawMaterials = this.getRawMaterials.bind(this);
        this.getSuppliers = this.getSuppliers.bind(this);
    }

    handleChange(field,event){
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({
            fields
        })

        if(field==="type"){
            if(event.target.value==="Raw Material"){
                this.getRawMaterials();
            }else if(event.target.value==="Stock Accessory"){
                this.getStockAccessories();
            }
            this.setState({
                stockItem:""
            })

        }else if(field==="stockItem"){
            const item = this.state.stockItems[event.target.value];
            this.getSuppliers(item);
        }
    }

    getRawMaterials(){
        const that = this;
        axios.get(BASE_URL+"/rawmaterials/getRawMaterialList")
        .then(function(res){
            const data = res.data.rawmaterials;
            that.setState({
                stockItems:data
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

    getStockAccessories(){
        const that = this;
        axios.get(BASE_URL+"/product/getStockAccessoriesList")
        .then(function(res){
            const data = res.data.products;
            that.setState({
                stockItems:data
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

    getSuppliers(item){
        const that = this;
        const type = this.state.fields.type;
        console.log(type);
        console.log(type);
        if(type==="Raw Material"){
            axios.get(BASE_URL+"/supplier/getSupplierByStockItem", {
                params: {
                  id: item.raw_material_id,
                  type:type
                }
            })
            .then(function(res){
                const data = res.data.suppliers;
                console.log(res)
                that.setState({
                    suppliers:data
                })
            }).catch(function(error){
                console.log(error);
                if(error.response!==undefined && error.response.data!==null){
                    alert(error.response.data.message);
                }else{
                    alert("Product searching error!");
                }
            });
        }else if(type==="Stock Accessory"){
            axios.get(BASE_URL+"/supplier/getSupplierByStockItem", {
                params: {
                  id: item.product_id,
                  type:"Stock Accessories"
                }
            })
            .then(function(res){
                const data = res.data.suppliers;
                console.log(res)
                that.setState({
                    suppliers:data
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
    }

    render(){
        let header;
        let footer;
        if(this.state.status==="add"){
            header = "New Purchase Requisition";
            footer = "Submit";
        }else if(this.state.status==="delete"){
            header = "Delete Purchase Requisition";
            footer = "Delete";
        }
        return(
            <div className="modal" onClick={this.props.modalClose}>
                <div className="card modal-content  add-supplier-popup">
                    <div className="modal-header">
                        <h5>{header}</h5>
                    </div>
                    <div className="modal-body add-cat-popup-body">
                        {
                            this.state.status==="add"?(
                                <div>
                                    {/* <input className="w-100 my-2" type="text" onChange={this.handleChange.bind(this, "name")} ref="name" value={this.state.fields["name"]}/> */}
                                    <h6>Stock Type</h6>
                                    <select className="w-100 my-2 p-1" value={this.state.fields["type"]} onChange={this.handleChange.bind(this, "type")}>
                                        <option value=""></option>
                                        <option value="Raw Material">Raw Material</option>
                                        <option value="Stock Accessory">Stock Accessory</option>
                                    </select>
                                    <h6 className="text-danger">{this.state.errors["type"]!==""?(this.state.errors["type"]):("")}</h6>

                                    <h6>Stock Items</h6>
                                    <select className="w-100 my-2 p-1" value={this.state.fields["stockItem"]} onChange={this.handleChange.bind(this, "stockItem")}>
                                        <option value=""></option>
                                        {
                                            this.state.stockItems.map((item,index)=>{
                                                return(
                                                    <option key={index} value={index}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <h6 className="text-danger">{this.state.errors["stockItem"]!==""?(this.state.errors["stockItem"]):("")}</h6>

                                    <h6>Suppliers</h6>
                                    <select className="w-100 my-2 p-1" value={this.state.fields["supplier"]} onChange={this.handleChange.bind(this, "supplier")}>
                                        <option value=""></option>
                                        {
                                            this.state.suppliers.map((supplier,index)=>{
                                                return(
                                                    <option key={index} value={index}>{supplier.businessName}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <h6 className="text-danger">{this.state.errors["supplier"]!==""?(this.state.errors["supplier"]):("")}</h6>


                                </div>
                            ):(
                                <div>
                                    {
                                        this.state.status==="delete"?(
                                            <div>
                                                Are you sure you want to delete?
                                                <div className="modal-footer">
                                                    <button className="btn-sm btn-danger"  onClick={this.btnDelete}>
                                                        {footer}
                                                    </button>
                                                </div>
                                            </div>
                                        ):(
                                            <div></div>
                                        )
                                    }
                                </div>
                            )
                        }
                        
                        <div>
                            <div className="modal-footer ">
                                <button className="btn-sm btn-success"  onClick={this.btnSubmit}>
                                    {footer}
                                </button>
                                <button className="btn-sm btn-danger" onClick={this.btnReset}>Reset</button>                                            
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    
}

export default Requisitions;