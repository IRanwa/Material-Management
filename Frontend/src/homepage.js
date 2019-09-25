import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const axios = require("axios");
const BASE_URL = "https://us-central1-material-management-f3b68.cloudfunctions.net";

class Homepage extends Component{
    constructor(props){
        super(props);
        this.state={
            rawmaterials:[]
        }
    }

    componentDidMount(){
        const that = this;
        axios.get(BASE_URL+"/rawmaterials/getLowStockMaterials")
        .then(function(res){
            that.setState({
                rawmaterials:res.data.rawmaterials
            });
        }).catch(function(error){
            console.log(error.response);
            if(error.response!==undefined && error.response.data!==undefined){
                alert(error.response.data.message);
            }else{
                alert("Raw materials data retrieve error!");
            }
        })
    }

    render(){
        return(
            <div className="card w-90 p-3 m-5">
                <div className="w-100 container text-center category-menu">
                    <div className="row mt-2 text-center">
                        <h5 className="w-100 m-0">
                            Low On Stocks
                        </h5>
                    </div>
                    <hr></hr>
                    <div className="row">
                        {
                            this.state.rawmaterials.length>0?(
                                <table className="table category-table ">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Re-Order Level</th>
                                            <th>Re-Order Quantity</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.rawmaterials.map((rawmaterial,index)=>{
                                                return(
                                                    <tr key={index}>
                                                        <td>{rawmaterial.name}</td>
                                                        <td>{rawmaterial.quantity}</td>
                                                        <td>{rawmaterial.reorderLevel}</td>
                                                        <td>{rawmaterial.reorderQty}</td>
                                                        <td>
                                                            <input type="submit" className="btn-sm btn-success" value="Create Purchase Requisition"/>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            ):(
                                <div>
                                    
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Homepage;