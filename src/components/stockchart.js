import Chart from 'chart.js'
import React from 'react';
import ReactChartkick, {AreaChart} from 'react-chartkick'

ReactChartkick.addAdapter(Chart)

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
				return [order,props.data["Bids"][order]]
			})
			config.data.datasets[1].data = props.data["Sorted"] && props.data["Sorted"][0].map((order) => {
				return [order,props.data["Asks"][order]]
			})
			config.options.title.text = props.pair;
			//config.options.scales.xAxes[0].ticks.max = Number(props.data["Sorted"][0][props.data["Sorted"][0].length - 1])
			//config.options.scales.xAxes[0].ticks.min = Number(props.data["Sorted"][1][props.data["Sorted"][1].length - 1])
		}
		else{
			config.data.datasets[0].data = props.data["Sorted"] && props.data["Sorted"][1].map((order) => {
				return [order/props.data["Sorted"][1][props.data["Sorted"][1].length - 1],props.data["Bids"][order]]
			})
			config.data.datasets[1].data = props.data["Sorted"] && props.data["Sorted"][0].map((order) => {
				return [order/props.data["Sorted"][1][props.data["Sorted"][1].length - 1],props.data["Asks"][order]]
			})
			config.options.title.text = props.pair + "(Scaled)";
			//config.options.scales.xAxes[0].ticks.min = 1;
			//config.options.scales.xAxes[0].ticks.max = Number(props.data["Sorted"][0][props.data["Sorted"][1].length - 1])/Number(props.data["Sorted"][1][props.data["Sorted"][1].length - 1])
		}
		return <AreaChart
				height={props.style.height > 400 ? "50px" : props.style.height+"px"}
				data={[
					{data:config.data.datasets[0].data,name:config.data.datasets[0].label},
					{data:config.data.datasets[1].data,name:config.data.datasets[1].label}
				]}
				library={config.options} 
				/>
	}	
	return null;
}

export default StockChart;
