import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

class GeneralBalance extends React.Component{
	constructor(props){
		super(props)
		this.coins = [];
		for(let key in this.props.balance){
			if(key !== "account" && this.props.balance[key] > 0){
				this.coins.push([key.toString(),this.props.balance[key]]);
			}
		}
	}
	render(){
		return (<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
		        <CardContent>
					<Typography type="title">{this.props.title}</Typography>
					<br/>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Asset</TableCell>
								<TableCell>Balance</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							 {this.coins.map(item=>(<TableRow key={item[0]}><TableCell>{item[0]}</TableCell><TableCell>{item[1]}</TableCell></TableRow>))}
					</TableBody>
					</Table>
		        </CardContent>
		        <CardActions>
					<Button variant="raised" color="primary" onClick={this.props.update}>Get Balance</Button>			
		        </CardActions>
			</Card>)
	}
}

export default GeneralBalance;
