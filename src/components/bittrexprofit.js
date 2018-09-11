import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

const BittrexProfit = function(props){
		return (<div>
			<div>
				{props.profit.btc ? props.profit.btc.toFixed(8) : 0}/{props.balance.btc} btc ({props.profit.btc > 0 ?  (props.profit.btc * 100/props.balance.btc).toFixed(8) :  0.00000000})%
				<LinearProgress variant="determinate" value={props.profit.btc ?  props.profit.btc * 100/props.balance.btc : 0} />
			</div>
				<div>
					{props.profit[props.tradingPairs.misc] ? props.profit[props.tradingPairs.misc].toFixed(8) : 0}/{props.balance[props.tradingPairs.misc]} {props.tradingPairs.misc} ({props.profit[props.tradingPairs.misc] ? (props.profit[props.tradingPairs.misc]*100/props.balance[props.tradingPairs.misc]).toFixed(8) : 0.00000000})%
					<LinearProgress variant="determinate" value={props.profit[props.tradingPairs.misc] ?  props.profit[props.tradingPairs.misc]*100/props.balance[props.tradingPairs.misc]: 0} />
				</div>
			</div>)
}

export default BittrexProfit;
