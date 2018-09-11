import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Line,Scatter} from 'react-chartjs-2';
import React from 'react';
import Switch from '@material-ui/core/Switch';

class BittrexChart extends React.PureComponent{
	constructor(props){
		super(props);
		this.state ={
			display:false
		}
		this.updateDisplay = this.updateDisplay.bind(this);
		this.height = this.props.style.height > 400 ? 100 : this.props.style.height/2;
	}
	createScatter(){
		return this.props.scatterList.map((_option)=>{
			return <Scatter 
			height={this.height}
			key={Math.random(0,1)} 
			data={_option}
			options={{
				animation:{duration:0}
			}} 
			/>
			
		})
	}
	chart(){
		if(this.props.data.data.datasets){
			return <Line height={this.height} data={this.props.data.data} options={this.props.data.options} />
		}
		else {
			return null
		}
	}
	updateDisplay(checked){
		return this.setState({display:checked})
	}	
	render() {
		return (
			<div>
			{this.chart()}
			<FormGroup>
		        <FormControlLabel
				  label="Hide Scatter"
				  style={{margin:"auto"}}
		          control={<Switch
			              checked={this.display}
			              onChange={(event, checked) => { 
							  return this.updateDisplay(checked);
							}}
						/>}
		        />
			
			</FormGroup>
			{this.state.display ? "" : this.createScatter()}
			</div>);
	}
}
	
export default BittrexChart;
