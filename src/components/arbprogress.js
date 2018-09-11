import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

class ArbProgress  extends React.Component{
	constructor(props){
		super(props);
		this.count = this.count.bind(this);
		this.date = new Date();		
		this.count();
		this.timeout = false;
	}
	
	count(){
		if(this.props.time > 0){
			this.date = new Date();
			this.timeout = setTimeout(this.count,950)
		}	
	}
	componentWillUnmount(){
		return clearTimeout(this.timeout);
	}
	render(){
		return(
			<div>
			<LinearProgress variant="determinate" value={this.props.value} /> 
			<Button variant="raised" color="primary">Arbitrage In Progress</Button>
			<br/>
			{((this.date.getTime() - this.props.time)/60000).toFixed(2) + " Minutes Processing Arbitrage"} 
			</div>
			)
	}
}

export default ArbProgress;
