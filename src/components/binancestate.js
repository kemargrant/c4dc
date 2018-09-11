import ArbProgress from './arbprogress';
import ArbToggle from './arbtoggle';
import MovingLine from './movingline';
import Input from '@material-ui/core/Input';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

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
		const inputStyle ={width:"4.5em"}
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
				<td> <Input style={inputStyle} type="number" inputProps={{min: "0",step: "0.000001"}} id={pair1.replace("_","")} value={this.props.binanceB1Minimum[pair1.replace("_","")]} onChange={this.props.updateBinanceB1Minimum} /> </td>
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
				<td> <Input style={inputStyle} type="number" inputProps={{min: "0",step: "0.001"}} id={pair1.replace("_","")} value={this.props.binanceC1Minimum[pair1.replace("_","")]} onChange={this.props.updateBinanceC1Minimum} /> </td>
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
				<MovingLine gauge={this.props.gauge} height={180}/>
				{this.info()}
			</div>)
	}	
}	

export default BinanceState;
