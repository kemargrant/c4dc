import React, { Component } from 'react';
import './App.css';
import AES from "crypto-js/aes";
import Enc from 'crypto-js/enc-utf8';
import Typography from '@material-ui/core/Typography';
import AppBar  from '@material-ui/core/AppBar';
import AutoRenew from '@material-ui/icons/Autorenew';
import Button from '@material-ui/core/Button';
import BubbleChart from '@material-ui/icons/BubbleChart';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InsertSettings from '@material-ui/icons/Settings';
import InsertFile from '@material-ui/icons/ShopTwo';
import InsertLogs from '@material-ui/icons/LibraryBooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Snackbar from '@material-ui/core/Snackbar';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TrendingDown from '@material-ui/icons/TrendingDown';
import TrendingUp from '@material-ui/icons/TrendingUp';
import {Line,Scatter} from 'react-chartjs-2';
import { Chart } from 'react-google-charts';
			
const TabContainer = function(props) {
	return <div style={{ padding: 1 * 3 }}>{props.children}</div>;
}

class ArbProgress  extends React.Component{
	constructor(props){
		super(props);
		this.count = this.count.bind(this);
		this.date = new Date();		
		this.count();
		this.timeout = false;
	}
	
	count(){
		if(this.props.time > 0){
			this.date = new Date();
			this.timeout = setTimeout(this.count,950)
		}	
	}
	componentWillUnmount(){
		return clearTimeout(this.timeout);
	}
	render(){
		return(
			<div>
			<LinearProgress variant="determinate" value={this.props.value} /> 
			<Button variant="raised" color="primary">Arbitrage In Progress</Button>
			<br/>
			{((this.date.getTime() - this.props.time)/60000).toFixed(2) + " Minutes Processing Arbitrage"} 
			</div>
			)
	}
}
const ArbToggle = function(props) {
	return (<div className="monitorToggle">
		<FormGroup>
	        <FormControlLabel
			  label={props.on ? "Active" : "Paused"}
			  style={{margin:"auto"}}
	          control={<Switch
		              checked={props.on}
		              onChange={(event, checked) => {
						  props.forceMonitor(props.pair,!checked)
						}}
					/>}
	        />
		</FormGroup>
		</div>)
}

const Config = function(props){	
	return (<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
	        <CardContent >
	           <Typography type="title">Server Connection</Typography>
	           <br/>
				<FormControl fullWidth={true}>
					<InputLabel>Private Key</InputLabel>
					<Input type="text" placeholder="Private Key" value={props.privatekey} onChange={props.updatePkey}/>
				</FormControl>	
				<FormControl fullWidth={true}>
					<InputLabel>Host</InputLabel>
					<Input type="text" value={props.websocketNetwork} onChange={props.updateNetwork}/>
				</FormControl>	
				<FormControl fullWidth={true}>	
					<InputLabel>Port Number</InputLabel>
					<Input type="number" placeholder="Port" min={0} value={props.port} onChange={props.updatePort}/>	
				</FormControl>				
	        </CardContent>
	        <CardActions>
		        <FormGroup>
		        <FormControlLabel
				  label="Connect"
				  style={{margin:"auto"}}
		          control={<Switch
						  
			              checked={props.connected}
			              onChange={(event, checked) => {
							  if(checked){
								  return props.begin();
							  }
							  else{
								  return props.end();
							  }
							}}
						/>}
		        />
				</FormGroup>	
				<FormGroup>
		        <FormControlLabel
				  label="AutoConnect"
				  style={{margin:"auto"}}
		          control={<Switch
			              checked={props.autoconnect}
			              onChange={(event, checked) => {
								return props.setStartup(checked);
							}}
						/>}
		        />
				</FormGroup>	        
	        </CardActions>
	        <CardActions>
	        <FormGroup>
	        <FormControlLabel
			  label="AutoSave Settings"
			  style={{margin:"auto"}}
	          control={<Switch
		              checked={props.autosave}
		              onChange={(event, checked) => {
						  return props._autosave(checked);
						}}
					/>}
	        />
			</FormGroup>
	        <FormGroup>
	        <FormControlLabel
			  label="Web Notifications"
			  style={{margin:"auto"}}
	          control={<Switch
		              checked={props.webNotify}
		              onChange={(event, checked) => {
						  return props._webNotify(checked);
						}}
					/>}
	        />
			</FormGroup>	
			</CardActions>
			<CardActions>		
			<FormGroup>
	        <FormControlLabel
			  label="Toast Notifications"
			  style={{margin:"auto"}}
	          control={<Switch
		              checked={props.toastNotify}
		              onChange={(event, checked) => {
						  return props._toastNotify(checked);
						}}
					/>}
	        />
			</FormGroup>					
			{
			!props.cleared ?
			<FormGroup>
	        <FormControlLabel
			  label="Reset Settings"
			  style={{margin:"auto"}}
	          control={<Switch
		              checked={props.cleared}
		              onChange={(event, checked) => {
						if(checked){
							return props.clearData();
						}
					}}
	            /> }
	        />
			</FormGroup> : <label>Data wiped!</label>
			}							
	        </CardActions>
		</Card>)
}	
class PMenu extends React.Component{
	constructor(props){
		super(props)
		this.menuOpen = this.menuOpen.bind(this);
		this.menuClose = this.menuClose.bind(this);
		this.state={
			menu_open:false,
			menuAnchor:null
			}
	}	

	menuOpen(evt){
		return this.setState({menuAnchor:evt.currentTarget,menu_open:true});
	}

	menuClose(){
		return this.setState({ menuAnchor: null,menu_open:false });
	}	
	
	render(){
		return (<div className="Burger">
		        <IconButton
		          aria-label="More"
		          aria-owns={this.state.menu_open ? 'long-menu' : null}
		          aria-haspopup="true"
		          style={{color:"white",backgroundColor:"transparent"}}
		          onClick={this.menuOpen}
		        >
		        <MoreVertIcon />
		        </IconButton>
		        <Menu
		          id="long-menu"
		          anchorEl={this.state.menuAnchor}
		          open={this.state.menu_open}
		          onClick={this.menuClose}
		          PaperProps={{
		            style: {
		              maxHeight: 48 * 4.5,
		              width: 200,
		            },
		          }}
		        >
		       {this.props.previous.map(option => (
		            <MenuItem key={option} onClick={()=>{this.props.click(option)}}>
		              {option}
		            </MenuItem>
		          ))}
		        <MenuItem key="xxx" onClick={this.menuClose}>
		        Close
		        </MenuItem>
		        </Menu>
		    </div>  )
	}
}
								
