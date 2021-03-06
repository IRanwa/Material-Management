import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Redirect} from "react-router-dom";
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class BOM extends Component{
    constructor(props){
        super(props);
        this.state={
            tableData:[]
        }
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/bom/getBOMList")
        .then(function(res){
            that.setState({
                tableData:res.data.boms
            });
        }).catch(function(error){
            console.log(error);
            if(error.response!==undefined && error.response.data!==null){
                alert(error.response.data.message);
            }else{
                alert("BOM searching error!");
            }
        });
    }

    render(){
        return(
            <div className="card w-90 p-3 m-5">
                 <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center">
                        <h5 className="w-100 m-0">
                            Bill of Materials
                        </h5>
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
                                        return(
                                            <tr key={index}>
                                                <td>{data.bom_id}</td>
                                                <td>2019/09/24</td>
                                                <td>{data.billItems!==undefined?(data.billItems.length):("")}</td>
                                                <td>{data.status}</td>
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

export default BOM;