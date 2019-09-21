import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Redirect} from 'react-router-dom';
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class Enquiries extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableData:[],
            redirectToDetails:false,
            id:0
        }
        this.viewDetails = this.viewDetails.bind(this);
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/enquiry/getEnquiryList")
        .then(function(res){
            console.log(res);
            that.setState({
                tableData:res.data.enquiries
            })
        }).catch(function(error){
            console.log(error.response);
            if(error.response.data!==undefined){
                alert(error.response.data.message);
            }else{
                alert("Enquiry data retrieve error!");
            }
            
        });
    }

    viewDetails(id){
       this.setState({
           id:id,
           redirectToDetails:true
       })
    }

    render(){
        return(
            <div className="card w-90 p-3 m-5">
                {
                    this.state.redirectToDetails?(
                        <Redirect to={{pathname:"/enquiryDetails",state:{id:this.state.id}}}/>
                    ):("")
                }
                <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center mb-2">
                        <h5 className="w-100 m-0">
                            Enquiries
                        </h5>
                    </div>
                    <div className="row">
                        <table className="table category-table ">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Order Id</th>
                                    <th>Place Date</th>
                                    <th>Modify Date</th>
                                    <th>Products Required</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.tableData.map(data=>{
                                        return (
                                            <tr key={data.enquiry_id}>
                                                <td>{data.order_id}</td>
                                                <td>{data.enquiry_id}</td>
                                                <td>{data.place_date}</td>
                                                <td>{data.modify_date}</td>
                                                <td>
                                                    <ul>
                                                        {
                                                            data.products.map((prod,index)=>{
                                                                return(
                                                                    <li key={index}>
                                                                        <div>Name : {prod.name}</div>
                                                                        <div>Quantity : {prod.quantity}</div>
                                                                    </li>
                                                                );
                                                            })
                                                        }
                                                    </ul>
                                                </td>
                                                <td>{data.status}</td>
                                                <td>
                                                    <input type="submit" className="btn-sm btn-success" value="View Details" onClick={()=>this.viewDetails(data.enquiry_id)}/>
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


export default Enquiries;