class ExchangeConfig extends React.Component{
	pairControl(){
		let p = [];
		for(var i = 0;i < this.props.binancePairs.length;i++){
			p.push(this.props.binancePairs[i].pair1);
		}
		return p.map((Pair) => (
		<div key={Pair}>
			 <div className="Switches">
			<FormGroup>
	        <FormControlLabel
			  id={Pair.replace("_","")}
			  label="Liquid Trades"
			  style={{margin:"auto"}}
	          control={<Switch
		              checked={this.props.liquidTradesBinance[Pair.replace("_","")]}
		              onChange={this.props.updateLiquidTradeBinance}
	            /> }
	        />
	        <FormControlLabel
			  id={Pair.replace("_","")+"_optimal"}
			  label="Optimal Trades"
			  style={{margin:"auto"}}
	          control={<Switch
		              checked={this.props.binanceOptimalTrades[Pair.replace("_","")] === true ? true: false}
		              onChange={(evt,checked)=>{this.props.updateBinanceOptimalTrades(Pair.replace("_",""),checked)}}
	            /> }
	        />
	        ({Pair.replace("_","")})
	        </FormGroup>
	        </div>	
			<InputLabel>Minimum {Pair.split("_")[1].toUpperCase()} Order</InputLabel>
			<br/>
			<Input type="number" id={Pair.replace("_","")} inputProps={{min: "0",step: "0.000001" }} value={this.props.binanceB1Minimum[Pair.replace("_","")]} onChange={this.props.updateBinanceB1Minimum}/>
			<br/>
			<InputLabel>Minimum {Pair.split("_")[0].toUpperCase()} Order</InputLabel>
			<br/>
			<Input type="number" id={Pair.replace("_","")} inputProps={{min: "0",step: "0.001" }} value={this.props.binanceC1Minimum[Pair.replace("_","")]} onChange={this.props.updateBinanceC1Minimum}/>
			<br/>
			<InputLabel> Trades &gt; 100% Lower Limit </InputLabel>
			<br/>
			<Input type="number" id={Pair.replace("_","")+"_over.lowerLimit"} inputProps={{min: "100",step: "0.001" }} value={this.props.binanceLimits[Pair.replace("_","")] ? this.props.binanceLimits[Pair.replace("_","")].over.lowerLimit : 100} onChange={this.props.updateBinanceLimits}/>
			<br/>
			<InputLabel>Trades &gt; 100% Upper Limit </InputLabel>
			<br/>
			<Input type="number" id={Pair.replace("_","")+"_over.upperLimit"} inputProps={{min: "100.001",step: "0.001" }} value={this.props.binanceLimits[Pair.replace("_","")] ? this.props.binanceLimits[Pair.replace("_","")].over.upperLimit : 100.001} onChange={this.props.updateBinanceLimits}/>
			<br/>
			<InputLabel> Trades &lt; 100% Lower Limit </InputLabel>
			<br/>
			<Input type="number" id={Pair.replace("_","")+"_under.lowerLimit"} inputProps={{min: "98",step: "0.001" }} value={this.props.binanceLimits[Pair.replace("_","")] ? this.props.binanceLimits[Pair.replace("_","")].under.lowerLimit : 98} onChange={this.props.updateBinanceLimits}/>
			<br/>
			<InputLabel>Trades &lt; 100% Upper Limit </InputLabel>
			<br/>
			<Input type="number" id={Pair.replace("_","")+"_under.upperLimit"} inputProps={{min: "98.1",step: "0.001" }} value={this.props.binanceLimits[Pair.replace("_","")] ? this.props.binanceLimits[Pair.replace("_","")].under.upperLimit : 99.99} onChange={this.props.updateBinanceLimits}/>
			</div>	
			))
	}
	render(){
		const bChecked = this.props.binanceConnections > 0 && this.props.connected ?  true : false;
		return (<div>
			<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
		        <CardContent>
		            <Typography type="title">Bittrex Configuration</Typography>
		            <br/>
					<InputLabel>Swing Polling Rate:{this.props.swingPollingRate/60000} Minutes</InputLabel>
					<br/>
					<Input type="number" min={10} max={1400001} value={this.props.swingPollingRate/1000} onChange={this.props.updateSwingPollingRate}/>
					 <div className="Switches">
					<FormGroup>
					{
						this.props.loadingBittrexSocket ? 
						<LinearProgress /> :
						<FormControlLabel
						  label="WebSocket Connection"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={this.props.bittrexSocketStatus}
					              onChange={(evt,checked)=>{this.props.controlBittrex(evt,checked)}}
				            /> }
				        />
			        }
			        <FormControlLabel
					  label="Sane Trades"
					  style={{margin:"auto"}}
			          control={<Switch
				              checked={this.props.sanity}
				              onChange={this.props.updateSanity}
			            /> }
			        />
			        <FormControlLabel
					  label="Liquid Trades"
					  style={{margin:"auto"}}
			          control={<Switch
				              checked={this.props.liquidTrades}
				              onChange={this.props.updateLiquidTrade}
			            /> }
			        />
			        <FormControlLabel
					  label="View Bittrex Order Book"
					  style={{margin:"auto"}}
			          control={<Switch
				              checked={this.props.viewBittrexBook}
				              onChange={this.props.forceBittrexView}
			            /> }
			        />
			        <FormControlLabel
					  label="Swing Trade"
					  style={{margin:"auto"}}
			          control={<Switch
				              checked={this.props.swingTrade}
				              onChange={this.props.updateSwingTrade}
			            /> }
			        />
			        </FormGroup>
			        </div>
					<InputLabel>Lower Limit</InputLabel>
					<br/>
					<Input type="number" min={0} max={120} value={this.props.lowerLimit} onChange={this.props.updateLowerLimit}/>
					<br/>
					<InputLabel>Upper Limit</InputLabel>
					<br/>
					<Input type="number"  min={0} max={120} value={this.props.upperLimit} onChange={this.props.updateUpperLimit}/>			       
					<br/>
					<InputLabel>Swing Percentage</InputLabel>
					<br/>
					<Input type="number" min={0} max={100} value={this.props.swingPercentage} onChange={this.props.updateSwingPercentage}/>
					<br/>
					<InputLabel>Log Level</InputLabel>
					<br/>
					<Input type="number" min={0} max={3} value={this.props.logLevel} onChange={this.props.updateLogLevel}/>						
		        </CardContent>
		        <CardActions>
					<Button variant="raised" color="primary" onClick={this.props.swing_reset}>Reset Swing Trading</Button>	
		        </CardActions>
			</Card> 		    
			<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
		        <CardContent>
		            <Typography type="title">Binance Configuration</Typography>
		            <br/>
					{
						this.props.loadingBinanceSocket ? 
						<LinearProgress /> :
			            <FormControlLabel
						  label="WebSocket Connection"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={bChecked}
					              onChange={(evt,checked)=>{this.props.controlBinance(evt,checked)}}
				            /> }
				        />
					}
			    {this.pairControl()}		
		        </CardContent>
				</Card> 
				</div>)
		
	}
}

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
//BinanceState
class BinanceState extends React.Component{
	activeToggle(pair){
		return <ArbToggle pair={pair} on={!this.props.binanceStatus[pair]} forceMonitor={this.props.forceMonitorBinance}/>
	}
	bTable(pair1,pair2,pair3,a,b,c){
		return(<div className="bTable">
			<Table>
				<TableHead>
					<TableRow>
						<th data-field="">Asset</th>
						<th data-field="">Balance</th>
						<th data-field="">{a.toUpperCase()}/Ratio</th>
						<th data-field="">{b.toUpperCase()}/Ratio</th>
						<th data-field="">&#8224;{b.toUpperCase()}</th>
						<th data-field="">&#8224;{c.toUpperCase()}</th>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<td>{a.toUpperCase()}</td>	
						<td>{this.props.balance[a]}</td>	
						<td>100%</td>				
						<td>{this.props.tradingPairs[pair1] ? (this.props.tradingPairs[pair1][pair1] * this.props.balance[a]*100/this.props.balance[b]).toFixed(2)+'%' : ""}</td>
						<td>{this.props.tradingPairs[pair1] ? this.props.tradingPairs[pair1][pair1].toFixed(7) : "" }</td>
						<td>{this.props.tradingPairs[pair1] ? this.props.tradingPairs[pair1][pair2].toFixed(2) : ""}</td>
					</TableRow>
					<TableRow>
						<td>{b.toUpperCase()}</td>	
						<td>{this.props.balance[b]}</td>
						<td>{this.props.tradingPairs[pair1] ? (this.props.balance[b]/this.props.tradingPairs[pair1][pair1] *100/this.props.balance[a]).toFixed(2)+'%' : ""}</td>
						<td>100%</td>
						<td>1</td>
						<td>{this.props.tradingPairs[pair1] ? this.props.tradingPairs[pair1][pair3].toFixed(2) : ""}</td>
					</TableRow>
					<TableRow>
						<td>{c.toUpperCase()}</td>
						<td>{ this.props.balance[c] ? this.props.balance[c].toFixed(7) : 0}</td>
						<td>{this.props.tradingPairs[pair1] ? (100*((this.props.balance[c]/this.props.tradingPairs[pair1][pair2])/this.props.balance[a])).toFixed(2)+ '%' : ""}</td>
						<td>{this.props.tradingPairs[pair1] ? (100*((this.props.balance[c]/this.props.tradingPairs[pair1][pair2])/this.props.balance[b])).toFixed(2)+ '%' : ""}</td>						
						<td>{this.props.tradingPairs[pair1] ? (1/this.props.tradingPairs[pair1][pair3]).toFixed(7) : ""}</td>
						<td>1</td>
					</TableRow>										
				</TableBody>
			</Table>
			</div>)
	}
	cTable(pair1,pair2,pair3,a,b,c){
		return(<Table>
			<TableHead>
				<TableRow>
					<th data-field="">Trade</th>
					<th data-field="">$</th>
					<th data-field="">{a.toUpperCase()}</th>
					<th data-field="">{b.toUpperCase()}</th>
					<th data-field="">{c.toUpperCase()}</th>
					<th data-field="">Status</th>
				</TableRow>
			</TableHead>
			<TableBody>
			<TableRow>
				<td>{b.toUpperCase()}</td>
				<td className="td_input"> <Input type="number" inputProps={{min: "0",step: "0.000001"}} id={pair1.replace("_","")} value={this.props.binanceB1Minimum[pair1.replace("_","")]} onChange={this.props.updateBinanceB1Minimum} /> </td>
				<td>{this.props.tradingPairs[pair1] ? (1/this.props.tradingPairs[pair1][pair1] * this.props.binanceB1Minimum[pair1.replace("_","")]).toFixed(5) : ""}</td>
				<td>{this.props.binanceB1Minimum[pair1.replace("_","")]}</td>						
				<td>{this.props.tradingPairs[pair1] ? (this.props.tradingPairs[pair1][pair3] * this.props.binanceB1Minimum[pair1.replace("_","")]).toFixed(5) : ""}</td>
				<td>{
					this.props.tradingPairs[pair1] ? 
					((this.props.binanceB1Minimum[pair1.replace("_","")] < this.props.balance[a]) && ((1/this.props.tradingPairs[pair1][pair1] * this.props.binanceB1Minimum[pair1.replace("_","")]) < this.props.balance[a]) && ((this.props.tradingPairs[pair1][pair2] * this.props.binanceB1Minimum[pair1.replace("_","")]) < this.props.balance[c]) ? <Switch checked={true}/> : <Switch checked={false}/>)
					: ""
					}					
			</td>	
			</TableRow>		
			<TableRow>
				<td>{a.toUpperCase()}</td>
				<td className="td_input"> <Input type="number" inputProps={{min: "0",step: "0.001"}} id={pair1.replace("_","")} value={this.props.binanceC1Minimum[pair1.replace("_","")]} onChange={this.props.updateBinanceC1Minimum} /> </td>
				<td>{this.props.binanceC1Minimum[pair1.replace("_","")]}</td>						
				<td>{this.props.tradingPairs[pair1] ? (this.props.tradingPairs[pair1][pair1] * this.props.binanceC1Minimum[pair1.replace("_","")]).toFixed(5) : ""}</td>
				<td>{this.props.tradingPairs[pair1] ? (this.props.tradingPairs[pair1][pair2] * this.props.binanceC1Minimum[pair1.replace("_","")]).toFixed(5) : ""}</td>
				<td>{this.props.tradingPairs[pair1] ?
					((this.props.binanceC1Minimum[pair1.replace("_","")] < this.props.balance[a]) 
					&&	((this.props.tradingPairs[pair1][pair1] * this.props.binanceC1Minimum[pair1.replace("_","")]) < this.props.balance[a]) &&
					((this.props.tradingPairs[pair1][pair2] * this.props.binanceC1Minimum[pair1.replace("_","")]) < this.props.balance[c])
					? <Switch checked={true}/> :  <Switch checked={false}/>)
					: ""
					}</td>
			</TableRow>	
			</TableBody>
			</Table> 	)
	}
	progressBar(pair){
		if(this.props.binanceStatusTime[pair] > 0){ 
			return <ArbProgress value={this.props.binanceProgress[pair]*100/3} time={ this.props.binanceStatusTime[pair]}/>
		}
		else{
			return null
		}
	}
	info(){
		let p = [];
		for(let i=0;i < this.props.binancePairs.length;i++){
			p.push([this.props.binancePairs[i].pair1,[this.props.binancePairs[i].pair1,this.props.binancePairs[i].pair2,this.props.binancePairs[i].pair3]])
		}
		if(p.length < 1){
			return (<div className="loader"></div>)
		}
		return p.map((Pair) => (
		<div key={Pair[0]}>
			{this.activeToggle(Pair[0].replace("_",""))}
			{this.progressBar(Pair[0].replace("_",""))}
			{this.bTable(Pair[0],Pair[1][2],Pair[1][1],Pair[0].split("_")[0],Pair[0].split("_")[1],Pair[1][1].split("_")[1])}
			{this.cTable(Pair[0],Pair[1][2],Pair[1][1],Pair[0].split("_")[0],Pair[0].split("_")[1],Pair[1][1].split("_")[1])}
		</div>
		))
	}
	render(){
		return (<div>
				<MovingLine gauge={this.props.gauge} height={this.props.height}/>
				{this.info()}
			</div>)
	}	
}	

//Bittrex Components
const StockChart = function(props){
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
							}
					}]
				}
			}
		}	
	if(props.data["Sorted"]){
		if(!props.small){
			config.data.datasets[0].data = props.data["Sorted"] && props.data["Sorted"][1].map((order) => {
				return {y:props.data["Bids"][order],x:Number(order)}
			})
			config.data.datasets[1].data = props.data["Sorted"] && props.data["Sorted"][0].map((order) => {
				return {y:props.data["Asks"][order],x:Number(order)}
			})
			config.options.title.text = props.pair;
			config.options.scales.xAxes[0].ticks.max = Number(props.data["Sorted"][0][props.data["Sorted"][0].length - 1])
			config.options.scales.xAxes[0].ticks.min = Number(props.data["Sorted"][1][props.data["Sorted"][1].length - 1])
		}
		else{
			config.data.datasets[0].data = props.data["Sorted"] && props.data["Sorted"][1].map((order) => {
				return {y:props.data["Bids"][order],x:1/Number(order)}
			})
			config.data.datasets[1].data = props.data["Sorted"] && props.data["Sorted"][0].map((order) => {
				return {y:props.data["Asks"][order],x:1/Number(order)}
			})
			config.options.title.text = props.pair + "(Scaled)";
			config.options.scales.xAxes[0].ticks.min = 1/Number(props.data["Sorted"][0][props.data["Sorted"][0].length - 1])
			config.options.scales.xAxes[0].ticks.max = 1/Number(props.data["Sorted"][1][props.data["Sorted"][1].length - 1])
		}
		return <Scatter
				height={props.style.height > 400 ? 50 : props.style.height/2}
				data={config.data}
				options={config.options} 
				/>
	}	
	return null;
}
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

