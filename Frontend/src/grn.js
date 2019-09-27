import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Redirect} from "react-router-dom";
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class GRN extends Component{
    constructor(props){
        super(props);
        this.state={
            tableData:[]
        }
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/grn/getGRNList")
        .then(function(res){
            console.log(res.data)
            that.setState({
                tableData:res.data.GRNs
            });
        }).catch(function(error){
            console.log(error);
            if(error.response!==undefined && error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("GRN searching error!");
            }
        });
    }

    render(){
        return(
            <div className="card w-90 p-3 m-5">
                 <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center">
                        <h5 className="w-100 m-0">
                            Goods Received Notice
                        </h5>
                    </div>
                    <div className="row">
                        <table className="table category-table ">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Requisition Id</th>
                                    <th>No of Raw Materials</th>
                                    <th>No of Products</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                     this.state.tableData.map((data,index)=>{
                                         console.log(data)
                                        return(
                                            <tr key={index}>
                                                <td>{data.grn_id}</td>
                                                <td>{data.requisitonid}</td>
                                                <td>{data.rawmaterisl.length}</td>
                                                <td>{data.products.length}</td>
                                                <td><input type="submit" className="btn-sm btn-success" value="View Details"></input></td>
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

export default GRN;