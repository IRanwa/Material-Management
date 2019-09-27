import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class EnquiryDetails extends Component{
    constructor(props){
        super(props);
        this.state={
            id:props.id,
            enquiry:{}
        }
        this.reserveStocks = this.reserveStocks.bind(this);
    }
    
    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/enquiry/getEnquiry?enquiry_id="+this.state.id)
        .then(function(res){
            console.log("res : ",res)
            that.setState({
                enquiry:res.data
            })
        }).catch(function(error){
            console.log("error : ",error);
            if(error.response!==undefined && error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Enqiry details retrieve error!");
            }
        });
    }

    reserveStocks(){
        const that = this;
        axios.get(BASE_URL+"/enquiry/reserveStocks?enquiry_id="+this.state.id)
        .then(function(res){
            const data = res.data.message;
            const products = data.products;
            let items = [];
            products.forEach(prod=>{
                items.push(
                    {
                        id:prod.id,
                        qty:prod.qty,
                        status:prod.status
                    }
                )
            });

            const enquiryData = {
                id:data.order_id,
                items:items
            }

            axios.post("http://192.168.1.6:8080/orders/materialManagementOrder",enquiryData)
            .then(function(res){
                console.log(res);
                alert("Sales has been notified");
            }).catch(function(error){
                console.log(error);
                alert("Error occured while informing sales!");
            })


            that.setState({
                enquiry:res.data.message
            })
        }).catch(function(error){
            console.log(error);
            if(error.response!==undefined && error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("Enqiry details retrieve error!");
            }
        });
    }

    render(){
        const enquiry = this.state.enquiry;
        return(
            <div className="card w-90 p-3 m-5">
                <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center mb-2">
                        <h5 className="w-100 m-0">
                            Enquiry Details
                        </h5>
                    </div>
                    <hr></hr>
                    <div >
                        <label className="row m-0">
                            Enquiry Id : {enquiry.enquiry_id}
                        </label>
                        <div className="row m-0">
                            Order Id : {enquiry.order_id}
                        </div>
                        <div className="row m-0">
                            Place Date : {enquiry.place_date}
                        </div>
                        <div className="row m-0">
                            Last Modify Date : {enquiry.modify_date}
                        </div>
                        <div className="row m-0">
                            Status : {enquiry.status}
                        </div>
                       
                        {
                            enquiry.status==="Enquiry" || enquiry.status==="Stocks Not Reserved"?(
                                <div className="text-center">
                                    <button className="btn-sm btn-success text-center" onClick={this.reserveStocks}>Reserve Stock</button>
                                </div>
                            ):("")
                        }
                        
                        <hr></hr>
                        <div className="row">
                            <h5>Product List</h5>
                        </div>
                        <div>
                            {
                                enquiry.products!==undefined && enquiry.products.map(prod=>{
                                    return(
                                        <div className="row" key={prod.prodId}>
                                            <div className="col">
                                                Product Id : {prod.prodId}
                                            </div>
                                            <div className="col">
                                                Product Name : {prod.prodName}
                                            </div>
                                            <div className="col">
                                                Product Quantity : {prod.qty}
                                            </div>
                                            {
                                                prod.status!==undefined?(
                                                    <div className="col">
                                                        {
                                                            prod.status?(
                                                                <label className="text-success">Stocks Reserved</label>
                                                            ):(
                                                                <label className="text-danger">Stocks Not Reserved</label>
                                                            )
                                                        }
                                                    </div>
                                                ):(
                                                    ""
                                                )
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 

export default EnquiryDetails;