const MovingLine = function(props) {
	return(<Line
			data={{
			labels: ['Scatter'],
			datasets:[
		    {
		      label: 'Percentage Moving Average ('+ props.gauge[0][props.gauge[0].length-1].y+')',
		      color:"blue",
		      borderColor:"green",
		      data: props.gauge[0],
		      lineTension:0,
		      fill:false,
		    },
		    {
		      label: 'Percent('+props.gauge[1][props.gauge[1].length-1].y +')',
		      color:"purple",
		      borderColor:"blue",
		      backgroundColor:"blue",
		      data: props.gauge[1],
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
			}],	
		},
	}} />)	
}

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
						<th data-field="">%</th>
						<th data-field="">{this.props.tradingPairs.misc ? this.props.tradingPairs.misc.toUpperCase() : ""}</th>
						<th data-field="">BTC</th>
						<th data-field="">USDT</th>
						<th data-field="">Status</th>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<td>{this.props.tradingPairs.misc ? this.props.tradingPairs.misc.toUpperCase() : ""}</td>
						<td className="td_input"> <Input type="number" step={1} max={100} min={0} value={this.props.percentage1 * 100} onChange={this.props.updatePercentage1} /> </td>
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.balance[this.props.tradingPairs.misc] * this.props.percentage1).toFixed(5) : 0}</td>
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.balance[this.props.tradingPairs.misc] * this.props.percentage1 *  this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] ? (this.props.tradingPairs.bittrex.usdt_btc * this.props.balance[this.props.tradingPairs.misc] * this.props.percentage1 *  this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{(this.props.balance[this.props.tradingPairs.misc] * this.props.percentage1 * this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) > 0.002 && (this.props.balance[this.props.tradingPairs.misc] * this.props.percentage1) < this.props.balance[this.props.tradingPairs.misc] && (this.props.balance[this.props.tradingPairs.misc] * this.props.percentage1 *  this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) < this.props.balance.btc && (this.props.tradingPairs.bittrex.usdt_btc * this.props.balance[this.props.tradingPairs.misc] * this.props.percentage1 *  this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) < this.props.balance.usdt? <Switch checked={true}/> : <Switch checked={false}/>}</td>
					</TableRow>
					<TableRow>
						<td>BTC</td>
						<td  className="td_input"> <Input step={1} type="number" max={100} min={0} value={this.props.percentage2 * 100} onChange={this.props.updatePercentage2} /> </td>
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.balance.btc * this.props.percentage2 / this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]).toFixed(5) : ""}</td>						
						<td>{this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc] ? (this.props.balance.btc * this.props.percentage2).toFixed(5) : 0}</td>
						<td>{this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] ? (this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] * this.props.balance.btc * this.props.percentage2 / this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{(this.props.balance.btc * this.props.percentage2) > 0.002 &&	(this.props.balance.btc * this.props.percentage2) < this.props.balance.btc && (this.props.balance.btc * this.props.percentage2 / this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) < this.props.balance[this.props.tradingPairs.misc] && (this.props.tradingPairs.bittrex['usdt_'+this.props.tradingPairs.misc] * this.props.balance.btc * this.props.percentage2 / this.props.tradingPairs.bittrex['btc_'+this.props.tradingPairs.misc]) < this.props.balance.usdt ?<Switch checked={true}/> :  <Switch checked={false}/>}</td>					
					</TableRow>		
				</TableBody>
				</Table> 			
		
			</div>)
		
	}
	
	
}		
	
//Profit Components
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

class BittrexProfit extends React.PureComponent{
	render() {
		return (
			<div>
			<div>
				{this.props.profit.btc ? this.props.profit.btc.toFixed(8) : 0}/{this.props.balance.btc} btc ({this.props.profit.btc > 0 ?  (this.props.profit.btc * 100/this.props.balance.btc).toFixed(8) :  0.00000000})%
				<LinearProgress variant="determinate" value={this.props.profit.btc ?  this.props.profit.btc * 100/this.props.balance.btc : 0} />
			</div>
	
				<div>
					{this.props.profit[this.props.tradingPairs.misc] ? this.props.profit[this.props.tradingPairs.misc].toFixed(8) : 0}/{this.props.balance[this.props.tradingPairs.misc]} {this.props.tradingPairs.misc} ({this.props.profit[this.props.tradingPairs.misc] ? (this.props.profit[this.props.tradingPairs.misc]*100/this.props.balance[this.props.tradingPairs.misc]).toFixed(8) : 0.00000000})%
					<LinearProgress variant="determinate" value={this.props.profit[this.props.tradingPairs.misc] ?  this.props.profit[this.props.tradingPairs.misc]*100/this.props.balance[this.props.tradingPairs.misc]: 0} />
				</div>
		
			</div>
		
		)
	}
}

//Stat Charts
class BinanceCharts extends React.PureComponent{
	constructor(props){
	super(props)
		this.updateDisplay = this.updateDisplay.bind(this);
		this.state = {display:false}	
		this.height = this.props.chartSize.height > 400 ? 100 : this.props.chartSize.height/2;
	}
	createLine(){
		if(this.props.lineList.length > 0){
			return this.props.lineList.map((option) => (
				<div key={option.key+Math.random(0,10)}>
					<Line 
					height={this.height}
					data={option.data}
					options={option.options} 
					/>	
			    </div>
			))
		}
	}
	createScatter(){
		return this.props.scatterList.map((_option)=>{
			return (
			<Scatter 
			height={this.height}
			key={Math.random(0,1)} 
			data={_option}
			options={{
				animation:{duration:0}
			}} 
			/>
			)
		})
	}
	updateDisplay(checked){
		return this.setState({display:checked})
	}
	render() {	
		return (<div>
			{this.createLine()}
			<FormGroup>
		        <FormControlLabel
				  label="Hide Scatter"
				  style={{margin:"auto"}}
		          control={<Switch
			              checked={this.display}
			              onChange={(event, checked) => { 
							  return this.updateDisplay(checked);
							}}
						/>}
		        />
			
			</FormGroup>
			{this.state.display ? "" : this.createScatter()}
			
		</div>)
	}	
}

class BittrexChart extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			display:false
		}
		this.updateDisplay = this.updateDisplay.bind(this);
	}
	createScatter(){
		return this.props.scatterList.map((_option)=>{
			return (
			<Scatter 
			height={this.height}
			key={Math.random(0,1)} 
			data={_option}
			options={{
				animation:{duration:0}
			}} 
			/>
			)
		})
	}
	chart(){
		if(this.props.data.data.datasets){
			return <Line height={this.props.style.height > 400 ? 100 : this.props.style.height/2} data={this.props.data.data} options={this.props.data.options} />
		}
		else {
			return null
		}
	}
	updateDisplay(checked){
		return this.setState({display:checked})
	}	
	render() {
		return (
			<div>
			{this.chart()}
			<FormGroup>
		        <FormControlLabel
				  label="Hide Scatter"
				  style={{margin:"auto"}}
		          control={<Switch
			              checked={this.display}
			              onChange={(event, checked) => { 
							  return this.updateDisplay(checked);
							}}
						/>}
		        />
			
			</FormGroup>
			{this.state.display ? "" : this.createScatter()}
			</div>);
	}
}
class Log extends React.PureComponent{
	render(){
		return <textarea value={this.props.text} readOnly> </textarea>	
	}
}
			
