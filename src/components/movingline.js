import React from 'react';
import Scatter from 'react-chartjs-2';

const MovingLine = function(props) {
	var render;
	switch (props.gauge[0][0]){
		case (undefined):
			render = <Scatter data={{}} height={props.height}/>
			break
		default:
		render = <Scatter
					data={
					{labels: ['Scatter'],
						datasets:[
					    {
					      label: 'Percentage Moving Average ('+ props.gauge[0][props.gauge[0].length-1].y+')',
					      borderColor:"red",
					      data: props.gauge[0],
					      showLine:true,
					      lineTension:0,
					      radius:0,
					      fill:false,
					    },
					    {
					      label: 'Percent('+props.gauge[1][props.gauge[1].length-1].y +')',
					      borderColor:"blue",
					      backgroundColor:"black",
					      radius:0,
					      data: props.gauge[1],
						  showLine:true,
						  lineTension:0,
					      fill:false,
					    }
					  ]
					}}
				height={props.height}
				options={{
				events:[],	
				animation:{duration:10},	
				scales: {
					xAxes: [{
						type: 'linear',
						ticks:{
							stepSize:10
						}
					}],	
				},
			}} 
			/>
	}
	return render;
}

export default MovingLine;
