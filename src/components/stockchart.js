import React from 'react';
import {Scatter} from 'react-chartjs-2';

//Bittrex Components
function StockChart(props){
	const config={
			data: {
				datasets: [{
					label: 'Bids',
					backgroundColor:"green",
					fill:'origin',
					data: [],
					lineTension:0,
					showLine:true
				},{
					label: 'Asks',
					backgroundColor:"red",
					fill:'origin',
					data: [],
					lineTension:0,
					showLine:true
				}]
			},
			options: {
				responsive:true,
				title: {
					text:"",
					display:true,
				},
				animation:{
					duration:0
				},
				tooltips:{
					mode:'x',
					intersect:false,
				},
				hover:{
					mode:'y',
					intersect:true
				},
				scales:{
					yAxes:{
						scaleLabel:{
							display:false,
							labelString:'Amount'
						}
					},
					xAxes:[{
							scaleLabel: {
								display: false,
								labelString: 'Price'
							},
							ticks:{
								fontColor:"blue"
							}
					}]
				}
			}
		}	
	if(props.data["Sorted"]){
		if(!props.small){
			config.data.datasets[0].data = props.data["Sorted"] && props.data["Sorted"][1].map((order) => {
				return {y:props.data["Bids"][order],x:order}
			})
			config.data.datasets[1].data = props.data["Sorted"] && props.data["Sorted"][0].map((order) => {
				return {y:props.data["Asks"][order],x:order}
			})
			config.options.title.text = props.pair;
			config.options.scales.xAxes[0].ticks.max = Number(props.data["Sorted"][0][props.data["Sorted"][0].length - 1])
			config.options.scales.xAxes[0].ticks.min = Number(props.data["Sorted"][1][props.data["Sorted"][1].length - 1])
		}
		else{
			config.data.datasets[0].data = props.data["Sorted"] && props.data["Sorted"][1].map((order) => {
				return {y:props.data["Bids"][order],x:order/props.data["Sorted"][1][props.data["Sorted"][1].length - 1]}
			})
			config.data.datasets[1].data = props.data["Sorted"] && props.data["Sorted"][0].map((order) => {
				return {y:props.data["Asks"][order],x:order/props.data["Sorted"][1][props.data["Sorted"][1].length - 1]}
			})
			config.options.title.text = props.pair + "(Scaled)";
			config.options.scales.xAxes[0].ticks.min = 1;
			config.options.scales.xAxes[0].ticks.max = Number(props.data["Sorted"][0][props.data["Sorted"][1].length - 1])/Number(props.data["Sorted"][1][props.data["Sorted"][1].length - 1])
		}
		return <Scatter
				height={props.style.height > 400 ? 50 : props.style.height/2}
				data={config.data}
				options={config.options} 
				/>
	}	
	return null;
}

export default StockChart;
