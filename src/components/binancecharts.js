import Chart from 'chart.js'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';
import ReactChartkick, {LineChart,ScatterChart} from 'react-chartkick'
import Switch from '@material-ui/core/Switch';

ReactChartkick.addAdapter(Chart)

class BinanceCharts extends React.PureComponent{
	constructor(props){
	super(props)
		this.updateDisplay = this.updateDisplay.bind(this);
		this.state = {display:false}	
		this.height = this.props.chartSize.height > 400 ? 100 : Math.round(this.props.chartSize.height);
	}
	createLine(){
		if(this.props.lineList[0].length === 3){
			return this.props.lineList.map((option) => (
				<div key={option.key+Math.random(0,10)}>
					<LineChart 
						height={this.height+"px"} 
						data={[
							{data:option.data.datasets[0].data,name:option.data.datasets[0].label},
							{data:option.data.datasets[1].data,name:option.data.datasets[1].label},
							{data:option.data.datasets[2].data,name:option.data.datasets[2].label},
						]} 
						library={option.data.options} 
					/>
			    </div>
			))
		}
	}
	createScatter(){
		return this.props.scatterList.map((_option)=>{
			return (<ScatterChart
			height={this.height+"px"}
			key={Math.random(0,1)} 
			data={_option.data}
			xtitle={_option.labels}
			/>)
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