class App extends Component{
	constructor(props){
	    super(props);
	    this.state = {
			autoconnect: window.localStorage && window.localStorage.getItem("AutoConnect") ? JSON.parse(window.localStorage.getItem("AutoConnect")) : false,
			autosave: window.localStorage && JSON.parse(window.localStorage.getItem("Autosave")) ? true : false,
			balance: window.localStorage && JSON.parse(window.localStorage.getItem("Bittrex_Balance")) ? JSON.parse(window.localStorage.getItem("Bittrex_Balance")):{binance:{account:"Binance"},bittrex:{account:"Bittrex"}},
			binanceB1Minimum:{},
			binanceC1Minimum:{},
			binanceConnections:0,
			binanceGauge:[[{x:0,y:0}],[{x:0,y:0}]],
			bittrexGauge:[[{x:0,y:0}],[{x:0,y:0}]],
			binanceLimits:{},
			binanceOptimalTrades:{},
			binancePairs:[],
			binanceProfit: window.localStorage && JSON.parse(window.localStorage.getItem("Binance_Profit"))? JSON.parse(window.localStorage.getItem("Binance_Profit")) : {},
			bittrexProfit: window.localStorage && JSON.parse(window.localStorage.getItem("Bittrex_Profit"))? JSON.parse(window.localStorage.getItem("Bittrex_Profit")) : {btc:0},
			binanceProgress:{},
			bittrexProgress:0,
			bittrexPercentage:0,
			binanceStatus:{},
			bittrexStatus:true,
			binanceStatusTime:{},
			binanceUserStreamStatus:false,
			bittrexBook:{1:{"Bids":{},"Asks":{}},2:{"Bids":{},"Asks":{}},3:{"Bids":{},"Asks":{}}},
			bittrexSocketStatus:false,
			bittrexStatusTime:0,
			border:{
			    color:"#f9431a",
			        lineStyle: {
			        normal: {
			            type: 'solid',
			            width:3.5
			        }
			    },
                data: [
                    {
						color:["#f9431a"],
                        name : "---",
                        xAxis : 0,
                        yAxis : 100
                    },{
                        name :"High",
                        xAxis:0,
                        yAxis : 100.7524
                    },
                    {
                        name :"Low",
                        xAxis:0,
                        yAxis : 99.25
                    },
                ]
            },					
			dbScatter:window.localStorage && JSON.parse(window.localStorage.getItem("DB_Scatter_TradeBinance"))? JSON.parse(window.localStorage.getItem("DB_Scatter_TradeBinance")) : [],
			dbScatterBittrex:window.localStorage && JSON.parse(window.localStorage.getItem("DB_Scatter_TradeBittrex"))? JSON.parse(window.localStorage.getItem("DB_Scatter_TradeBittrex")) : [],
			dbTrade: window.localStorage && JSON.parse(window.localStorage.getItem("DB_Trade"))? JSON.parse(window.localStorage.getItem("DB_Trade")) : {data:{datasets:[{data:[]}]},options:{}},
			dbTradeBinance:window.localStorage && JSON.parse(window.localStorage.getItem("DB_TradeBinance"))? JSON.parse(window.localStorage.getItem("DB_TradeBinance")) : [{
				xAxis:{type:'time'},
				yAxis:{type:'value'}
			}],			
			cleared:false,
			chartSize:{
				width:document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth *0.9 : 1000,
				height:document.documentElement.clientHeight > 0 ? document.documentElement.clientHeight/1.9 : 500,
			},				
			connected:false,
			liquidTrades:true,
			liquidTradesBinance:{},
			loadingBittrexSocket:false,
			loadingBinanceSocket:false,
			log:"",
			logLevel:0,
			lowerLimit:89,
			orders: window.localStorage && JSON.parse(window.localStorage.getItem("Orders"))? JSON.parse(window.localStorage.getItem("Orders")):[],
			previous: window.localStorage && JSON.parse(window.localStorage.getItem("Previous_Connections"))? JSON.parse(window.localStorage.getItem("Previous_Connections")) : [],
			percentage1:null,
			percentage2:null,
			port:7071,
			privatekey: window.localStorage && window.localStorage.getItem("xxpkeyxx") ? window.localStorage.getItem("xxpkeyxx"): "",
			sanity:true,
			socketMessage:function(){},
			scatterOption:{
				labels: ['Scatter'],
				datasets: [
			    {
			      label: 'My First dataset',
			      fill: false,
			      backgroundColor: 'rgba(75,192,192,0.4)',
			      pointBorderColor: 'blue',
			      pointBackgroundColor: '#fff',
			      pointBorderWidth: 2,
			      pointHoverRadius: 5,
			      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
			      pointHoverBorderColor: 'rgba(220,220,220,1)',
			      pointHoverBorderWidth: 3,
			      pointRadius: 4,
			      pointHitRadius: 10,
			      data: []
			    }
			  ]
			},
			swingGauge:{},
			swingOrder:{},
			swingPercentage:2,
			swingPollingRate:0,
			swingTrade:false,
			tabValue:0,
			toast:{
				open:false,
				message:""
			},	
			toastNotify: window.localStorage && JSON.parse(window.localStorage.getItem("Toast_Notify")) ? true : false,
			tradingPairs: window.localStorage && JSON.parse(window.localStorage.getItem("Trading_Pairs"))? JSON.parse(window.localStorage.getItem("Trading_Pairs")) : {bittrex:{},binance:{},msc:""},
			upperLimit:101.79,
			webNotify: window.localStorage && JSON.parse(window.localStorage.getItem("Web_Notify")) ? true : false,
			websocketNetwork:"localhost",
			viewBittrexBook:false
		}
		this.autosave = this.autosave.bind(this);
		this.begin = this.begin.bind(this);
		this.changeTab = this.changeTab.bind(this);	
		this.clearData = this.clearData.bind(this);
		this.clearOrders = this.clearOrders.bind(this);
		this.connect = this.connect.bind(this);	
		this.controlBinance = this.controlBinance.bind(this);			
		this.controlBittrex = this.controlBittrex.bind(this);	
		this.end = this.end.bind(this);		
		this.forceBittrexView = this.forceBittrexView.bind(this);
		this.forceMonitorBinance = this.forceMonitorBinance.bind(this);
		this.forceMonitorBittrex = this.forceMonitorBittrex.bind(this);
		this.getBittrexDBTrade = this.getBittrexDBTrade.bind(this);
		this.getOrders = this.getOrders.bind(this);
		this.setStartup = this.setStartup.bind(this);
		this.swing_reset = this.swing_reset.bind(this);
		this.toastNotify = this.toastNotify.bind(this);
		this.webNotify = this.webNotify.bind(this);
		this.updateBinanceBalance = this.updateBinanceBalance.bind(this);	
		this.updateBinanceB1Minimum = this.updateBinanceB1Minimum.bind(this);	
		this.updateBinanceC1Minimum = this.updateBinanceC1Minimum.bind(this);
		this.updateBinanceLimits= this.updateBinanceLimits.bind(this);		
		this.updateBinanceOptimalTrades = this.updateBinanceOptimalTrades.bind(this);		
		this.updateBittrexBalance = this.updateBittrexBalance.bind(this);
		this.updateLiquidTrade = this.updateLiquidTrade.bind(this);
		this.updateLiquidTradeBinance = this.updateLiquidTradeBinance.bind(this);
		this.updateLogLevel = this.updateLogLevel.bind(this);
		this.updateLowerLimit = this.updateLowerLimit.bind(this);
		this.updateNetwork = this.updateNetwork.bind(this);
		this.updatePkey = this.updatePkey.bind(this);	
		this.updatePercentage1 = this.updatePercentage1.bind(this);	
		this.updatePercentage2 = this.updatePercentage2.bind(this);	
		this.updatePort = this.updatePort.bind(this);	
		this.updateSanity = this.updateSanity.bind(this);	
		this.updateSwingPercentage = this.updateSwingPercentage.bind(this);	
		this.updateSwingPollingRate = this.updateSwingPollingRate.bind(this);	
		this.updateSwingTrade = this.updateSwingTrade.bind(this);	
		this.updateUpperLimit = this.updateUpperLimit.bind(this);
	}
	autosave(checked){
		this.setState({autosave:checked});
		if(!checked){
			return window.localStorage.removeItem("Autosave");
		}
		else{
			return window.localStorage.setItem("Autosave",true);
		}	
	}
	
	begin(){
		return this.backgroundSocketSetup();
	}

	backgroundSocketSetup(){
		let js = "let closed = function(){return postMessage(null)};let ws;try{ws = new WebSocket('ws://sub_network');}catch(e){};onmessage = function(text){return ws.send(text.data)};ws.onopen = function(){return postMessage(0);};ws.onmessage = function(m){return postMessage({data:m.data,type:m.type})};ws.onclose = closed;ws.onerror = closed;"
		js = js.replace('sub_network',this.state.websocketNetwork+":"+this.state.port);
		let blob = new Blob([js]);			
		let blobURL = window.URL.createObjectURL(blob);
		let bsocket = new Worker(blobURL);
		bsocket.onmessage =(e)=> {
			if(e.data === null){
				this.setState({connected:false});
				return this.toast("Socket Error");
			}
			return this.faux_socket(e.data);
		};	
		let _previous = this.state.previous;
		if(this.state.autosave && this.state.privatekey){
			window.localStorage.setItem("xxpkeyxx",this.state.privatekey);
			var network = "ws://"+this.state.websocketNetwork+":"+this.state.port;
			if(_previous.indexOf(network) === -1){
				_previous.push(network);
				window.localStorage.setItem("Previous_Connections",JSON.stringify(_previous));
			}
		}
		return this.setState({previous:_previous,bsocket:bsocket});
	}
	
	changeTab(evt,value){
		return this.setState({tabValue:value});
	}	
	
	clearData(){
		let list = ["AutoConnect","Autosave","Bittrex_Balance","Binance_Profit","Bittrex_Profit","DB_Scatter_TradeBinance","DB_Scatter_TradeBittrex","DB_Trade","DB_TradeBinance","Orders","Previous_Connections","Toast_Notify","Trading_Pairs","Web_Notify","xxpkeyxx"];
		for(let i=0;i< list.length;i++){
			window.localStorage.removeItem(list[i]);
		}
		return this.setState({autosave:false,cleared:true});
	}
	
	clearOrders(){
		window.localStorage.removeItem("Orders");
		return this.setState({orders:[]});
	}		

	componentDidMount(){
		if(this.state.autoconnect === true && this.state.previous.length > 0){
			this.connect(this.state.previous[0]);
		}
		else if(this.state.previous[0]){
			this.setState({websocketNetwork:this.state.previous[0].split(':')[1].replace('//',''),port:Number(this.state.previous[0].split(':')[2])});
		}
		return;
	}
	
	connect(net){
		this.setState({menuAnchor:null,menu_open:false});
		if(!net.split(':')[1]){
			return;
		}
		return this.setState({websocketNetwork:net.split(':')[1].replace('//',''),port:Number(net.split(':')[2])},()=>{
			return this.begin();
		});
	}	

	controlBinance(evt,checked){
		this.setState({loadingBinanceSocket:true});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binance_control","bool":checked}),this.state.privatekey).toString());
	}				
					
