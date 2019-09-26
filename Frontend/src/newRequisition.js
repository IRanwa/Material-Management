import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class NewRequisitions extends Component{
    constructor(props){
        super(props);
        this.state={
            fields:{
                type:"",
                stockItem:"",
                supplier:"",
                quantity:""
            },
            stockItems:[],
            suppliers:[],
            supplierItem:"",
            errors:{
                type:"",
                stockItem:"",
                supplier:"",
                quantity:""
            },
            requisitionItems:[]
        }
        this.getRawMaterials = this.getRawMaterials.bind(this);
        this.getRawMaterials = this.getRawMaterials.bind(this);
        this.getSuppliers = this.getSuppliers.bind(this);
        this.keyDownClick = this.keyDownClick.bind(this);
        this.btnAdd = this.btnAdd.bind(this);
        this.btnSubmit = this.btnSubmit.bind(this);
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
        }else if(field==="supplier"){
            const supplier = this.state.suppliers[event.target.value];
            const item = this.state.stockItems[this.state,fields.stockItem];
            

            let supplierItem;
            supplier.stockItems.forEach(stockItem=>{
                if(stockItem.type==="Raw Material" && item.raw_material_id===stockItem.raw_material_id){
                    supplierItem = stockItem;
                }else if(stockItem.type==="Stock Accessories" && item.product_id===stockItem.product_id){
                    supplierItem = stockItem;
                }
            })
            this.setState({
                supplierItem:supplierItem
            })
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

    keyDownClick(field,e){
        if(e.keyCode===69 || e.keyCode===189  || e.keyCode===187 || e.keyCode===190){
            if(field==="price" && e.keyCode===190){
                return true;
            }
            e.preventDefault();
            return false;
        }
        return true;
    }

    btnAdd(){
        let fields = this.state.fields
        const supplier = this.state.suppliers[this.state,fields.supplier];
        const stockItem = this.state.stockItems[this.state,fields.stockItem];
        const supplierItem = this.state.supplierItem;
        const quantity = parseInt(fields.quantity);
        let noOfTimesReOrderQty = Math.round(quantity/supplierItem.reorderQty);
        
        if(noOfTimesReOrderQty===0){
            noOfTimesReOrderQty=1;
        }
        const totalLeadTime = supplierItem.leadTime*noOfTimesReOrderQty;
        const totalPrice = supplierItem.cost * quantity;

        fields.totalCost = totalPrice;
        fields.totalLeadTime = totalLeadTime;
        fields.supplier = supplier;
        fields.stockItem = stockItem;

        

        fields.quantity = quantity;
        console.log(fields);

        let requisitionItems = this.state.requisitionItems;
        requisitionItems.push(fields);
        this.setState({
            requisitionItems,
            fields:{
                type:"",
                stockItem:"",
                supplier:"",
                quantity:""
            },
            stockItems:[],
            suppliers:[],
            supplierItem:"",
            errors:{
                type:"",
                stockItem:"",
                supplier:"",
                quantity:""
            }
        })
    }

    removeItem(index){
        let requisitionItems = this.state.requisitionItems;
        requisitionItems.splice(index,1)
        this.setState({
            requisitionItems
        })
    }

    btnSubmit(){
        let requisitionItems = this.state.requisitionItems;
        requisitionItems.forEach(requisition=>{
            const supplier = requisition.supplier;
            const stockItem = requisition.stockItem;

            requisition.supplierId = supplier.supplierId;
            requisition.supplierName = supplier.name;
            delete requisition.supplier;
            
            if(requisition.type==="Raw Material"){
                requisition.raw_material_id = stockItem.raw_material_id;
            }else{
                requisition.product_id = stockItem.product_id;
            }
            delete requisition.stockItem;
        })

        const that = this;
        axios.post(BASE_URL+"/requisition/newRequisition",{requisitionItems:requisitionItems})
        .then(function(res){
            console.log(res);
            alert(res.data.message);
            that.setState({
                fields:{
                    type:"",
                    stockItem:"",
                    supplier:"",
                    quantity:""
                },
                stockItems:[],
                suppliers:[],
                supplierItem:"",
                errors:{
                    type:"",
                    stockItem:"",
                    supplier:"",
                    quantity:""
                },
                requisitionItems:[]
            })
        }).catch(function(error){
            console.log(error);
            if(error.response!==undefined && error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Requisition save error!");
            }
        })
    }

    render(){
        return(
            <div className="card w-90 p-3 m-5">
               <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center">
                        <h5 className="w-100 m-0">
                            New Requisition
                        </h5>
                    </div>
                    <hr></hr>
                    <div>
                            <div className="row">
                                
                                <h6> Type</h6>
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
                                
                                {
                                    this.state.fields.supplier!==""?(
                                        <div className="text-left w-100">
                                            <h6 className="font-weight-bold">Supplier re-order quantity {this.state.supplierItem.reorderQty} and lead time {this.state.supplierItem.leadTime} hours</h6>
                                        </div>
                                    ):(
                                       ""
                                    )
                                }

                                <h6>Quantity</h6>       
                                <input className="w-100 my-2" type="number" onChange={this.handleChange.bind(this, "quantity")} onKeyDown={this.keyDownClick.bind(this,"quantity")} ref="quantity" value={this.state.fields["quantity"]}/>
                                <h6 className="text-danger">{this.state.errors["quantity"]!==""?(this.state.errors["quantity"]):("")}</h6>  
                               
                               <div className="w-100 mt-2">
                                    <button className="btn btn-success "  onClick={this.btnAdd}>Add</button>
                               </div>

                               
                                <div className="mt-3 text-center w-100">
                                    <h5 className="w-100">
                                        Purchasing Items
                                    </h5>
                                    <hr></hr>
                                    <table className="table-responsive table category-table ">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Stock Item</th>
                                                <th>Suppllier</th>
                                                <th>Quantity</th>
                                                <th>Max Delivery Time (In Hours)</th>
                                                <th>Price</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.requisitionItems.map((item,index)=>{
                                                    return(
                                                        <tr key={index}>
                                                            <td>{item.type}</td>
                                                            <td>{item.stockItem.name}</td>
                                                            <td>{item.supplier.name}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.totalLeadTime}</td>
                                                            <td>{item.totalCost}</td>
                                                            <td>
                                                                <button className="btn-sm btn-danger" onClick={()=>this.removeItem(index)}>Remove</button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                

                            </div>
                        <div>
                            <div className="modal-footer ">
                                <button className="btn-sm btn-success"  onClick={this.btnSubmit}>Submit</button>                                          
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    
}

export default NewRequisitions;