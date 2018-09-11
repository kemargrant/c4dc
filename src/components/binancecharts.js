import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Line,Scatter} from 'react-chartjs-2';
import React from 'react';
import Switch from '@material-ui/core/Switch';

class BinanceCharts extends React.PureComponent{
	constructor(props){
	super(props)
		this.updateDisplay = this.updateDisplay.bind(this);
		this.state = {display:false}	
		this.height = this.props.chartSize.height > 400 ? 100 : this.props.chartSize.height/2;
	}
	createLine(){
		if(this.props.lineList.length > 0){
			return this.props.lineList.map((option) => (
				<div key={option.key+Math.random(0,10)}>
					<Line 
					height={this.height}
					data={option.data}
					options={option.options} 
					/>	
			    </div>
			))
		}
	}
	createScatter(){
		return this.props.scatterList.map((_option)=>{
			return (
			<Scatter 
			height={this.height}
			key={Math.random(0,1)} 
			data={_option}
			options={{
				animation:{duration:0}
			}} 
			/>
			)
		})
	}
	updateDisplay(checked){
		return this.setState({display:checked})
	}
	render() {	
		return (<div>
			{this.createLine()}
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
			
		</div>)
	}	
}

export default BinanceCharts;
