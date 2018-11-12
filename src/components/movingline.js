import React from 'react';
import ReactChartkick, {LineChart} from 'react-chartkick'
import Chart from 'chart.js'
ReactChartkick.addAdapter(Chart)

function MovingLine(props) {
	var pu;
	var mva;
	switch (props.gauge[0][0]){
		case (undefined):
			return <LineChart data={{}}/>
		default:
		mva =  props.gauge[0][props.gauge[0].length-1][1];
		pu = props.gauge[0][props.gauge[1].length-1][1];
		var options = {
				scales: {
					yAxes:[{
						ticks:{
							stepSize:0.5,
						min:98,
						max:101
						}
					}],
				},
			}
	}
	return <LineChart data={[{data:props.gauge[1],name:"Percentage:"+pu},{data:props.gauge[0],name:"Percentage Moving Average:"+mva}]} ytitle="%" library={options}/>
}

export default MovingLine;
