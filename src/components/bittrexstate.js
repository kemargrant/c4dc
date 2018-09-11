import ArbProgress from './arbprogress';
import ArbToggle from './arbtoggle';
import StockChart from './stockchart';
import CustomTable from './customtable';
import MovingLine from './movingline';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

class BittrexState extends React.Component{
	constructor(props){
		super(props)
		this.height = this.props.style.height > 400 ? 100 : this.props.style.height/2;
	}
	progress(){
		if(this.props.time > 0){
			return  <ArbProgress  value={this.props.progress} time={this.props.time}/>
		}
		else{
			return "";
		}
	}
	book(){
		if(this.props.viewBook){  
			return(<div className="orderBooks">
			<br/>
			<StockChart style={this.props.style} data={this.props.bookData[Object.keys(this.props.bookData)[0]]} pair={Object.keys(this.props.bookData)[0].toLowerCase()} small/>
			<StockChart style={this.props.style} data={this.props.bookData[Object.keys(this.props.bookData)[1]]} pair={Object.keys(this.props.bookData)[1].toLowerCase()}/>		
			<StockChart style={this.props.style} data={this.props.bookData[Object.keys(this.props.bookData)[2]]} pair={Object.keys(this.props.bookData)[2].toLowerCase()}/>	
			<CustomTable 
				pair={Object.keys(this.props.bookData)[0].toLowerCase()}
				type={"Bids"}
				data={this.props.bookData[Object.keys(this.props.bookData)[0]]}
				prec={[3,7]}
				/>
			<CustomTable 
				pair={Object.keys(this.props.bookData)[0].toLowerCase()}
				type={"Asks"}
				data={this.props.bookData[Object.keys(this.props.bookData)[0]]}
				prec={[3,7]}
				/>	
			<CustomTable 
				pair={Object.keys(this.props.bookData)[1].toLowerCase()}
				type={"Bids"}
				data={this.props.bookData[Object.keys(this.props.bookData)[1]]}
				prec={[4,2]}
				/>	
			<CustomTable 
				pair={Object.keys(this.props.bookData)[1].toLowerCase()}
				type={"Asks"}
				data={this.props.bookData[Object.keys(this.props.bookData)[1]]}
				prec={[4,2]}
				/>												
			<CustomTable 
				pair={Object.keys(this.props.bookData)[2].toLowerCase()}
				type={"Bids"}
				data={this.props.bookData[Object.keys(this.props.bookData)[2]]}
				prec={[2,4]}
				/>	
			<CustomTable 
				pair={Object.keys(this.props.bookData)[2].toLowerCase()}
				type={"Asks"}
				data={this.props.bookData[Object.keys(this.props.bookData)[2]]}
				prec={[2,4]}
				/>	
			</div>)
		}
		else{
			return ""
		}	
	}
	