	controlBittrex(evt,checked){
		this.setState({loadingBittrexSocket:true});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"bittrex_control","bool":checked}),this.state.privatekey).toString());
	}	
		
	end(){
		this.state.bsocket.terminate();
		return this.setState({bsocket:null,connected:false,bittrexSocketStatus:false,binanceUserStreamStatus:false,binancePairs:[],bittrexStatus:true});
	}
	
	faux_socket(data){
		if(data === 0){
			this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"connect"}),this.state.privatekey).toString());
			return this.setState({connected:true});
		}
		try{
			data = JSON.parse(AES.decrypt(data.data,this.state.privatekey).toString(Enc));
		}
		catch(e){
			this.toast("Bad private key:"+e);
			data = JSON.parse(data.data);
		}
		try{
			this.toast(data.type);
		}
		catch(e){
			this.toast(e);
		}		
		if(data.type === "balance"){
			return this.setState({balance:{bittrex:data.balance,binance:this.state.balance.binance}},()=>{
				if(this.state.autosave){
					window.localStorage.setItem("Bittrex_Balance",JSON.stringify(this.state.balance));
				}
				if(data.p1){
					this.setState({percentage1:data.p1,percentage2:data.p2,});
				}
			});
		}
		if(data.type === "balanceBinance"){
			return this.setState({balance:{bittrex:this.state.balance.bittrex,binance:data.balance}},()=>{
				if(this.state.autosave){
					window.localStorage.setItem("Bittrex_Balance",JSON.stringify(this.state.balance));
				}
			});
		}		
		
		if(data.type === "binancePercent"){
			if(!Number(data.percentage)){return;}
			let _binance = {}
			let _type = data.percentage > 100 ? "two" : "one";
			for(let key in data.info){
				for(let i = 0;i < this.state.binancePairs.length;i++){
					if(this.state.binancePairs[i].pair1.replace("_","") === key){
						_binance[this.state.binancePairs[i].pair1] = {}
						_binance[this.state.binancePairs[i].pair1]['pairs'] = [this.state.binancePairs[i].pair1,this.state.binancePairs[i].pair2,this.state.binancePairs[i].pair3]
						_binance[this.state.binancePairs[i].pair1][this.state.binancePairs[i].pair1] = data.info[key][_type].a;
						_binance[this.state.binancePairs[i].pair1][this.state.binancePairs[i].pair2] = data.info[key][_type].b;
						_binance[this.state.binancePairs[i].pair1][this.state.binancePairs[i].pair3] = data.info[key][_type].c;
						break;
					}
				}
			}
			let agauge = this.state.binanceGauge[1];
			let bgauge = this.state.binanceGauge[0];
			if(agauge.length > 20){
				agauge.shift(agauge.push({x:agauge[agauge.length - 1].x + 1,y:Number(data.percentage.toFixed(4))}))
				bgauge.shift(bgauge.push({x:agauge[agauge.length - 1].x,y:Number(((agauge.reduce((s,c)=>{return s+c.y},0))/agauge.length).toFixed(4)) }))
			}
			else{
				agauge.push({x:agauge.length,y:Number(data.percentage.toFixed(4))})
				bgauge.push({x:agauge.length-1,y:Number(((agauge.reduce((s,c)=>{return s+c.y},0))/agauge.length).toFixed(4)) })
			}
			
			let _tradingPairs = {bittrex:this.state.tradingPairs.bittrex,binance:_binance,misc:this.state.tradingPairs.misc}
			return this.setState({binanceGauge:[bgauge.slice(0),agauge],tradingPairs:_tradingPairs});
		}

		if(data.type === "binanceStatus"){
			let _binanceProgress = this.state.binanceProgress;
			let _binanceStatusTime = this.state.binanceStatusTime;
			for(let key in data.value){
				if(data.value[key] === false){
					_binanceProgress[key] = 0;
					_binanceStatusTime[key] = 0;
				}
			}			
			return this.setState({binanceStatus:data.value,binanceConnections:data.connections,loadingBinanceSocket:false,binanceProgress:_binanceProgress,binanceStatusTime:data.time,binanceUserStreamStatus:data.ustream});
		}			
		
		if(data.type === "bittrexBook"){
			let keys = Object.keys(data.book);
				for(let i = 0; i < keys.length;i++){
					try{
						data.book[keys[i]]["Sorted"][0] = data.book[keys[i]]["Sorted"][0].reverse().slice(0,15);
						data.book[keys[i]]["Sorted"][1] = data.book[keys[i]]["Sorted"][1].slice(0,15); 
					}
					catch(e){}
				}
				return this.setState({bittrexBook:data.book});
		}
		
		if(data.type === "bittrexStatus"){
			let _bittrexProgress = this.state.bittrexProgress;
			if(data.value !== true){
				_bittrexProgress = 0;
			}			
			return this.setState({bittrexStatus:data.value,bittrexProgress:_bittrexProgress,bittrexStatusTime:data.time,loadingBittrexSocket:false,bittrexSocketStatus:data.wsStatus});
		}
		
		if(data.type === "config"){
			return this.setState({viewBittrexBook:data.viewBook,loadingBittrexSocket:false,logLevel:data.logLevel,swingPollingRate:data.swingRate,sanity:data.sanity,liquidTrades:data.liquid,upperLimit:data.upperLimit,lowerLimit:data.lowerLimit,swingTrade:data.vibrate,swingPercentage:data.swingPercentage * 100,bittrexStatus:data.status,bittrexStatusTime:data.time,bittrexSocketStatus:data.wsStatus});
		}

		if(data.type === "configBinance"){
			let _binance = {}
			let _tradingPairs;
			let _progress = {}
			for(let i = 0;i < data.pairs.length;i++){
					_binance[data.pairs[i].pair1] = {}
					_progress[data.pairs[i].pair1.replace("_","")] = 0;
					_binance[data.pairs[i].pair1]['pairs'] = [data.pairs[i].pair1,data.pairs[i].pair2,data.pairs[i].pair3]
					_binance[data.pairs[i].pair1][data.pairs[i].pair1] = 0;
					_binance[data.pairs[i].pair1][data.pairs[i].pair2] = 0;
					_binance[data.pairs[i].pair1][data.pairs[i].pair3] = 0;
			}
			_tradingPairs = {bittrex:this.state.tradingPairs.bittrex,binance:_binance,misc:this.state.tradingPairs.misc}
			return this.setState({balance:{bittrex:this.state.balance.bittrex,binance:data.balance},loadingBinanceSocket:false,liquidTradesBinance:data.liquid,binanceConnections:data.connections,binanceStatus:data.status,binancePairs:data.pairs,binanceProgress:_progress,binanceStatusTime:data.time,binanceUserStreamStatus:data.ustream,binanceB1Minimum:data.minB1,binanceC1Minimum:data.minC1,tradingPairs:_tradingPairs,binanceLimits:data.limits,binanceOptimalTrades:data.optimal});
		}		
					
		if(data.type === "db_trade"){
			if(!this.state.tradingPairs.misc){
				let _temp = this.state.tradingPairs;
				_temp.misc = "xxx";
				this.setState({tradingPairs:_temp});
			}
			let _b1 = Object.keys(this.state.tradingPairs.bittrex).map((v,i)=>{
				if(v.split("_")[1] === this.state.tradingPairs.misc){
					return v.split("_")[0]
				}
				else{return null}
			})[0]
			let msc = this.state.tradingPairs.misc ? this.state.tradingPairs.misc.toUpperCase() : "XXX";
			let msc2 = Object.keys(this.state.tradingPairs.binance);
			function sort(array){
				let max = 0;
				let max_index;
				let order = []
				while(array.length > 0){
					for(let i=0;i<array.length;i++){
						if(max === 0 || array[i].Time > max){
							max = array[i].Time;
							max_index = i;
						}
					}
					order.unshift(array[max_index]);
					array.splice(max_index,1);
					max = 0;
				}
				return order;
			}
			function insert(str, index, value) {
				if(!str){
					return "";
				}
			    return str.substr(0, index) + value + str.substr(index);
			}
			let _binanceProfit = {}
			let _bittrexProfit = {}
			let _bittrexDurationScatter = {">100%":[],"<100%":[]}
			let _bittrexProfitScatter = {">100%":[],"<100%":[]}
			let _binanceScatter = {}
			let date;
			let date2 = {} //
			let v = [];
			let b1 = [];
			let _msc = [];
			let v2 = {};
			let b12 = {}
			let _msc2 = {}			
			let dat = {}
			let dat2 = {}
			let b1Count = {}
			let b1Count2 = {}
			let _mscCount = {}
			let _mscCount2 = {}
			data.info = sort(data.info);
			for(var i = 0;i < msc2.length;i++){
				_binanceProfit[msc2[i].replace("_","")] = {}
				_binanceScatter[msc2[i].replace("_","")] = {'>100%':[],'<100%':[],'>>100%':[],'<<100%':[]}
				date2[msc2[i].replace("_","")] = {}
				b12[msc2[i].replace("_","")] = []
				v2[msc2[i].replace("_","")] = []
				_msc2[msc2[i].replace("_","")] = []
				dat2[msc2[i].replace("_","")] = {}
				b1Count2[msc2[i].replace("_","")] = {};
				_mscCount2[msc2[i].replace("_","")] = {};
				//b1
				_binanceProfit[msc2[i].replace("_","")][msc2[i].split("_")[1]] = 0;
				//mc2
				_binanceProfit[msc2[i].replace("_","")][msc2[i].split("_")[0]] = 0;
				//u1
				_binanceProfit[msc2[i].replace("_","")][this.state.tradingPairs.binance[msc2[i]].pairs[1].split("_")[1]] = 0;
			}			
			_bittrexProfit[_b1] = 0;
			_bittrexProfit[msc.toLowerCase()] = 0;
			for(let k=0;k<data.info.length;k++){
				if(data.info[k].OrdersFilled < 3 || !data.info[k].OrdersFilled){
					continue;
				}
				if(data.info[k].Exchange === "Bittrex"){
					date = new Date(data.info[k].Time).toISOString().split("T")[0];
					if(dat[date]){
						dat[date]++;
					}
					else{
						dat[date]=1;
					}
					//Scatter Data
					if(data.info[k]){
						let base = this.state.tradingPairs.bittrex ? [this.state.tradingPairs.bittrex["usdt_"+_b1],this.state.tradingPairs.bittrex["usdt_"+this.state.tradingPairs.misc]] : [1,1];
						let profit = data.info[k].Profit * base[0] + data.info[k].Profit2 * base[1];
						if(data.info[k].Percent < 100){
							_bittrexDurationScatter['<100%'].push({x:Number(data.info[k].Percent.toFixed(4)),y:Number(((data.info[k].Filled - data.info[k].Time)/60000).toFixed(2))});
							_bittrexProfitScatter['<100%'].push({x:Number(data.info[k].Percent.toFixed(4)),y:Number(profit.toFixed(4))});
						}
						else{
							_bittrexDurationScatter['>100%'].push({x:Number(data.info[k].Percent.toFixed(4)),y:Number(((data.info[k].Filled - data.info[k].Time)/60000).toFixed(2))});
							_bittrexProfitScatter['>100%'].push({x:Number(data.info[k].Percent.toFixed(4)),y:Number(profit.toFixed(4))});
						}
					}
					//profit
					if(data.info[k].Percent > 100){
						if(Number(data.info[k].After - data.info[k].Before)){
							_bittrexProfit[_b1] += (data.info[k].After - data.info[k].Before);
						}
						if(b1Count[date]){
							b1Count[date]++;
						}
						else{
							b1Count[date]=1;
						}
					}
					else{
						if(Number(data.info[k].After - data.info[k].Before)){
							_bittrexProfit[msc.toLowerCase()] += (data.info[k].After - data.info[k].Before);
						}
						if(_mscCount[date]){
							_mscCount[date]++;
						}
						else{
							_mscCount[date]=1;
						}
					}
				}
				else if(data.info[k].Exchange === "Binance"){
					let myPair = this.state.tradingPairs.binance[insert(data.info[k].Pair,3,"_")] ? insert(data.info[k].Pair,3,"_") : insert(data.info[k].Pair,4,"_");
					let Csplit = this.state.tradingPairs.binance[insert(data.info[k].Pair,3,"_")] ? this.state.tradingPairs.binance[insert(data.info[k].Pair,3,"_")] : this.state.tradingPairs.binance[insert(data.info[k].Pair,4,"_")];
					try{
						if(data.info[k].Time < 1)continue;
						date2[data.info[k].Pair] = new Date(data.info[k].Time).toISOString().split("T")[0];
						if(dat2[data.info[k].Pair] && dat2[data.info[k].Pair][date2[data.info[k].Pair]]){
							dat2[data.info[k].Pair][date2[data.info[k].Pair]]++;
						}
						else if(dat2[data.info[k].Pair]){
							dat2[data.info[k].Pair][date2[data.info[k].Pair]] = 1;
						}
						if(data.info[k].Percent > 100){
							//Scatter Data
							if(data.info[k].Filled && _binanceScatter[data.info[k].Pair]){
								_binanceScatter[data.info[k].Pair]['>100%'].push({x:Number(data.info[k].Percent.toFixed(4)),y:Number(((data.info[k].Filled - data.info[k].Time)/60000).toFixed(2))});
								let profit = data.info[k].Profit3 + data.info[k].Profit2*(Csplit[Csplit.pairs[2]]) + data.info[k].Profit*(Csplit[Csplit.pairs[1]]); 
								_binanceScatter[data.info[k].Pair]['>>100%'].push({x:Number(data.info[k].Percent.toFixed(4)),y:Number(profit.toFixed(4))});
							}
							//Profits
							if(_binanceProfit[data.info[k].Pair]){
								_binanceProfit[data.info[k].Pair][myPair.split("_")[1]] += data.info[k].Profit;
								if(data.info[k].Profit2){
									_binanceProfit[data.info[k].Pair][myPair.split("_")[0]] += data.info[k].Profit2;
								}
								if(data.info[k].Profit3){
									_binanceProfit[data.info[k].Pair][Csplit.pairs[2].split("_")[1]] += data.info[k].Profit3;
								}
							}
							//Trade
							if(b1Count2[data.info[k].Pair]){
								if(b1Count2[data.info[k].Pair][date2[data.info[k].Pair]]){
									b1Count2[data.info[k].Pair][date2[data.info[k].Pair]]++;
								}
								else{
									b1Count2[data.info[k].Pair][date2[data.info[k].Pair]] = 1;
								}
							}
						}
						else{
							//Scatter Data
							if(data.info[k].Filled && _binanceScatter[data.info[k].Pair]){
								_binanceScatter[data.info[k].Pair]['<100%'].push({x:Number(data.info[k].Percent.toFixed(4)),y:Number(((data.info[k].Filled - data.info[k].Time)/60000).toFixed(2))});
								let profit = data.info[k].Profit3 + data.info[k].Profit2*(Csplit[Csplit.pairs[2]]) + data.info[k].Profit*(Csplit[Csplit.pairs[1]]); 
								_binanceScatter[data.info[k].Pair]['<<100%'].push({x:Number(data.info[k].Percent.toFixed(4)),y:Number(profit.toFixed(4))});
								
							
							}
							//Profits
							if(_binanceProfit[data.info[k].Pair]){
								_binanceProfit[data.info[k].Pair][myPair.split("_")[1]] += data.info[k].Profit;
								if(data.info[k].Profit2 && data.info[k].Profit2 > 0 ){
									_binanceProfit[data.info[k].Pair][myPair.split("_")[0]] += data.info[k].Profit2;
								}
								if(data.info[k].Profit3){
									_binanceProfit[data.info[k].Pair][Csplit.pairs[2].split("_")[1]] += data.info[k].Profit3;
								}
							}
							//Trade
							if(_mscCount2[data.info[k].Pair]){
								if(_mscCount2[data.info[k].Pair][date2[data.info[k].Pair]]){
									_mscCount2[data.info[k].Pair][date2[data.info[k].Pair]]++;
								}
								else{
									_mscCount2[data.info[k].Pair][date2[data.info[k].Pair]] = 1;
								}
							}
						}
					}
					catch(e){
						console.log(e)
					}
				}
			}
			for(let key in dat){
				v.push({x:key,y:dat[key]})
			}
			for(let key in b1Count){
				b1.push({x:key,y:b1Count[key]})
			}
			for(let key in _mscCount){
				_msc.push({x:key,y:_mscCount[key]})
			}
			for(let i = 0;i < msc2.length;i++){
				for(let key in dat2[msc2[i].replace("_","")]){
					v2[msc2[i].replace("_","")].push({x:key,y:dat2[msc2[i].replace("_","")][key] });
				}
				for(let key in b1Count2[msc2[i].replace("_","")]){
					b12[msc2[i].replace("_","")].push({x:key,y:b1Count2[msc2[i].replace("_","")][key]});
				}
				for(let key in _mscCount2[msc2[i].replace("_","")]){
					_msc2[msc2[i].replace("_","")].push({x:key,y:_mscCount2[msc2[i].replace("_","")][key]});
				}		
			}	
			var config = {
			data: {
				datasets: [{
					label: 'Total',
					borderColor:"red",
					backgroundColor:"red",
					fill:false,
					data: v,
				}, {
					label: '>100%',
					borderColor:"blue",
					fill: false,
					data: b1,
				}, {
					label: '<100%',
					borderColor: "green",
					fill: false,
					data: _msc,
				}]
			},
			options: {
				title: {
					text: 'Bittrex'
				},
				tooltips:{
					mode:'x',
					intersect:false,
				},
				hover:{
					mode:'y',
					intersect:true
				},				
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							unit:'day',
							  displayFormats: {
                                        'day': 'MMM Do'
                                    },
							
						},
					}],
					yAxes: [{
						ticks: {
							min:0,
							stepSize:5
						}
					}],					
				},
			}
			};	
			let scatterOption =[]
		    let option2 = [];
		    let scatterOption2 = [];
		    let _scatterOption2;
		    let _scatterOption3;
		    let _option2;
		    //bittrex Scatter
			let scatterOptionD = JSON.parse(JSON.stringify(this.state.scatterOption));
			scatterOptionD.labels = "Duration Scatter";
			scatterOptionD.datasets[0].backgroundColor = "blue";
			scatterOptionD.datasets[0].label = msc + " Percent vs Duration(m)";
			scatterOptionD.datasets[0].data = _bittrexDurationScatter['>100%'].concat(_bittrexDurationScatter['<100%']);
			let scatterOptionP = JSON.parse(JSON.stringify(this.state.scatterOption));
			scatterOptionP.labels = "Profit Scatter";
			scatterOptionP.datasets[0].backgroundColor = "blue";
			scatterOptionP.datasets[0].label = msc + " Percent vs Profit(usdt)";
			scatterOptionP.datasets[0].data = _bittrexProfitScatter['>100%'].concat(_bittrexProfitScatter['<100%']);
			let total = (scatterOptionP.datasets[0].data.reduce((s,c)=>{return s+c.y},0));
			scatterOptionP.datasets[0].label += " Total:"+total;
			scatterOption.push(scatterOptionD);		
			scatterOption.push(scatterOptionP);	    
		    //binance Scatter
		    for(let i = 0;i < msc2.length;i++){
				_option2 = JSON.parse(JSON.stringify(config));
			    _option2.data.datasets[0].data = v2[msc2[i].replace("_","")];
			    _option2.data.datasets[1].data = b12[msc2[i].replace("_","")];
			    _option2.data.datasets[2].data = _msc2[msc2[i].replace("_","")];
			    _option2.key = msc2[i].replace("_","");
			    option2.push(_option2);
			    //Scatter Data percent vs duration
			    _scatterOption2 = JSON.parse(JSON.stringify(this.state.scatterOption));
			    _scatterOption2.labels = "Scatter";
			    _scatterOption2.datasets[0].backgroundColor = "blue";
			    _scatterOption2.datasets[0].label = msc2[i].replace("_","") + " Percent vs Duration(m)";
			    _scatterOption2.datasets[0].data = _binanceScatter[msc2[i].replace("_","")]['>100%'].concat(_binanceScatter[msc2[i].replace("_","")]['<100%']);
			    scatterOption2.push(_scatterOption2);	
			    //Scatter Data percent vs profit
			    _scatterOption3 = JSON.parse(JSON.stringify(this.state.scatterOption));
			    _scatterOption3.labels = "Scatter2";
			    _scatterOption3.datasets[0].label = msc2[i].replace("_","") + " Percent vs Profit ("+ this.state.tradingPairs.binance[msc2[i]].pairs[1].split("_")[1]+")";
			    _scatterOption3.datasets[0].data = _binanceScatter[msc2[i].replace("_","")]['>>100%'].concat(_binanceScatter[msc2[i].replace("_","")]['<<100%'])
			    let total = (_scatterOption3.datasets[0].data.reduce((s,c)=>{return s+c.y},0));
			    _scatterOption3.datasets[0].label += " Total:"+total;
			    scatterOption2.push(_scatterOption3);			    
			}
			if(this.state.autosave){
					window.localStorage.setItem("DB_Trade",JSON.stringify(config));
					window.localStorage.setItem("DB_TradeBinance",JSON.stringify(option2));
					window.localStorage.setItem("DB_Scatter_TradeBinance",JSON.stringify(scatterOption2));
					window.localStorage.setItem("DB_Scatter_TradeBittrex",JSON.stringify(scatterOption));
					window.localStorage.setItem("Binance_Profit",JSON.stringify(_binanceProfit));
					window.localStorage.setItem("Bittrex_Profit",JSON.stringify(_bittrexProfit));
			}
			return this.setState({dbTrade:config,dbTradeBinance:option2,binanceProfit:_binanceProfit,bittrexProfit:_bittrexProfit,dbScatterBittrex:scatterOption,dbScatter:scatterOption2});
		}				
		
		if(data.type === "log"){
			this.setState({log:data.log+'\r\n<----------->\r\n'+this.state.log+'\r\n'});
		}	
			
		if(data.type === "order"){
			let _new_orders = this.state.orders;
			if(data.exchange === "Binance"){
				data.image = "url('https://www.binance.com/resources/img/logo-en.png')";
			}
			else if(data.exchange === "Bittrex"){
				data.image = "url('https://pbs.twimg.com/profile_banners/2309637680/1420589155/1500x500')";
			}
			_new_orders.push({"image":data.image,"filled":data.filled,"exchange":data.exchange,"order_id":data.order_id,"type":data.otype,"amount":data.amount,"pair":data.pair,"status":data.status,"rate":data.rate,"timestamp_created":data.timestamp_created});
			if(this.state.autosave){
				window.localStorage.setItem("Orders",JSON.stringify(_new_orders));
			}
			return this.setState({orders:_new_orders});
		}		
			
		if(data.type === "orderRemove"){
			let base;
			let exchange;
			let _pair;
			let _binanceProgress = this.state.binanceProgress;
			let _bittrexProgress = this.state.bittrexProgress;
			let _edit_orders = [];		
			function insert(str, index, value) {
				if(!str){
					return ""
				}
			    return str.substr(0, index) + value + str.substr(index);
			}	
			for(let i = 0;i < this.state.orders.length;i++){
				if(this.state.orders[i].order_id !== data.order_id){
					_edit_orders.push(this.state.orders[i]);
				}
				else{
					exchange = this.state.orders[i].exchange;
					_pair = this.state.orders[i].pair.toLowerCase();
				}
			}
			
			this.state.binancePairs.map((v,j)=>{
				let list = [v.pair1,v.pair2,v.pair3]
				let myPair = list.indexOf(insert(_pair,3,"_")) > -1 ? insert(_pair,3,"_") : insert(_pair,4,"_");
				if(this.state.binancePairs[j].pair1 === myPair || this.state.binancePairs[j].pair2 === myPair || this.state.binancePairs[j].pair3 ===  myPair){
					base = this.state.binancePairs[j].pair1.replace("_","");
				}
				return base;
			});
			if(exchange === "Binance"){
				_binanceProgress[base] += 1;
				if (_binanceProgress[base] === 3){
					_binanceProgress[base] = 0;
				}
			}
			else{
				_bittrexProgress += 1;
				if (_bittrexProgress === 3){
					_bittrexProgress = 0;
				}
			}
			if(this.state.autosave){
				window.localStorage.setItem("Orders",JSON.stringify(_edit_orders));
			}			
			return this.setState({orders:_edit_orders,binanceProgress:_binanceProgress,bittrexProgress:_bittrexProgress});
		}				
			
		if(data.type === "percentage"){
			if(!Number(data.percentage)){return;}
			let _tradingPairs = {bittrex:{},binance:this.state.tradingPairs.binance}
			for(let key in data){
				if(key.search('-') > -1){
					_tradingPairs.bittrex[key.toLowerCase().replace('-','_')] = data[key];
					if(key.search('BTC') > -1 && key.search('USDT') <0){
						_tradingPairs.misc = key.replace('BTC-','').toLowerCase();
					}
				}
			}
			let agauge = this.state.bittrexGauge[1].slice(0);
			let bgauge = this.state.bittrexGauge[0].slice(0);
			if(agauge.length > 20){
				agauge.shift(agauge.push({x:agauge[agauge.length - 1].x + 1,y:Number(data.percentage.toFixed(4))}))
				bgauge.shift(bgauge.push({x:agauge[agauge.length - 1].x,y:Number(((agauge.reduce((s,c)=>{return s+c.y},0))/agauge.length).toFixed(4)) }))
			}
			else{
				agauge.push({x:agauge.length,y:Number(data.percentage.toFixed(4))})
				bgauge.push({x:agauge.length-1,y:Number(((agauge.reduce((s,c)=>{return s+c.y},0))/agauge.length).toFixed(4)) })
			}
			if(this.state.autosave){
				window.localStorage.setItem("Trading_Pairs",JSON.stringify(_tradingPairs));
			}
			return this.setState({tradingPairs:_tradingPairs,bittrexPercentage:data.percentage,bittrexGauge:[bgauge,agauge]});
		}		
		if(data.type === "swing"){
			let gauge = {
				tooltip : {
					formatter: "{c}"
				},
				series:[{
						axisLine:{
							lineStyle:{
								width:this.state.chartSize.width/120
							}
						},
						splitLine: {          
			                length:this.state.chartSize.height/15,      
			                lineStyle: {
			                    color: 'blue'
			                }
			            },
						radius:"80%",
						name:"Swing Trade",
						type: 'gauge',
						splitNumber: 6,
						title : {
							show:false,
			            },
						min: data.target > data.price ? data.target/1.15 : data.target,
						max:data.target > data.price ? data.target : data.price*1.15,
						detail:{
			                formatter:"Current "+data.trade+"\r\n{value}",
			                textBorderColor: 'white',
			                fontFamily: 'Roboto',
			                fontSize:15,
			                width: 100,
			                color: 'black',
			            },
						data: [{value: data.price, name: "Target Price:\n\r"+data.target}]
					}]
			}
			this.setState({swingGauge:gauge});
		}	
		
		if (data.type === "swingOrder"){
			this.setState({swingOrder:data.order});
		}
		
		if (data.type === "swingStatus"){
			let gauge = {
				series:[{
						axisLine:{
							lineStyle:{
								width:this.state.chartSize.width/120
							}
						},
						type:"gauge",
						radius:"80%",
						min: data.order ? data.order.order.Limit/1.5 : 0,
						max: data.order ? data.order.order.Limit*1.5 : 1,
						data: [{name: "Loading",value:0}]
					}]
			}
			if(data.order && data.on === true){
				this.setState({swingGauge:gauge,swingOrder:data.order});
			}		
		}																									
	}	
		
	forceBittrexView(evt,checked){
		this.setState({viewBittrexBook:checked});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"bittrex_book","bool":checked}),this.state.privatekey).toString());				
	}	
		
	forceMonitorBinance(pair,checked){
		let _binanceStatus = this.state.binanceStatus;
		_binanceStatus[pair] = checked;
		this.setState({binanceStatus:_binanceStatus});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binanceMonitor","bool":checked,"pair":pair}),this.state.privatekey).toString());				
	}
	
	forceMonitorBittrex(pair,checked){
		this.setState({bittrexStatus:checked});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"bittrexMonitor","bool":checked}),this.state.privatekey).toString());				
	}		

	getBittrexDBTrade(){
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"bittrex_db","db":"trade"}),this.state.privatekey).toString());
	}		
						
	getOrders(){
		this.clearOrders();
		this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binance_orders"}),this.state.privatekey).toString());
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"bittrex_orders"}),this.state.privatekey).toString());
	}		
	
	setStartup(checked){
		this.setState({autoconnect:checked});
		return window.localStorage.setItem("AutoConnect",checked);
	}		
	
	swing_reset(){
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"swingReset"}),this.state.privatekey).toString());
	}
	
	toast(message){
		if(this.state.toastNotify){
			if(this.state.toast.open === false){	
				this.setState({toast:{message:message,open:true}});
			}
			else{
				if(message === this.state.toast.message){
					return;
				}
				this.setState({toast:{message:message+'\r\n'+this.state.toast.message,open:true}});
			}
			setTimeout(()=>{return this.setState({toast:{open:false}});},2000);
		}
		((_message)=>{
			if(document.hasFocus() || message === "log" || !this.state.webNotify){
				return;
			}
			let n;
			let _body = "";
			if(message === "percentage"){
				_body =  "Percentage:"+this.state.bittrexPercentage.toFixed(3) + "%";
			}
			if (!("Notification" in window)) {
			    alert("This browser does not support system notifications");
			}
			else if (Notification.permission === "granted"){
				n = new Notification(_message,{body:_body,icon:"https://arbitrage.0trust.us/favicon.ico"});
			}
			else if (Notification.permission !== 'denied'){
				 Notification.requestPermission(function(permission) {
					if (permission === "granted") {
						n = new Notification(_message,{body:_body,icon:"https://arbitrage.0trust.us/favicon.ico"});
					}
				});
			}
		    if(n){
				return setTimeout(n.close.bind(n),5000);
			}
		})(message);	
	}	

	toastNotify(checked){
		this.setState({toastNotify:checked});
		if(!checked){
			return window.localStorage.removeItem("Toast_Notify");
		}
		else{
			return window.localStorage.setItem("Toast_Notify",true);
		}	
	}	

	updateBinanceBalance(){
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binance_balance"}),this.state.privatekey).toString());
	}			

	updateBinanceB1Minimum(evt){
		let _B1Min = this.state.binanceB1Minimum;
		_B1Min[evt.currentTarget.id] = evt.currentTarget.value;
		this.setState({binanceB1Minimum:_B1Min});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binanceB1Minimum","min":evt.currentTarget.value,"pair":evt.currentTarget.id}),this.state.privatekey).toString());			
	}
	
	updateBinanceC1Minimum(evt){	
		let _C1Min = this.state.binanceC1Minimum;
		_C1Min[evt.currentTarget.id] = evt.currentTarget.value;		
		this.setState({binanceC1Minimum:_C1Min});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binanceC1Minimum","min":evt.currentTarget.value,"pair":evt.currentTarget.id}),this.state.privatekey).toString());			
	}	

	updateBinanceLimits(evt){
		let _limits = this.state.binanceLimits;
		let base = evt.currentTarget.id.split("_");
		let key = base[1].split(".");
		_limits[base[0]][key[0]][key[1]] = evt.currentTarget.value;
		this.setState({binanceLimits:_limits});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binanceLimits","value":evt.currentTarget.value,"pair":base[0],"selection":base[1]}),this.state.privatekey).toString());			
	}

	updateBinanceOptimalTrades(pair,checked){	
		let _optimal = this.state.binanceOptimalTrades;
		_optimal[pair] = checked;	
		this.setState({binanceOptimalTrades:_optimal});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binanceOptimal","bool":checked,"pair":pair}),this.state.privatekey).toString());			
	}	

	updateLogLevel(evt){
		this.setState({logLevel:evt.currentTarget.value});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"logs","logLevel":evt.currentTarget.value}),this.state.privatekey).toString());			
	}	
			
	updateBittrexBalance(){
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"bittrex_balance"}),this.state.privatekey).toString());
	}					

	updateLiquidTrade(evt,checked){
		this.setState({liquidTrades:checked});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"liquidTrade","bool":checked}),this.state.privatekey).toString());
	}

	updateLiquidTradeBinance(evt,checked){
		this.setState({liquidTradesBinance:checked});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"liquidTradeBinance","bool":checked,"pair":evt.currentTarget.id}),this.state.privatekey).toString());
	}		
	
	updateLowerLimit(evt){
		this.setState({lowerLimit:evt.currentTarget.value});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"lowerLimit","limit":evt.currentTarget.value}),this.state.privatekey).toString());			
	}
	
	updateNetwork(evt){
		if(evt.currentTarget.value){
			return this.setState({websocketNetwork:evt.currentTarget.value});
		}
		else{
			return this.setState({websocketNetwork:""});
		}
	}
	
	updatePercentage1(evt){
		this.setState({percentage1:evt.currentTarget.value/100});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"update_percentage","percentage1":evt.currentTarget.value/100,"percentage2":this.state.percentage2}),this.state.privatekey).toString());
	}
	
	updatePercentage2(evt){
		this.setState({percentage2:evt.currentTarget.value/100});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"update_percentage","percentage2":evt.currentTarget.value/100,"percentage1":this.state.percentage1}),this.state.privatekey).toString());			
	}		

	updatePkey(evt){
		if(evt.currentTarget.value){
			return this.setState({privatekey:evt.currentTarget.value});
		}
		else{
			return this.setState({privatekey:""});
		}
	}
					
	updatePort(evt){
		if(evt.currentTarget.value){
			return this.setState({port:evt.currentTarget.value});
		}
		else{
			return this.setState({port:0});
		}
	}	
		
	updateSanity(evt,checked){
		this.setState({sanity:checked});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"sanity","bool":checked}),this.state.privatekey).toString());
	}

	updateSwingPercentage(evt){
		let rate = evt.currentTarget.value; 
		this.setState({swingPercentage:rate});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"swingPercentage","percentage":rate}),this.state.privatekey).toString());
	}
	
	updateSwingPollingRate(evt){
		let rate = evt.currentTarget.value; 
		this.setState({swingPollingRate:rate * 1000});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"swingPoll","rate":rate}),this.state.privatekey).toString());
	}	
		
	updateSwingPrice(){
		if(this.state.swingOrder.on === false || !this.state.swingOrder.order){
			return;
		}
		let req = new XMLHttpRequest();
		req.open("GET","https://cors-anywhere.herokuapp.com/https://bittrex.com/api/v1.1/public/getticker?market="+this.state.swingOrder.order.Exchange,true);
		req.onload = ()=>{
			if (req.status === 200){
					let ticker = JSON.parse(req.responseText);
					let _swingGauge = this.state.swingGauge;
					if(this.state.swingOrder.order.Type === "LIMIT_BUY"){
						_swingGauge.series[0].data = [{value:ticker.result.Bid,name:_swingGauge.series[0].data[0].name}];
					}
					else{
						_swingGauge.series[0].data = [{value:ticker.result.Ask,name:_swingGauge.series[0].data[0].name}];
					}
					return this.setState({swingGauge:_swingGauge});
				}
		}
		req.onerror = (e)=>{
			return this.toast(e);
		}
		if(document.hasFocus()){
			setTimeout(()=>{this.updateSwingPrice()},10000);
			return req.send();
		} 
	}
		
	updateSwingTrade(evt,checked){
		this.setState({swingTrade:checked});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"swingTrade","bool":checked}),this.state.privatekey).toString());
	}		

	updateUpperLimit(evt){
		this.setState({upperLimit:evt.currentTarget.value});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"upperLimit","limit":evt.currentTarget.value}),this.state.privatekey).toString());			
	}		
		
	webNotify(checked){
		this.setState({webNotify:checked});
		if(!checked){
			return window.localStorage.removeItem("Web_Notify");
		}
		else{
			return window.localStorage.setItem("Web_Notify",true);
		}	
	}	
	render(){  	
		return (
		  <div className="App">
			<AppBar position="static">
			<Tabs scrollable value={this.state.tabValue} onChange={this.changeTab} fullWidth>	
				<Tab label="Binance" icon={this.state.binanceUserStreamStatus && this.state.connected ? <TrendingUp color="inherit"/> : <TrendingDown color="error"/>}></Tab>				
				<Tab label="Bittrex" icon={this.state.bittrexSocketStatus && this.state.connected ? <TrendingUp color="inherit"/> : <TrendingDown color="error"/>}></Tab>
				<Tab label="Stats" icon={<BubbleChart />}></Tab>
				<Tab label="Orders" icon={<InsertFile />}></Tab>
				<Tab label="Logs" icon={<InsertLogs />}></Tab>
				<Tab label="Swing" icon={<AutoRenew />} onClick={()=>{this.updateSwingPrice()}}></Tab>
				<Tab label="Settings" icon={<InsertSettings />}></Tab>   
			</Tabs>
			</AppBar>	
			<div className="body">   
			{this.state.tabValue === 0 && <TabContainer>
			 <BinanceState 
				style={{height:this.state.chartSize.height, width: this.state.chartSize.width}}
				gauge={this.state.binanceGauge}
				binancePairs={this.state.binancePairs} 
				binanceStatusTime={this.state.binanceStatusTime} 
				binanceStatus={this.state.binanceStatus} 
				forceMonitorBinance = {this.forceMonitorBinance}
				tradingPairs = {this.state.tradingPairs.binance}
				balance = {this.state.balance.binance}
				binanceProgress = {this.state.binanceProgress}
				binanceB1Minimum = {this.state.binanceB1Minimum}
				updateBinanceB1Minimum = {this.updateBinanceB1Minimum}
				binanceC1Minimum = {this.state.binanceC1Minimum}
				updateBinanceC1Minimum ={this.updateBinanceC1Minimum}
				/>	
			</TabContainer>}
						
			  
			{
			this.state.tabValue === 1 && <TabContainer>
				<div className="graph">
				<BittrexState 
					balance={this.state.balance.bittrex}
					bittrexStatus={this.state.bittrexStatus}
					bookData={this.state.bittrexBook}
					forceMonitorBittrex={this.forceMonitorBittrex}
					gauge={this.state.bittrexGauge}
					percentage1={this.state.percentage1}
					percentage2={this.state.percentage2}
					progress={this.state.bittrexProgress * 100/3}
					style={{height: this.state.chartSize.height, width: this.state.chartSize.width}}
					time={this.state.bittrexStatusTime}
					viewBook = {this.state.viewBittrexBook}
					toggleBook={this.forceBittrexView}
					tradingPairs={this.state.tradingPairs}
					updatePercentage1={this.updatePercentage1}
					updatePercentage2={this.updatePercentage2}
				/>	  			
				</div>	
			</TabContainer>
			}
			
			{this.state.tabValue === 2 && <TabContainer>
			    <Button variant="raised" color="primary" onClick={this.getBittrexDBTrade}>Generate Trading Statistics</Button>
			    
			    <h3>Bittrex</h3>
			    <BittrexProfit profit={this.state.bittrexProfit} balance={this.state.balance.bittrex} tradingPairs={this.state.tradingPairs}/>
			    <BittrexChart style={{height: this.state.chartSize.height, width: this.state.chartSize.width}} data={this.state.dbTrade} scatterList={this.state.dbScatterBittrex}/>		
				
				<h3>Binance</h3>  
				<BinanceProfit profit={this.state.binanceProfit} balance={this.state.balance.binance}/>
				<BinanceCharts lineList={this.state.dbTradeBinance} scatterList={this.state.dbScatter} chartSize={this.state.chartSize} />			
		
			</TabContainer>}
			{this.state.tabValue === 3 && <TabContainer>
				<Button variant="raised" color="primary" onClick={this.clearOrders}>Clear Cache</Button>
				<Button variant="raised" color="primary" onClick={this.getOrders}>Retrieve Orders</Button>
				<Orders orders={this.state.orders} />	
			</TabContainer>}
			{this.state.tabValue === 4 && <TabContainer>
				<Log text={this.state.log} />	
			</TabContainer>}
			{this.state.tabValue === 5 && <TabContainer>
				{
				this.state.swingOrder.order ?	
				<div>						
				<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
			        <CardContent>
			           <Typography type="headline">Previous Trade</Typography>
						<Typography component="p">
						{this.state.swingOrder.order.Type} {this.state.swingOrder.order.Exchange}
						<br/>{this.state.swingOrder.order.Quantity} @ {this.state.swingOrder.order.Limit}
						<br/>Created:{this.state.swingOrder.order.Opened}
						<br/>{this.state.swingOrder.order.OrderUuid}
						</Typography>
						<LinearProgress variant="determinate" value={ this.state.swingOrder.order.QuantityRemaining >= 0? ((this.state.swingOrder.order.Quantity-this.state.swingOrder.order.QuantityRemaining)/this.state.swingOrder.order.Quantity)*100 : 0} />					
						{ this.state.swingOrder.order.QuantityRemaining >= 0? (((this.state.swingOrder.order.Quantity-this.state.swingOrder.order.QuantityRemaining)/this.state.swingOrder.order.Quantity)*100).toFixed(2) +'% Filled' : '0% Filled'}
			        
			        </CardContent>
			      </Card>
			      <Chart
		          chartType="Gauge"
		          data={[['Label','Value'], ['Percentage',Number(this.state.swingGauge)]]}
		          options={{
						min:99.61,
						max:100.39,
						yellowFrom:99.61,
						yellowTo:99.70,
						redFrom:100.3,
						redTo:100.39
					}}
		          graph_id="GaugeChart"
		          width="100%"
		          height="40vh"
		          legend_toggle
		        />
				<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
					{this.state.swingOrder.order && <CardContent>
						<Typography type="headline">Next Trade</Typography>
						{this.state.swingOrder.order.Type === "LIMIT_SELL" ? "LIMIT_BUY" : "LIMIT_SELL"} {this.state.swingOrder.order.Exchange}
						<br/>{this.state.swingOrder.order.Quantity} @ {this.state.swingOrder.order.Type === "LIMIT_SELL" ? this.state.swingOrder.order.Limit * (1-(this.state.swingPercentage/100)) : this.state.swingOrder.order.Limit * (1+(this.state.swingPercentage/100))}
					</CardContent>}
				</Card>
				</div>
				: ""}
			</TabContainer>}
			{this.state.tabValue === 6 && <TabContainer>		
				<Config 
				autosave = {this.state.autosave}
				_autosave = {this.autosave}
				autoconnect = {this.state.autoconnect}
				begin = {this.begin}
				cleared = {this.state.cleared}
				clearData = {this.clearData}
				end = {this.end}
				connected = {this.state.connected}
				privatekey = {this.state.privatekey}
				setStartup = {this.setStartup}
				updatePkey = {this.updatePkey}
				toastNotify = {this.state.toastNotify}
				_toastNotify = {this.toastNotify}
				websocketNetwork = {this.state.websocketNetwork}
				webNotify = {this.state.webNotify}
				_webNotify = {this.webNotify}
				updateNetwork = {this.updateNetwork}
				port={this.state.port} 
				updatePort={this.updatePort}
				/>
				<ExchangeConfig 
					controlBittrex = {this.controlBittrex}
					liquidTrades = {this.state.liquidTrades}
					updateLiquidTrade = {this.updateLiquidTrade}
					lowerLimit = {this.state.lowerLimit} 
					updateLowerLimit = {this.updateLowerLimit}
					upperLimit = {this.state.upperLimit} 
					updateUpperLimit = {this.updateUpperLimit}
					swingPercentage = {this.state.swingPercentage} 
					updateSwingPercentage = {this.updateSwingPercentage}
					loadingBittrexSocket = {this.state.loadingBittrexSocket}
					bittrexSocketStatus = {this.state.bittrexSocketStatus}
					sanity = {this.state.sanity}
					updateSanity = {this.updateSanity}
					swingPollingRate = {this.state.swingPollingRate}
					swingTrade = {this.state.swingTrade}
					swing_reset = {this.swing_reset}
					updateSwingTrade = {this.updateSwingTrade}
					updateSwingPollingRate = {this.updateSwingPollingRate}
					viewBittrexBook = {this.state.viewBittrexBook}
					forceBittrexView = {this.forceBittrexView}
	
					loadingBinanceSocket = {this.state.loadingBinanceSocket}
					liquidTradesBinance = {this.state.liquidTradesBinance}
					updateLiquidTradeBinance = {this.updateLiquidTradeBinance}
					binanceConnections = {this.state.binanceConnections}
					connected = {this.state.connected}
					controlBinance = {this.controlBinance}
					binancePairs = {this.state.binancePairs}
					binanceOptimalTrades = {this.state.binanceOptimalTrades}
					binanceB1Minimum = {this.state.binanceB1Minimum}
					updateBinanceB1Minimum = {this.updateBinanceB1Minimum}
					binanceC1Minimum = {this.state.binanceC1Minimum}
					binanceLimits = {this.state.binanceLimits}
					updateBinanceC1Minimum = {this.updateBinanceC1Minimum}
					updateBinanceLimits = {this.updateBinanceLimits}
					updateBinanceOptimalTrades = {this.updateBinanceOptimalTrades}
				/>		    				  
				<GeneralBalance title="Bittrex Balances" balance={this.state.balance.bittrex} update={this.updateBittrexBalance} />			
				<GeneralBalance title="Binance Balances" balance={this.state.balance.binance} update={this.updateBinanceBalance} />			
				<footer>
					<div>
						MaterialUI theme provided by <a href='https://github.com/callemall/material-ui/tree/v1-beta'>Material-UI</a>
					</div>
				    <div>Favicon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></div>
				</footer> 				
			</TabContainer>}   
			</div>	
			<PMenu click={this.connect} previous={this.state.previous}/>  
			<Snackbar
			  anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			  }}
			  open={this.state.toast.open}
			  autoHideDuration={2000}
			  SnackbarContentProps={{'aria-describedby': 'message-id',}}
			  message={<span id="message-id">{this.state.toast.message}</span>}
			/>
		  </div>
		);
	}
}

export default App;
