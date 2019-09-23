import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class Products extends Component{
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
        axios.get(BASE_URL+"/product/getProductsList")
        .then(function(res){
            console.log(res);
            that.setState({
                tableData:res.data.products
            })
        }).catch(function(error){
            console.log(error.response);
            if(error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Product data retrieve error!");
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
                            Products
                        </h5>
                    </div>
                    <div className="row mb-1">
                        <button className="btn btn-sm addBtn" onClick={()=>this.statusChange("add")}>
                            New Products
                        </button>                        
                    </div>
                    <div className="row">
                        <table className="table category-table ">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Type</th>
                                    {/* <th>Raw Material Qty Required</th> */}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.tableData.map(data=>{
                                        console.log(data)
                                        return (
                                            <tr key={data.product_id}>
                                                <td>{data.name}</td>
                                                <td>{data.description}</td>
                                                <td>{data.quantity}</td>
                                                <td>{data.price}</td>
                                                <td>{data.type}</td>
                                                {/* <td>
                                                    <ul>
                                                    {
                                                        data.raw_material.map((raw_material,index)=>{
                                                            return(
                                                                <li key={index}>
                                                                    <div>Name : {raw_material.name}</div>
                                                                    <div>Qty : {raw_material.quantity}</div>
                                                                </li>
                                                            );
                                                        })
                                                    }
                                                    </ul>
                                                </td> */}
                                                <td>
                                                    <button className="btn btn-sm btn-update w-50 my-1 mr-1" onClick={()=>this.statusChange("update",data.product_id)}>Update</button>
                                                    <button className="btn btn-sm btn-delete w-50 my-1 mr-1" onClick={()=>this.statusChange("delete",data.product_id)}>Delete</button>
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
            rawMaterialList:[],
            fields: {
                name:"",
                description:"",
                quantity:"",
                price:"",
                type:"Bicycle",
                raw_material:[],
                reorderLevel:"",
                reorderQty:""
            },
            raw_material:{
                rawId:"",
                rawQty:""
            },
            errors:{
                name:"",
                description:"",
                quantity:"",
                price:"",
                type:"",
                raw_material:"",
                reorderLevel:"",
                reorderQty:""
            }
        }
        this.btnSubmit = this.btnSubmit.bind(this);
        this.btnDelete = this.btnDelete.bind(this);
        this.btnReset = this.btnReset.bind(this);
        this.submitRawMaterial = this.submitRawMaterial.bind(this);
        this.removeRawMaterial = this.removeRawMaterial.bind(this);
    }


    handleChange(field, e){
        console.log(field);
        if(field==="rawId" || field==="rawQty"){
            let raw_material = this.state.raw_material;
            raw_material[field] = e.target.value;        
            this.setState({raw_material});
        }else{
            let fields = this.state.fields;
            fields[field] = e.target.value;        
            this.setState({fields});
        }
        return true;
        
    }

    keyDownClick(field,e){
        console.log(field);
        console.log(e.keyCode);
        if(e.keyCode===69 || e.keyCode===189  || e.keyCode===187 || e.keyCode===190){
            if(field==="price" && e.keyCode===190){
                return true;
            }
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
                axios.get(BASE_URL+"/rawmaterials/getRawMaterialList")
                .then(function(res){
                    that.setState({
                        rawMaterialList:res.data.rawmaterials
                    });
                }).catch(function(error){
                    console.log(error.response);
                    if(error.response!==undefined){
                        alert(error.response.data.message);
                    }else{
                        alert("Raw Material details retrieve error!");
                    }
                })
                axios.get(BASE_URL+"/product/getProductDetails?product_id="+this.props.id)
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
                        alert("Product details retrieve error!");
                    }
                    
                })
            }
        }else{
            axios.get(BASE_URL+"/rawmaterials/getRawMaterialList")
            .then(function(res){
                that.setState({
                    rawMaterialList:res.data.rawmaterials
                });
            }).catch(function(error){
                console.log(error.response);
                if(error.response!==undefined){
                    alert(error.response.data.message);
                }else{
                    alert("Raw Material details retrieve error!");
                }
            })
        }
    }

    btnSubmit(){
        let fields = this.state.fields;
        console.log(this.state.fields)
        let errors = this.state.errors;
        const fieldsKeys = Object.keys(this.state.fields);
        const errorsKeys = Object.keys(this.state.errors);
        
        let formCompleteStatus = true;
        
        fieldsKeys.forEach(key=>{
            console.log(key);
            if(fields[key]===""){
                if(fields.type==="Stock Accessory" && (key==="reorderLevel" || key==="reorderQty")){
                    errors[key] = "Required *";
                    formCompleteStatus = false;
                }
                
            }else if(fields.type==="Bicycle" && key==="raw_material" && fields[key].length===0){
                errors[key] = "Required *";
                formCompleteStatus = false;
            }else{
                errors[key] = "";
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
                fields.price = parseFloat(fields.price);
                fields.quantity = parseInt(fields.quantity);

                if(fields.type==="Bicycle"){
                    delete fields.reorderLevel;
                    delete fields.reorderQty;
                    let raw_materials = fields.raw_material;
                    raw_materials.forEach(raw_material=>{
                        raw_material.quantity = parseInt(raw_material.quantity);
                    })
                }else{
                    delete fields.raw_material;
                    fields.reorderLevel = parseInt(fields.reorderLeve);
                    fields.reorderQty = parseInt(fields.reorderQty);
                }
                axios.post(BASE_URL+"/product/newProduct",fields)
                .then(function(res){
                    console.log(res);
                    alert(res.data.message);
                    window.location.reload();
                }).catch(function(error){
                    console.log(error);
                    if(error.response!=undefined){
                        if(error.response.data!==null){
                            alert(error.response.data.message);
                        }else{
                            alert("Product adding error!");
                        }
                    }
                });
            }else{
                axios.put(BASE_URL+"/product/updateProduct?product_id="+this.state.id,this.state.fields)
                .then(function(res){
                    console.log(res);
                    alert(res.data.message);
                    window.location.reload();
                }).catch(function(error){
                    console.log(error);
                    if(error.response.data!==null){
                        alert(error.response.data.message);
                    }else{
                        alert("Product updating error!");
                    }
                })
            }
            
        }
        
        
    }

    btnDelete(){
        axios.delete(BASE_URL+"/product/deleteProduct?product_id="+this.state.id)
        .then(function(res){
            console.log(res.data.message);
            alert(res.data.message);
            window.location.reload();
        }).catch(function(error){
            console.log(error);
            if(error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Product deleting error!");
            }
        })
    }

    btnReset(){
        this.setState({
            fields: {
                name:"",
                description:"",
                quantity:"",
                price:"",
                raw_material:[]
            },
            raw_material:{
                rawId:"",
                rawQty:""
            },
            errors:{
                name:"",
                description:"",
                quantity:"",
                price:"",
                raw_material:""
            }
        })
    }

    submitRawMaterial(){
        const material = this.state.raw_material;
        if(material.rawId!==""){
            if(material.rawQty!==""){
                if(material.rawQty!=="0"){
                    const name = this.state.rawMaterialList[material.rawId].name;
                    const id = this.state.rawMaterialList[material.rawId].raw_material_id;
                    let exist_raw_id = -1;
                    let fields = this.state.fields;
                    console.log(fields);
                    for(var i=0;i<fields.raw_material.length;i++){
                        if(fields.raw_material[0].id===id){
                            exist_raw_id = i;
                        }
                    }

                    if(exist_raw_id===-1){
                        const data ={
                            id:id,
                            name:name,
                            quantity:material.rawQty
                        }
                        fields.raw_material.push(data);
                        
                    }else{
                        let exist_raw_material = fields.raw_material[exist_raw_id];
                        exist_raw_material.id = id;
                        exist_raw_material.name = name;
                        exist_raw_material.quantity = material.rawQty;

                    }
                    this.setState({
                        fields,
                        raw_material:{
                            rawId:"",
                            rawQty:""
                        }
                    });
                    
                    
                }else{
                    alert("Quantity must be positive");
                }
            }else{
                alert("Please fill raw quantity!");
            }
        }else{
            alert("Please select raw material!");
        }
        
    }

    removeRawMaterial(index){
        let fields = this.state.fields;
        fields.raw_material.splice(index,1);
        this.setState({
            fields
        })

    }

    render(){
        let header;
        let footer;
        if(this.state.windowStatus=="add"){
            header = "New Product";
            footer = "Submit";
        }else if(this.state.windowStatus=="delete"){
            header = "Delete Product";
            footer = "Delete";
        }else if(this.state.windowStatus=="update"){
            header = "Update Product";
            footer = "Update";
        }
        console.log(this.state.rawMaterialList);
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

                                        <h6>Price</h6>
                                        <input className="w-100 my-2" type="number" onChange={this.handleChange.bind(this, "price")} onKeyDown={this.keyDownClick.bind(this,"price")} ref="price" value={this.state.fields["price"]}/>
                                        <h6 className="text-danger">{this.state.errors["price"]!==""?(this.state.errors["price"]):("")}</h6>
                                        
                                        <h6>Type</h6>
                                        <select value={this.state.fields["type"]} onChange={this.handleChange.bind(this, "type")}>
                                            <option value="Bicycle">Bicycle</option>
                                            <option value="Stock Accessory">Stock Accessory</option>
                                        </select>
                                        <h6 className="text-danger">{this.state.errors["type"]!==""?(this.state.errors["type"]):("")}</h6>

                                        {
                                            this.state.fields.type==="Bicycle"?(
                                                <div className="card p-3">
                                                    <h5>Raw Materials Required</h5>
                                                    <h6 className="text-danger">{this.state.errors["raw_material"]!==""?(this.state.errors["raw_material"]):("")}</h6>
                                                    <hr></hr>
                                                    <div className="row">
                                                        <div className="col">
                                                            <h6>Raw Material</h6>
                                                            <select className="w-100 my-2 p-1" onChange={this.handleChange.bind(this, "rawId")} value={this.state.raw_material["rawId"]}>
                                                                <option value=""></option>
                                                            {
                                                                this.state.rawMaterialList.map((raw_material,index)=>{
                                                                    return(
                                                                        <option value={index} key={index}>{raw_material.name}</option>
                                                                    );
                                                                })
                                                            }
                                                            </select>
                                                        </div>
                                                        <div className="col">
                                                            <h6>Quantity</h6>
                                                            <input className="w-100 my-2" type="number" onChange={this.handleChange.bind(this, "rawQty")} onKeyDown={this.keyDownClick.bind(this,"rawQty")} ref="rawQty" value={this.state.raw_material["rawQty"]}/>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="w-100">
                                                            <button type="button" className="btn btn-success float-right" onClick={this.submitRawMaterial}>
                                                                Add
                                                            </button>
                                                    </div>
                                                    <hr></hr>
                                                    {
                                                        this.state.fields.raw_material!==undefined && this.state.fields.raw_material.map((raw_material,index)=>{
                                                            return(
                                                                <div key={index}>
                                                                    <div className="row m-1">
                                                                        <div className="col">Material Name : {raw_material.name}</div>
                                                                        <div className="col">Required Quantity : {raw_material.quantity}</div>
                                                                        <button className="btn-sm btn-danger" onClick={()=>this.removeRawMaterial(index)}>Remove</button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            ):(
                                                <div>
                                                    <h6>Re-Order Level</h6>
                                                    <input className="w-100 my-2" type="number" onChange={this.handleChange.bind(this, "reorderLevel")} onKeyDown={this.keyDownClick.bind(this,"reorderLevel")} ref="reorderLevel" value={this.state.fields["reorderLevel"]}/>
                                                    <h6 className="text-danger">{this.state.errors["reorderLevel"]!==""?(this.state.errors["reorderLevel"]):("")}</h6>

                                                    <h6>Re-Order Quantity</h6>
                                                    <input className="w-100 my-2" type="number" onChange={this.handleChange.bind(this, "reorderQty")} onKeyDown={this.keyDownClick.bind(this,"reorderQty")} ref="reorderQty" value={this.state.fields["reorderQty"]}/>
                                                    <h6 className="text-danger">{this.state.errors["reorderQty"]!==""?(this.state.errors["reorderQty"]):("")}</h6>
                                                </div>
                                            )
                                        }
                                        
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

export default Products;