import React, { Component } from 'react';
import ResponseTable from '../../responded/ResponseTable'
import StatusTable from '../../responded/StatusTable'
import axios from 'axios';
import DeleteTable from "../deleteTable"
import Rejectsubmission from "../RejectSubmissionTable.js"
import { Link } from "react-router-dom";
class ManageScheduledForm extends Component{
    state = {
        generals_forms:[],
        deleted_forms:[],
        hide: true,
        id:""

    };
    componentDidMount(){
        if(this.props.id!=""){
            axios.get(`/fv3/api/view-by-forms/?project=${this.props.id}&form_type=scheduled`)
            .then(res=>{     
            this.setState({
                deleted_forms:res.data.deleted_forms,
                generals_forms:res.data.scheduled_forms
            })
            }).catch(err=>{
                console.log(err ,"err");
                
            }) 
        }

    }
    toggleHide = () => {
        this.setState({
            hide: !this.state.hide
        });
    }
    
    render(){  
        const{props:{showViewData,data,id}}=this;  
        return(
            <React.Fragment>
                <div className="card-header main-card-header sub-card-header">
                    <h5>{!data? "Schedule Forms":"Rejected Submission"}</h5>
                    <Link to={`/project-responses/${this.props.id}/Rejected`}>
                            <button onClick={showViewData} className="fieldsight-btn">{data ? 'View By Status' : 'View by Form'}</button>
                        </Link>
                </div>
                <div className="card-body">
                
                    {!data &&  <ResponseTable  
                                  generals_forms={this.state.generals_forms}
                                  
                                   />}

                    {data && <Rejectsubmission />}

                </div>     
               {!data &&  <div className="card no-boxshadow">
                                    <div className="card-header main-card-header sub-card-header">
                                        <h5>Deleted Forms</h5>
                                        <div className="dash-btn">
                                            {this.state.hide ? (<button type="button" className="btn-toggle" onClick={this.toggleHide}>
                                                show
                                            <div className="handle"></div> 
                                            </button>)
                                            : (<button type="button" className="btn-toggle" onClick={this.toggleHide} style={{backgroundColor:'#28a745', color:'white',textAlign:'left'}}>
                                            hide
                                                <div className="handle" style={{left:'auto', right:'0.1875rem'}}></div> 
                                            </button>)}
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {!this.state.hide && 
                                        <DeleteTable 
                                        deleted_forms={this.state.deleted_forms}
                                        />}
                                    </div>
                                </div>   }
            </React.Fragment>
        )
    }
}
export default ManageScheduledForm