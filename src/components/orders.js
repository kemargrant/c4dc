import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import Typography from '@material-ui/core/Typography';

class Orders extends React.Component{
	render(){
	return(<div>{this.props.orders.map((order)=> 
			<Card key={order.order_id} style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
			<CardHeader style={{"backgroundRepeat":"no-repeat","backgroundPosition":"center",backgroundImage: order.image}}>
			</CardHeader>
	        <CardContent>
	           <Typography type="headline">{order.type}</Typography>
				<Typography component="p">
				{order.pair.replace('_','/')}
				<br/>{order.amount} @ {order.rate}
				<br/>Created:{Number(order.timestamp_created) ? new Date(order.timestamp_created).toString() : order.timestamp_created}
				<br/>{order.order_id}
				</Typography>
				<LinearProgress variant="determinate" value={ order.filled > 0? ((order.amount-order.filled)/order.amount)*100 : 0} />					
				{ order.filled > 0? (((order.amount-order.filled)/order.amount)*100).toFixed(2) +'% Filled' : '0% Filled'}
	        </CardContent>
	      </Card>)}</div>)				      
	}
}	

export default Orders;
