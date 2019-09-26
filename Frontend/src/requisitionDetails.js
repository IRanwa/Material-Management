import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Redirect} from "react-router-dom";
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class RequisitionDetails extends Component{
    constructor(props){
        super(props);
        this.state={
            id:props.id,
            requisition:{}
        }
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/requisition/getRequisition?id="+this.state.id)
        .then(function(res){
            console.log(res);
            that.setState({
                requisition:res.data
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
        const requisition = this.state.requisition;
        return(
            <div className="card w-90 p-3 m-5">
                <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center mb-2">
                        <h5 className="w-100 m-0">
                            Purchase Requisition Details
                        </h5>
                    </div>
                    <hr></hr>
                    <div >
                        <label className="row m-0">
                            Requisition Id : {requisition.requisition_id}
                        </label>
                        <label className="row m-0">
                            Created Date : {requisition.place_date}
                        </label>
                    </div>
                    <hr></hr>
                        <div className="row">
                            <h5>Stock Items List</h5>
                        </div>
                        <div>
                            <table className="table-responsive table category-table ">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Stock Item</th>
                                        <th>Suppllier</th>
                                        <th>Quantity</th>
                                        <th>Max Delivery Time (In Hours)</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        requisition.requisitionItems!==undefined && requisition.requisitionItems.map((item,index)=>{
                                            return(
                                                <tr key={index}>
                                                    <td>{item.type}</td>
                                                    <td>{item.stockItem.name}</td>
                                                    <td>{item.supplierName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.totalLeadTime}</td>
                                                    <td>{item.totalCost}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                            
                        </div>
                </div>


            </div>
        )
    }
}

export default RequisitionDetails;