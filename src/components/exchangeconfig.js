import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';						
							
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

export default ExchangeConfig;
