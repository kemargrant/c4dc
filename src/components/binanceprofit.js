import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

const BinanceProfit = function (props){
	const binanceProfitInfo = function(){
		let results = [];
		let balance = props.balance
		for(let key in props.profit){
		   for(let key2 in props.profit[key]){
				results.push([key2,props.profit[key][key2]]);
			}
		}
		return results.map(function(profit){
				return (<div key={profit[1]}>
						{profit[1] ? profit[1].toFixed(8) :""}/{balance[profit[0]]} {profit[0]} ({profit[1] ? ([profit[1]] * 100/balance[profit[0]]).toFixed(8) : ""})%
						<LinearProgress variant="determinate" value={profit[1] * 100/balance[profit[0]]} />	
					</div>)		
		})
	}
	return (<div>{binanceProfitInfo()}</div>)
}

export default BinanceProfit;
