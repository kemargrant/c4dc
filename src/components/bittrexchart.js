import Chart from 'chart.js'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';
import ReactChartkick, {LineChart,ScatterChart} from 'react-chartkick'
import Switch from '@material-ui/core/Switch';

ReactChartkick.addAdapter(Chart)

class BittrexChart extends React.PureComponent{
	constructor(props){
		super(props);
		this.state ={
			display:false
		}
		this.updateDisplay = this.updateDisplay.bind(this);
		this.height = this.props.style.height > 400 ? 100 :Math.round(this.props.style.height/2)*2;
	}
	createScatter(){
		return this.props.scatterList.map((_option)=>{
			return <ScatterChart
			height={this.height+"px"}
			key={_option.datasets[0].label} 
			data={_option.datasets[0].data}
			xtitle={_option.datasets[0].label}
			library={{
				animation:{duration:0}
			}} 
			/>	
		})
	}
	chart(){
		if(this.props.data.data.datasets){
			return 	<LineChart 
				height={this.height+"px"} 
				data={[
					{data:this.props.data.data.datasets[0].data,name:this.props.data.data.datasets[0].label},
					{data:this.props.data.data.datasets[2].data,name:this.props.data.data.datasets[1].label},
					{data:this.props.data.data.datasets[2].data,name:this.props.data.data.datasets[2].label}
				]} 
				library={this.props.data.options} 
				/>
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
