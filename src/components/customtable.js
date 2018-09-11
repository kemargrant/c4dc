import React from 'react';

const CustomTable = function(props){
	const sortOrder = props.type === "Bids" ? 1 : 0;
	return(<table className="myTable">
	<tbody>
		  <tr className="stripeTable">
		    <th>{props.type === "Bids" ? "Amount" : (<div>{props.type} <br/>{props.pair}</div>) }</th> 		
		    <th>{props.type === "Bids" ? (<div>{props.type} <br/>{props.pair}</div>) : "Amount" } </th>	    
		  </tr>
			{
				props.data["Sorted"] && props.data["Sorted"][sortOrder].map((order) => (
				<tr key={order}>
					{props.type === "Bids" ? <td className="stripeTable">{Number(props.data[props.type][order]).toFixed(props.prec[0])}</td> : <td className="stripeTable">{Number(order).toFixed(props.prec[1])}</td>}
					{props.type === "Bids" ? <td className="stripeTable">{Number(order).toFixed(props.prec[1])}</td> :  <td className="stripeTable">{Number(props.data[props.type][order]).toFixed(props.prec[0])}</td> }
				</tr>
				))
			}
	</tbody>
	</table>
	)
}

export default CustomTable;