	render(){
		const inputStyle ={width:"4.5em"}
		return(<div>
			<ArbToggle pair={"none"} on={!this.props.bittrexStatus} forceMonitor={this.props.forceMonitorBittrex}/>
			<MovingLine gauge={this.props.gauge} height={this.height}/>
			{this.book()}
			{this.progress()}
			<FormGroup>
			        <FormControlLabel
					  label={this.props.viewBook ? "Close OrderBook" : "Open OrderBook"}
					  style={{margin:"auto"}}
			          control={<Switch
				              checked={this.props.viewBook}
				              onChange={ this.props.toggleBook}
							/>}
			        />
			</FormGroup>	
			<div className="bTable">
				<Table>
				<TableHead>
					<TableRow>
						<th data-field="">Asset</th>
						<th data-field="">Balance</th>
						<th data-field="">{this.props.tradingPairs.misc ? this.props.tradingPairs.misc.toUpperCase() : ""}/Ratio</th>
						<th data-field="">BTC/Ratio</th>
						<th data-field="">&#8224;BTC</th>
						<th data-field="">&#8224;USDT</th>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<td>{this.props.tradingPairs.misc ? this.props.tradingPairs.misc.toUpperCase() : ""}</td>	
						<td>{this.props.balance[this.props.tradingPairs.misc]}</td>	
						<td>100%</td>				
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] * this.props.balance[this.props.tradingPairs.misc]*100/this.props.balance.btc).toFixed(0)+'%' : ""}</td>
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc].toFixed(7) : ""}</td>
						<td>{this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] ? this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc].toFixed(1) : ""}</td>
					</TableRow>
					<TableRow>
						<td>BTC</td>	
						<td>{this.props.balance.btc}</td>
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.balance.btc/this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] *100/this.props.balance[this.props.tradingPairs.misc]).toFixed(0)+'%' : ""}</td>
						<td>100%</td>
						<td>1</td>
						<td>{this.props.tradingPairs.bittrex.usdt_btc ? this.props.tradingPairs.bittrex.usdt_btc.toFixed(1) : "" }</td>
					</TableRow>
					<TableRow>
						<td>USDT</td>
						<td>{this.props.balance.usdt ? this.props.balance.usdt.toFixed(7) : 0}</td>
						<td>{this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] ? (100*((this.props.balance.usdt/this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc])/this.props.balance[this.props.tradingPairs.misc])).toFixed(0)+ '%' : ""}</td>
						<td>{this.props.tradingPairs.bittrex.usdt_btc ? (100*((this.props.balance.usdt/this.props.tradingPairs.bittrex.usdt_btc)/this.props.balance.btc)).toFixed(2)+ '%' : ""}</td>						
						<td>{this.props.tradingPairs.bittrex.usdt_btc ? (1/this.props.tradingPairs.bittrex.usdt_btc).toFixed(7) : "" }</td>
						<td>1</td>
					</TableRow>										
				</TableBody>
				</Table> 
				</div>
				<Table>
				<TableHead>
					<TableRow>
						<th data-field="">Trade</th>
						<th data-field="">$</th>
						<th data-field="">{this.props.tradingPairs.misc ? this.props.tradingPairs.misc.toUpperCase() : ""}</th>
						<th data-field="">BTC</th>
						<th data-field="">USDT</th>
						<th data-field="">Status</th>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<td>{this.props.tradingPairs.misc ? this.props.tradingPairs.misc.toUpperCase() : ""}</td>
						<td> <Input style={inputStyle} type="number" step={1} max={100} min={0} value={this.props.XXXAmount} onChange={this.props.updateXXXAmount} /> </td>
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.XXXAmount).toFixed(5) : 0}</td>
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.XXXAmount *  this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] ? (this.props.tradingPairs.bittrex.usdt_btc * this.props.XXXAmount *  this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{(this.props.XXXAmount * this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) > 0.002 && (this.props.XXXAmount) < this.props.balance[this.props.tradingPairs.misc] && (this.props.XXXAmount *  this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) < this.props.balance.btc && (this.props.tradingPairs.bittrex.usdt_btc * this.props.XXXAmount *  this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) < this.props.balance.usdt? <Switch checked={true}/> : <Switch checked={false}/>}</td>
					</TableRow>
					<TableRow>
						<td>BTC</td>
						<td> <Input style={inputStyle} step={1} type="number" max={100} min={0} value={this.props.BTCAmount} onChange={this.props.updateBTCAmount} /> </td>
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.BTCAmount / this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]).toFixed(5) : ""}</td>						
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.BTCAmount).toFixed(5) : 0}</td>
						<td>{this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] ? (this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] * this.props.BTCAmount / this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{(this.props.BTCAmount) > 0.002 &&	(this.props.BTCAmount) < this.props.balance.btc && (this.props.BTCAmount / this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) < this.props.balance[this.props.tradingPairs.misc] && (this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] * this.props.BTCAmount / this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) < this.props.balance.usdt ?<Switch checked={true}/> :  <Switch checked={false}/>}</td>					
					</TableRow>		
				</TableBody>
				</Table> 			
		
			</div>)
		
	}
}		

export default BittrexState;
