import React, { Component } from 'react';
import './App.css';
import AES from "crypto-js/aes";
import Enc from 'crypto-js/enc-utf8';
import Typography from 'material-ui/Typography';
import AppBar  from 'material-ui/AppBar';
import AutoRenew from 'material-ui-icons/Autorenew';
import Button from 'material-ui/Button';
import BubbleChart from 'material-ui-icons/BubbleChart';
import Card, { CardActions, CardContent,CardHeader } from 'material-ui/Card';
import { FormControl,FormControlLabel, FormGroup } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel } from 'material-ui/Input';
import InsertSettings from 'material-ui-icons/Settings';
import InsertFile from 'material-ui-icons/ShopTwo';
import InsertLogs from 'material-ui-icons/LibraryBooks';
import {LinearProgress } from 'material-ui/Progress';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Snackbar from 'material-ui/Snackbar';
import Switch from 'material-ui/Switch';
import Table,{TableBody,TableCell,TableHead,TableRow} from 'material-ui/Table';
import Tabs, {Tab} from 'material-ui/Tabs';
import TrendingDown from 'material-ui-icons/TrendingDown';
import TrendingUp from 'material-ui-icons/TrendingUp';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';


			
function TabContainer(props) {
	return <div style={{ padding: 1 * 3 }}>{props.children}</div>;
}
			
class App extends Component{
	constructor(props){
	    super(props);
	    this.state = {
			anch_menu:null,
			autoconnect: window.localStorage && window.localStorage.getItem("AutoConnect") ? JSON.parse(window.localStorage.getItem("AutoConnect")) : false,
			autosave: window.localStorage && JSON.parse(window.localStorage.getItem("Autosave")) ? true : false,
			balance: window.localStorage && JSON.parse(window.localStorage.getItem("Bittrex_Balance")) ? JSON.parse(window.localStorage.getItem("Bittrex_Balance")):{binance:{account:"Binance"},bittrex:{account:"Bittrex"}},
			binanceB1Minimum:{},
			binanceC1Minimum:{},
			binanceConnections:0,
			binanceGauge:{
				tooltip : {
					formatter: "{c}"
				},
				title : {
						text:"Binance Meter",
						show:false,
		            },				
				series:[{
						axisLine:{
							lineStyle:{
								width:document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth *0.9/120 : 100/12,
							}
						},
						splitLine: {          
			                length:document.documentElement.clientHeight > 0 ? (document.documentElement.clientHeight/1.9)/15 : 500/15,      
			                lineStyle: {
			                    color: 'gold'
			                }
			            },
						radius:"90%",
						name:"Percent",
						type: 'gauge',
						splitNumber: 16,
						min: 99.61,
						max:100.39,
						detail:{
			                formatter:"{value}",
			                textBorderColor: 'white',
			                fontFamily: 'Roboto',
			                fontSize:15,
			                width: 100,
			                color: 'black',
			            },
						data: [{value: 0, name: "Percent"}]
					}]
			},
			bittrexGauge:{
				tooltip : {
					formatter: "{c}"
				},
				title : {
						text:"Bittrex Meter",
						show:false,
		            },				
				series:[{
						axisLine:{
							lineStyle:{
								width:document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth *0.9/120 : 100/12,
							}
						},
						splitLine: {          
			                length:document.documentElement.clientHeight > 0 ? (document.documentElement.clientHeight/1.9)/15 : 500/15,      
			                lineStyle: {
			                    color: 'blue'
			                }
			            },
						radius:"90%",
						name:"Percent",
						type: 'gauge',
						splitNumber: 16,
						min: 98.8,
						max:101.2,
						detail:{
			                formatter:"{value}",
			                textBorderColor: 'aliceblue',
			                fontFamily: 'Roboto',
			                fontSize:15,
			                width: 100,
			                color: 'black',
			            },
						data: [{value: 0, name: "Percent"}]
					}]
			},			
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
			dbTrade: window.localStorage && JSON.parse(window.localStorage.getItem("DB_Trade"))? JSON.parse(window.localStorage.getItem("DB_Trade")) : {
				xAxis:{type:'time'},
				yAxis:{type:'value'}
			},
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
			log:"",
			logLevel:0,
			lowerLimit:89,
			menuAnchor: null,
			menu_open:false,
			orders: window.localStorage && JSON.parse(window.localStorage.getItem("Orders"))? JSON.parse(window.localStorage.getItem("Orders")):[],
			previous: window.localStorage && JSON.parse(window.localStorage.getItem("Previous_Connections"))? JSON.parse(window.localStorage.getItem("Previous_Connections")) : [],
			percentage1:null,
			percentage2:null,
			pollingRate:0,
			port:7071,
			privatekey: window.localStorage && window.localStorage.getItem("xxpkeyxx") ? window.localStorage.getItem("xxpkeyxx"): "",
			sanity:true,
			socketMessage:function(){},
			scatterOption:{
				animation:true,
				animationDuration:5000,
				backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
			        offset: 0,
			        color: '#f7f8fa'
			    }, {
			        offset: 1,
			        color: '#cdd0d5'
			    }]),
			    title:{
					top:'5%',
					left:"20%",
					text:'Percentage vs Time',
					textStyle:{
						fontSize: window.innerHeight > window.innerWidth ? (window.innerHeight/window.innerWidth*12) :  (window.innerWidth*13/window.innerHeight)
					}
				},
			    legend: {
					textStyle:{
						color:'black'
					},
					data:['<100%','>100%']
	            },			
	            tooltip:{
	                trigger: 'axis', 
	                formatter: function (param) {
						param = param[0];
						return "Time:"+param.data[0]+' <br/> Percent:'+param.data[1];
					},      
	            },
	            grid: {
	                containLabel: true,
	            },
	            xAxis:{
					type : 'value',
					name:'Time',
					nameGap:30,
					nameTextStyle:{
						fontSize:15,
					},
					nameLocation:'middle',
					 splitLine: {
			            lineStyle: {
			                type: 'dashed',
			                color:'black'
			            }
			        }
	            },
	            yAxis:{
					name:'Percent',
					nameGap:50,
					nameLocation:'middle',
					nameTextStyle:{
						fontSize:15,
					},
					scale:'true',
					type: 'value',
					splitLine: {
			            lineStyle: {
			                type: 'dashed',
			                color:'black'
			            }
			        }
	            }
	            ,
	            series:[
	                {
					
	                    name:'>100%',
	                    type:'scatter',
	                    data:[0,0],
	                    symbolSize: function (data) {
						    var size = Math.sqrt(data[0]) * Math.sqrt(data[1]);
				            return size;
				        },
	                },
	                {
					
	                    name:'<100%',
	                    type:'scatter',
	                    data:[0,0],
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
			tradeInfo:undefined,
			upperLimit:101.79,
			webNotify: window.localStorage && JSON.parse(window.localStorage.getItem("Web_Notify")) ? true : false,
			websocketNetwork:"localhost",
			viewBittrexBook:false
		}
		this.changeTab = this.changeTab.bind(this);	
		this.clearData = this.clearData.bind(this);
		this.clearOrders = this.clearOrders.bind(this);
		this.connect = this.connect.bind(this);	
		this.controlBinance = this.controlBinance.bind(this);			
		this.controlBittrex = this.controlBittrex.bind(this);			
		this.forceBittrexView = this.forceBittrexView.bind(this);
		this.getBittrexDBTrade = this.getBittrexDBTrade.bind(this);
		this.getOrders = this.getOrders.bind(this);
		this.getPollingRate = this.getPollingRate.bind(this);
		this.menuClose = this.menuClose.bind(this);
		this.menuOpen = this.menuOpen.bind(this);
		this.swing_reset = this.swing_reset.bind(this);
		this.updateBinanceBalance = this.updateBinanceBalance.bind(this);	
		this.updateBinanceB1Minimum = this.updateBinanceB1Minimum.bind(this);	
		this.updateBinanceC1Minimum = this.updateBinanceC1Minimum.bind(this);	
		this.updateBittrexBalance = this.updateBittrexBalance.bind(this);
		this.updateLiquidTrade = this.updateLiquidTrade.bind(this);
		this.updateLiquidTradeBinance = this.updateLiquidTradeBinance.bind(this);
		this.updateLogLevel = this.updateLogLevel.bind(this);
		this.updateLowerLimit = this.updateLowerLimit.bind(this);
		this.updateNetwork = this.updateNetwork.bind(this);
		this.updatePkey = this.updatePkey.bind(this);	
		this.updatePercentage1 = this.updatePercentage1.bind(this);	
		this.updatePercentage2 = this.updatePercentage2.bind(this);	
		this.updatePollingRate = this.updatePollingRate.bind(this);	
		this.updatePort = this.updatePort.bind(this);	
		this.updateSanity = this.updateSanity.bind(this);	
		this.updateSwingPercentage = this.updateSwingPercentage.bind(this);	
		this.updateSwingPollingRate = this.updateSwingPollingRate.bind(this);	
		this.updateSwingTrade = this.updateSwingTrade.bind(this);	
		this.updateUpperLimit = this.updateUpperLimit.bind(this);
	}
	autosave(checked){
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
		let list = ["AutoConnect","Autosave","Bittrex_Balance","Binance_Profit","Bittrex_Profit","DB_Scatter_TradeBinance","DB_TradeBinance","Orders","Previous_Connections","Toast_Notify","Trading_Pairs","Web_Notify","xxpkeyxx"];
		for(let i=0;i< list.length;i++){
			window.localStorage.removeItem(list[i]);
		}
		return this.setState({autosave:false});
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
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"binance_control","bool":checked}),this.state.privatekey).toString());
	}				
					
	controlBittrex(evt,checked){
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
		catch(e){this.toast(e)}
		if(data.type === "alert"){
			this.toast(data.alert);
			return this.getPollingRate();
		}
		
		if(data.type === "balance"){
			return this.setState({balance:{bittrex:data.balance,binance:this.state.balance.binance}},()=>{
				if(this.state.autosave){
					window.localStorage.setItem("Bittrex_Balance",JSON.stringify(this.state.balance));
				}
				if(data.polling){
					this.setState({pollingRate:data.polling});
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
			let gauge = this.state.binanceGauge;
			gauge.series[0].data = [{value:data.percentage.toFixed(4),name:"%"}];
			for(let key in data.info){
				for(let i = 0;i < this.state.binancePairs.length;i++){
					if(this.state.binancePairs[i].pair1 === key){
						_binance[key] = {}
						_binance[key]['pairs'] = [this.state.binancePairs[i].pair1,this.state.binancePairs[i].pair2,this.state.binancePairs[i].pair3]
						_binance[key][this.state.binancePairs[i].pair1] = data.info[key][_type].a;
						_binance[key][this.state.binancePairs[i].pair2] = data.info[key][_type].b;
						_binance[key][this.state.binancePairs[i].pair3] = data.info[key][_type].c;
						break;
					}
				}
			}
			let _tradingPairs = {bittrex:this.state.tradingPairs.bittrex,binance:_binance,misc:this.state.tradingPairs.misc}
			return this.setState({binanceGauge:gauge,tradingPairs:_tradingPairs});
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
			return this.setState({binanceStatus:data.value,binanceConnections:data.connections,binanceProgress:_binanceProgress,binanceStatusTime:data.time,binanceUserStreamStatus:data.ustream});
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
			return this.setState({bittrexStatus:data.value,bittrexProgress:_bittrexProgress,bittrexStatusTime:data.time,bittrexSocketStatus:data.wsStatus});
		}
		
		if(data.type === "config"){
			return this.setState({viewBittrexBook:data.viewBook,logLevel:data.logLevel,swingPollingRate:data.swingRate,sanity:data.sanity,liquidTrades:data.liquid,upperLimit:data.upperLimit,lowerLimit:data.lowerLimit,swingTrade:data.vibrate,swingPercentage:data.swingPercentage * 100,bittrexStatus:data.status,bittrexStatusTime:data.time,bittrexSocketStatus:data.wsStatus});
		}

		if(data.type === "configBinance"){
			let _binance = {}
			let _tradingPairs;
			let _progress = {}
			for(let i = 0;i < data.pairs.length;i++){
					_binance[data.pairs[i].pair1] = {}
					_progress[data.pairs[i].pair1] = 0;
					_binance[data.pairs[i].pair1]['pairs'] = [data.pairs[i].pair1,data.pairs[i].pair2,data.pairs[i].pair3]
					_binance[data.pairs[i].pair1][data.pairs[i].pair1] = 0;
					_binance[data.pairs[i].pair1][data.pairs[i].pair2] = 0;
					_binance[data.pairs[i].pair1][data.pairs[i].pair3] = 0;
			}
			_tradingPairs = {bittrex:this.state.tradingPairs.bittrex,binance:_binance,misc:this.state.tradingPairs.misc}
			return this.setState({balance:{bittrex:this.state.balance.bittrex,binance:data.balance},liquidTradesBinance:data.liquid,binanceConnections:data.connections,binanceStatus:data.status,binancePairs:data.pairs,binanceProgress:_progress,binanceStatusTime:data.time,binanceUserStreamStatus:data.ustream,binanceB1Minimum:data.minB1,binanceC1Minimum:data.minXXX,tradingPairs:_tradingPairs});
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
			let _binanceProfit = {}
			let _bittrexProfit = {}
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
				_binanceProfit[msc2[i]] = {}
				_binanceScatter[msc2[i]] = {'>100%':[],'<100%':[]}
				date2[msc2[i]] = {}
				b12[msc2[i]] = []
				v2[msc2[i]] = []
				_msc2[msc2[i]] = []
				dat2[msc2[i]] = {}
				b1Count2[msc2[i]] = {};
				_mscCount2[msc2[i]] = {};
				//b1
				_binanceProfit[msc2[i]][msc2[i].slice(3,msc2[i].length)] = 0;
				//mc2
				_binanceProfit[msc2[i]][msc2[i].slice(0,3)] = 0;
				//u1
				_binanceProfit[msc2[i]][this.state.tradingPairs.binance[msc2[i]].pairs[1].slice(3)] = 0;
			}			
			_bittrexProfit[_b1] = 0;
			_bittrexProfit[msc.toLowerCase()] = 0;
			for(let k=0;k<data.info.length;k++){
				if(data.info[k].Exchange !== "Binance"){
					date = new Date(data.info[k].Time).toISOString().split("T")[0];
					if(dat[date]){
						dat[date]++;
					}
					else{
						dat[date]=1;
					}
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
				else{
					try{
						if(!data.info[k].Pair){
							data.info[k].Pair = msc2[0];
						}
						date2[data.info[k].Pair] = new Date(data.info[k].Time).toISOString().split("T")[0];
						if(dat2[data.info[k].Pair][date2[data.info[k].Pair]]){
							dat2[data.info[k].Pair][date2[data.info[k].Pair]]++;
						}
						else{
							dat2[data.info[k].Pair][date2[data.info[k].Pair]] = 1;
						}
						if(data.info[k].Percent > 100){
							//Scatter Data
							if(data.info[k].Completed){
								_binanceScatter[data.info[k].Pair]['>100%'].push([(data.info[k].Completed - data.info[k].Time)/60000,Number(data.info[k].Percent.toFixed(3))])
							}
							//
							_binanceProfit[data.info[k].Pair][data.info[k].Pair.slice(3,data.info[k].Pair.length)] += data.info[k].Profit;
							if(data.info[k].Profit2){
								_binanceProfit[data.info[k].Pair][data.info[k].Pair.slice(0,3)] += data.info[k].Profit2;
							}
							if(data.info[k].Profit3){
								_binanceProfit[data.info[k].Pair][this.state.tradingPairs.binance[data.info[k].Pair].pairs[1].slice(3)] += data.info[k].Profit3;
							}
							if(b1Count2[data.info[k].Pair][date2[data.info[k].Pair]]){
								b1Count2[data.info[k].Pair][date2[data.info[k].Pair]]++;
							}
							else{
								b1Count2[data.info[k].Pair][date2[data.info[k].Pair]] = 1;
							}
						}
						else{
							//Scatter Data
							if(data.info[k].Completed){
								_binanceScatter[data.info[k].Pair]['<100%'].push([(data.info[k].Completed - data.info[k].Time)/60000,Number(data.info[k].Percent.toFixed(3))])
							}
							//
							if(data.info[k].Profit2){
								_binanceProfit[data.info[k].Pair][data.info[k].Pair.slice(3,data.info[k].Pair.length)] += data.info[k].Profit2;
							}
							if(data.info[k].Profit3){
								_binanceProfit[data.info[k].Pair][this.state.tradingPairs.binance[data.info[k].Pair].pairs[1].slice(3)] += data.info[k].Profit3;
							}
							_binanceProfit[data.info[k].Pair][data.info[k].Pair.slice(0,3)] += data.info[k].Profit;
							if(_mscCount2[data.info[k].Pair][date2[data.info[k].Pair]]){
								_mscCount2[data.info[k].Pair][date2[data.info[k].Pair]]++;
							}
							else{
								_mscCount2[data.info[k].Pair][date2[data.info[k].Pair]] = 1;
							}
						}
					}
					catch(e){
						console.log(e)
					}
				}
			}
			for(let key in dat){
				v.push({value:[key,dat[key]],name:key});
			}
			for(let key in b1Count){
				b1.push({value:[key,b1Count[key]],name:key});
			}
			for(let key in _mscCount){
				_msc.push({value:[key,_mscCount[key]],name:key});
			}	
			for(let i = 0;i < msc2.length;i++){
				for(let key in dat2[msc2[i]]){
					v2[msc2[i]].push({value:[key,dat2[msc2[i]][key]],name:key});
				}
				for(let key in b1Count2[msc2[i]]){
					b12[msc2[i]].push({value:[key,b1Count2[msc2[i]][key]],name:key});
				}
				for(let key in _mscCount2[msc2[i]]){
					_msc2[msc2[i]].push({value:[key,_mscCount2[msc2[i]][key]],name:key});
				}		
			}	
			let option = {
					animation:true,
					animationDuration:9000,
		            dataZoom:[
				            {
				            show: true,
				            realtime: true,
				            start: 0,
				            end: 100
				        },
				    ],	
				    legend: {
						textStyle:{
							color:'black'
							},
		                data:['BTC Profitable','Total',msc+' Profitable']
		            },			
		            title:{
						textStyle:{fontSize:15},
						text:"Trades",
						top:'3%',
						left:"30%"
					},
		            tooltip:{
		                trigger: 'axis',
						formatter: function(params){
							params = params[0];
							return params.name.split("GMT")[0]+ '/' + params.value[1].toFixed(2);
						},            
		            },
		            grid: {
						top:'8%',
		                left: '3%',
		                right: '3%',
		                bottom: '15%',
		                containLabel: true
		            },
		            xAxis:[
						{
		                    type : 'time',
		                    splitLine:{
								show: true,
								lineStyle:{
									type:'dashed',
									width:1
								}
							},					
		                }
		            ],
		            yAxis:[
						{
							min:0,
							max:"dataMax",
		                    type : 'value',
		                }
		            ],
		            series:[
		                {
						
		                    name:'Total',
		                    type:'line',
		                    smooth:'true',
		                    data:v,
		                },
		                {
							
		                    name:'BTC Profitable',
		                    type:'line',
		                    smooth:'true',
		                    data:b1,
		                },
		                {
						
		                    name:msc+' Profitable',
		                    type:'line',
		                    smooth:'true',
		                    data:_msc,
		                },
		            ]
		        }	
		    let option2 = [];
		    let scatterOption2 = [];
		    let _scatterOption2;
		    let _option2;
		    for(let i = 0;i < msc2.length;i++){
				_option2 = JSON.parse(JSON.stringify(option));
				_option2.legend.data = ['Total',msc2[i].slice(3,msc2[i].length).toUpperCase()+' Profitable',msc2[i].slice(0,3).toUpperCase()+' Profitable'];
			    _option2.series[0].data = v2[msc2[i]];
			    _option2.series[1].data = b12[msc2[i]];
			    _option2.series[1].name = msc2[i].slice(3,msc2[i].length).toUpperCase()+' Profitable';
			    _option2.series[2].data = _msc2[msc2[i]];
			    _option2.series[2].name = msc2[i].slice(0,3).toUpperCase() + ' Profitable';
			    _option2.key = msc2[i];
			    option2.push(_option2);
			    //Scatter Data
			    _scatterOption2 = this.state.scatterOption;
			    _scatterOption2.key = msc2[i];
			    _scatterOption2.title.text = msc2[i] + ":Time Completed";
			    _scatterOption2.series[0].data = _binanceScatter[msc2[i]]['>100%'];
			    _scatterOption2.series[1].data =_binanceScatter[msc2[i]]['<100%'];
			    scatterOption2.push(_scatterOption2);			    
			}
			if(this.state.autosave){
					window.localStorage.setItem("DB_Trade",JSON.stringify(option));
					window.localStorage.setItem("DB_TradeBinance",JSON.stringify(option2));
					window.localStorage.setItem("DB_Scatter_TradeBinance",JSON.stringify(scatterOption2));
					window.localStorage.setItem("Binance_Profit",JSON.stringify(_binanceProfit));
					window.localStorage.setItem("Bittrex_Profit",JSON.stringify(_bittrexProfit));
			}
			return this.setState({dbTrade:option,dbTradeBinance:option2,tradeInfo:data.info,binanceProfit:_binanceProfit,bittrexProfit:_bittrexProfit,dbScatter:scatterOption2});
		}				
		
		if(data.type === "log"){
			this.setState({log:data.log+'\r\n<----------->\r\n'+this.state.log+'\r\n'});
		}	
			
		if(data.type === "order"){
			let _new_orders = this.state.orders;
			if(data.exchange === "Binance"){
				data.image = "url('https://pbs.twimg.com/profile_banners/877807935493033984/1511522262/1500x500')";
			}
			else{
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
				if(this.state.binancePairs[j].pair1 === _pair || this.state.binancePairs[j].pair2 === _pair || this.state.binancePairs[j].pair3 ===  _pair){
					base = this.state.binancePairs[j].pair1;
					return base;
				}
				else{
					return base;
				}
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
			let _bittrexGauge = this.state.bittrexGauge;
			_bittrexGauge.series[0].data = [{value:data.percentage.toFixed(4),name:"%"}];
			if(this.state.autosave){
				window.localStorage.setItem("Trading_Pairs",JSON.stringify(_tradingPairs));
			}
			return this.setState({tradingPairs:_tradingPairs,bittrexPercentage:data.percentage,bittrexGauge:_bittrexGauge});
		}		
	
		if(data.type === "poll_rate"){
			return this.setState({pollingRate:data.polling});						
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
	
	forceMonitorBittrex(checked){
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
	
	getPollingRate(){
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"poll_rate"}),this.state.privatekey).toString());			
	}	
			
	menuOpen(evt){
		return this.setState({menuAnchor:evt.currentTarget,menu_open:true});
	}

	menuClose(){
		return this.setState({ menuAnchor: null,menu_open:false });
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
		
	updatePollingRate(evt){
		let rate = evt.currentTarget.value; 
		this.setState({pollingRate:rate * 1000});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"poll","rate":rate}),this.state.privatekey).toString());
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
			<Tabs scrollable value={this.state.tabValue} onChange={this.changeTab} centered fullWidth>	
				<Tab label="Bittrex" icon={this.state.bittrexSocketStatus && this.state.connected ? <TrendingUp color="inherit"/> : <TrendingDown color="error"/>}></Tab>
				<Tab label="Binance" icon={this.state.binanceUserStreamStatus && this.state.connected ? <TrendingUp color="inherit"/> : <TrendingDown color="error"/>}></Tab>				
				<Tab label="Stats" icon={<BubbleChart />}></Tab>
				<Tab label="Orders" icon={<InsertFile />}></Tab>
				<Tab label="Logs" icon={<InsertLogs />}></Tab>
				<Tab label="Swing" icon={<AutoRenew />} onClick={()=>{this.updateSwingPrice()}}></Tab>
				<Tab label="Settings" icon={<InsertSettings />}></Tab>   
			</Tabs>
			</AppBar>	
			<div className="body">     
			{
			this.state.tabValue === 0 && <TabContainer>
				<div className="graph">
				{
					this.state.bittrexStatusTime > 0 ?
					(<div>
					<LinearProgress variant="determinate" value={this.state.bittrexProgress * 100/3} /> 
					<Button variant="raised" color="primary">Arbitrage In Progress</Button>
					<p className="simpleText">{((new Date().getTime() - this.state.bittrexStatusTime)/60000).toFixed(2) + " Minutes Processing Arbitrage"}</p>
					 </div>) : ""
				}
				<div className="monitorToggle">
				<FormGroup>
			        <FormControlLabel
					  label={!this.state.bittrexStatus ? "Pause" : "Activate"}
					  style={{margin:"auto"}}
			          control={<Switch
				              checked={!this.state.bittrexStatus}
				              onChange={(event, checked) => {
								  this.forceMonitorBittrex(!checked)
								}}
							/>}
			        />
				</FormGroup>				
				</div>
				{
					this.state.connected ? <ReactEchartsCore
				  echarts={echarts}
				  option={this.state.bittrexGauge}
				  style={{height: this.state.chartSize.height*1.3+'px', width:'100%'}}/>
				  : <div style={{width:"100%",height:this.state.chartSize.height*1.3+"px"}}></div>
				  }					
				<FormGroup>
			        <FormControlLabel
					  label={this.state.viewBittrexBook ? "Close OrderBook" : "Open OrderBook"}
					  style={{margin:"auto"}}
			          control={<Switch
				              checked={this.state.viewBittrexBook}
				              onChange={ this.forceBittrexView}
							/>}
			        />
				</FormGroup>
				{
					this.state.viewBittrexBook ? 
					<div className="orderBooks">
					<table className="myTable">
					<tbody>
					  <tr className="stripeTable">
					    <th>Amount</th> 		
					    <th>Bids <br/> {Object.keys(this.state.bittrexBook)[0].toLowerCase()} </th>	    
					  </tr>
						{
							this.state.bittrexBook[Object.keys(this.state.bittrexBook)[0]]["Sorted"] && this.state.bittrexBook[Object.keys(this.state.bittrexBook)[0]]["Sorted"][1].map((order) => (
							<tr key={Math.random(0,1)}>
								<td className="stripeTable">{Number(this.state.bittrexBook[Object.keys(this.state.bittrexBook)[0]]["Bids"][order]).toFixed(3)}</td>
								<td className="stripeTable">{Number(order).toFixed(7)}</td>
							</tr>
							))
						}
					</tbody>
					</table>
					<table className="myTable">
					<tbody>
					  <tr className="stripeTable">
					    <th>Asks <br/> {Object.keys(this.state.bittrexBook)[0].toLowerCase()} </th>
					    <th>Amount</th> 			    
					  </tr>
						{
							this.state.bittrexBook[Object.keys(this.state.bittrexBook)[0]]["Sorted"] && this.state.bittrexBook[Object.keys(this.state.bittrexBook)[0]]["Sorted"][0].map((order) => (
							<tr key={Math.random(0,1)}>
								<td className="stripeTable">{Number(order).toFixed(7)}</td>
								<td className="stripeTable">{Number(this.state.bittrexBook[Object.keys(this.state.bittrexBook)[0]]["Asks"][order]).toFixed(3)}</td>
							</tr>
							))
						}
					</tbody>
					</table>
					<table className="myTable">
					<tbody>
					  <tr className="stripeTable">
					    <th>Amount</th> 		
					    <th>Bids <br/> {Object.keys(this.state.bittrexBook)[1].toLowerCase()} </th>	    
					  </tr>
						{
							this.state.bittrexBook[Object.keys(this.state.bittrexBook)[1]]["Sorted"] && this.state.bittrexBook[Object.keys(this.state.bittrexBook)[1]]["Sorted"][1].map((order) => (
							<tr key={Math.random(0,1)}>
								<td className="stripeTable">{Number(this.state.bittrexBook[Object.keys(this.state.bittrexBook)[1]]["Bids"][order]).toFixed(4)}</td>
								<td className="stripeTable">{Number(order).toFixed(2)}</td>
							</tr>
							))
						}
					</tbody>
					</table>
					<table className="myTable">
					<tbody>
					  <tr className="stripeTable">
					    <th>Asks <br/> {Object.keys(this.state.bittrexBook)[1].toLowerCase()} </th>
					    <th>Amount</th> 			    
					  </tr>
						{
							this.state.bittrexBook[Object.keys(this.state.bittrexBook)[1]]["Sorted"] && this.state.bittrexBook[Object.keys(this.state.bittrexBook)[1]]["Sorted"][0].map((order) => (
							<tr key={Math.random(0,1)}>
								<td className="stripeTable">{Number(order).toFixed(2)}</td>
								<td className="stripeTable">{Number(this.state.bittrexBook[Object.keys(this.state.bittrexBook)[1]]["Asks"][order]).toFixed(4)}</td>
							</tr>
							))
						}
					</tbody>
					</table>
					<table className="myTable">
					<tbody>
					  <tr className="stripeTable">
					    <th>Amount</th> 		
					    <th>Bids <br/> {Object.keys(this.state.bittrexBook)[2].toLowerCase()} </th>	    
					  </tr>
						{
							this.state.bittrexBook[Object.keys(this.state.bittrexBook)[2]]["Sorted"] && this.state.bittrexBook[Object.keys(this.state.bittrexBook)[2]]["Sorted"][1].map((order) => (
							<tr key={Math.random(0,1)}>
								<td className="stripeTable">{Number(this.state.bittrexBook[Object.keys(this.state.bittrexBook)[2]]["Bids"][order]).toFixed(4)}</td>
								<td className="stripeTable">{Number(order).toFixed(2)}</td>
							</tr>
							))
						}
					</tbody>
					</table>
					<table className="myTable">
					<tbody>
					  <tr className="stripeTable">
					    <th>Asks <br/> {Object.keys(this.state.bittrexBook)[2].toLowerCase()} </th>
					    <th>Amount</th> 			    
					  </tr>
						{
							this.state.bittrexBook[Object.keys(this.state.bittrexBook)[2]]["Sorted"] && this.state.bittrexBook[Object.keys(this.state.bittrexBook)[2]]["Sorted"][0].map((order) => (
							<tr key={Math.random(0,1)}>
								<td className="stripeTable">{Number(order).toFixed(2)}</td>
								<td className="stripeTable">{Number(this.state.bittrexBook[Object.keys(this.state.bittrexBook)[2]]["Asks"][order]).toFixed(4)}</td>
							</tr>
							))
						}
					</tbody>
					</table>
					</div>		
					:""
				}		
				</div>
				<Table>
				<TableHead>
					<TableRow>
						<th data-field="">Asset</th>
						<th data-field="">Balance</th>
						<th data-field="">{this.state.tradingPairs.misc ? this.state.tradingPairs.misc.toUpperCase() : ""}/Ratio</th>
						<th data-field="">BTC/Ratio</th>
						<th data-field="">&#8224;BTC</th>
						<th data-field="">&#8224;USDT</th>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<td>{this.state.tradingPairs.misc ? this.state.tradingPairs.misc.toUpperCase() : ""}</td>	
						<td>{this.state.balance.bittrex[this.state.tradingPairs.misc]}</td>	
						<td>100%</td>				
						<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] * this.state.balance.bittrex[this.state.tradingPairs.misc]*100/this.state.balance.bittrex.btc).toFixed(2)+'%' : ""}</td>
						<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc].toFixed(7) : ""}</td>
						<td>{this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] ? this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc].toFixed(1) : ""}</td>
					</TableRow>
					<TableRow>
						<td>BTC</td>	
						<td>{this.state.balance.bittrex.btc}</td>
						<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex.btc/this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] *100/this.state.balance.bittrex[this.state.tradingPairs.misc]).toFixed(2)+'%' : ""}</td>
						<td>100%</td>
						<td>1</td>
						<td>{this.state.tradingPairs.bittrex.usdt_btc ? this.state.tradingPairs.bittrex.usdt_btc.toFixed(1) : "" }</td>
					</TableRow>
					<TableRow>
						<td>USDT</td>
						<td>{this.state.balance.bittrex.usdt ? this.state.balance.bittrex.usdt.toFixed(7) : 0}</td>
						<td>{this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] ? (100*((this.state.balance.bittrex.usdt/this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc])/this.state.balance.bittrex[this.state.tradingPairs.misc])).toFixed(2)+ '%' : ""}</td>
						<td>{this.state.tradingPairs.bittrex.usdt_btc ? (100*((this.state.balance.bittrex.usdt/this.state.tradingPairs.bittrex.usdt_btc)/this.state.balance.bittrex.btc)).toFixed(2)+ '%' : ""}</td>						
						<td>{this.state.tradingPairs.bittrex.usdt_btc ? (1/this.state.tradingPairs.bittrex.usdt_btc).toFixed(7) : "" }</td>
						<td>1</td>
					</TableRow>										
				</TableBody>
				</Table> 
				<Table>
				<TableHead>
					<TableRow>
						<th data-field="">Trade</th>
						<th data-field="">%</th>
						<th data-field="">{this.state.tradingPairs.misc ? this.state.tradingPairs.misc.toUpperCase() : ""}</th>
						<th data-field="">BTC</th>
						<th data-field="">USDT</th>
						<th data-field="">Status</th>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<td>{this.state.tradingPairs.misc ? this.state.tradingPairs.misc.toUpperCase() : ""}</td>
						<td className="td_input"> <Input type="number" step={1} max={100} min={0} value={this.state.percentage1 * 100} onChange={this.updatePercentage1} /> </td>
						<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1).toFixed(5) : 0}</td>
						<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 *  this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] ? (this.state.tradingPairs.bittrex.usdt_btc * this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 *  this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{(this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 * this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) > 0.002 && (this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1) < this.state.balance.bittrex[this.state.tradingPairs.misc] && (this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 *  this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.btc && (this.state.tradingPairs.bittrex.usdt_btc * this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 *  this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.usdt? <Switch checked={true}/> : <Switch checked={false}/>}</td>
					</TableRow>
					<TableRow>
						<td>BTC</td>
						<td  className="td_input"> <Input step={1} type="number" max={100} min={0} value={this.state.percentage2 * 100} onChange={this.updatePercentage2} /> </td>
						<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]).toFixed(5) : ""}</td>						
						<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex.btc * this.state.percentage2).toFixed(5) : 0}</td>
						<td>{this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] ? (this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] * this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]).toFixed(5) : ""}</td>
						<td>{(this.state.balance.bittrex.btc * this.state.percentage2) > 0.002 &&	(this.state.balance.bittrex.btc * this.state.percentage2) < this.state.balance.bittrex.btc && (this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex[this.state.tradingPairs.misc] && (this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] * this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.usdt ?<Switch checked={true}/> :  <Switch checked={false}/>}</td>					
					</TableRow>		
				</TableBody>
				</Table> 	
			</TabContainer>
			}
			
			{this.state.tabValue === 1 && <TabContainer>
			<ReactEchartsCore
			  echarts={echarts}
			  option={this.state.binanceGauge}
			  style={{height: this.state.chartSize.height*1.3+'px', width:'100%'}}
			   />	
			{
				(()=>{
				let p = [];
				for(let i=0;i < this.state.binancePairs.length;i++){
					p.push([this.state.binancePairs[i].pair1,[this.state.binancePairs[i].pair1,this.state.binancePairs[i].pair2,this.state.binancePairs[i].pair3]])
				}
				return p.map((Pair) => (
				<div key={Pair[0]}>
					{this.state.binanceStatusTime[Pair[0]] > 0 ? 
						(<div>
						<LinearProgress variant="determinate" value={this.state.binanceProgress[Pair[0]]*100/3} /> 
						<Button variant="raised" color="primary">Arbitrage In Progress</Button>
						<br/>
						{((new Date().getTime() - this.state.binanceStatusTime[Pair[0]])/60000).toFixed(2) + " Minutes Processing Arbitrage"} 
						</div>)
						: ""
					}
					<div className="monitorToggle">
					<FormGroup>
				        <FormControlLabel
						  label={!this.state.binanceStatus[Pair[0]] ? "Active" : "Paused"}
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={!this.state.binanceStatus[Pair[0]]}
					              onChange={(event, checked) => {
									  this.forceMonitorBinance(Pair[0],!checked)
									}}
								/>}
				        />
					</FormGroup>
					</div>
					<Table>
						<TableHead>
							<TableRow>
								<th data-field="">Asset</th>
								<th data-field="">Balance</th>
								<th data-field="">{Pair[0].slice(0,3).toUpperCase()}/Ratio</th>
								<th data-field="">{Pair[0].slice(3,Pair[0].length).toUpperCase()}/Ratio</th>
								<th data-field="">&#8224;{Pair[0].slice(3,Pair[0].length).toUpperCase()}</th>
								<th data-field="">&#8224;{Pair[1][1].slice(3,Pair[1][1].length).toUpperCase()}</th>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<td>{Pair[0].slice(0,3).toUpperCase()}</td>	
								<td>{this.state.balance.binance[Pair[0].slice(0,3)]}</td>	
								<td>100%</td>				
								<td>{this.state.tradingPairs.binance[Pair[0]] ? (this.state.tradingPairs.binance[Pair[0]][Pair[0]] * this.state.balance.binance[Pair[0].slice(0,3)]*100/this.state.balance.binance[Pair[0].slice(3,Pair[0].length)]).toFixed(2)+'%' : ""}</td>
								<td>{this.state.tradingPairs.binance[Pair[0]] ? this.state.tradingPairs.binance[Pair[0]][Pair[0]].toFixed(7) : "" }</td>
								<td>{this.state.tradingPairs.binance[Pair[0]] ? this.state.tradingPairs.binance[Pair[0]][Pair[1][2]].toFixed(1) : ""}</td>
							</TableRow>
							<TableRow>
								<td>{Pair[0].slice(3,Pair[0].length).toUpperCase()}</td>	
								<td>{this.state.tradingPairs.binance[Pair[0]] ? this.state.balance.binance[Pair[0].slice(3,Pair[0].length)] : ""}</td>
								<td>{this.state.tradingPairs.binance[Pair[0]] ? (this.state.balance.binance[Pair[0].slice(3,Pair[0].length)]/this.state.tradingPairs.binance[Pair[0]][Pair[0]] *100/this.state.balance.binance[Pair[0].slice(0,3)]).toFixed(2)+'%' : ""}</td>
								<td>100%</td>
								<td>1</td>
								<td>{this.state.tradingPairs.binance[Pair[0]] ? this.state.tradingPairs.binance[Pair[0]][Pair[1][1]].toFixed(1) : ""}</td>
							</TableRow>
							<TableRow>
								<td>{Pair[1][1].slice(3,Pair[1][1].length).toUpperCase()}</td>
								<td>{ this.state.balance.binance[Pair[1][1].slice(3,Pair[1][1].length)] ? this.state.balance.binance[Pair[1][1].slice(3,Pair[1][1].length)].toFixed(7) : 0}</td>
								<td>{this.state.tradingPairs.binance[Pair[0]] ? (100*((this.state.balance.binance[Pair[1][1].slice(3,Pair[1][1].length)]/this.state.tradingPairs.binance[Pair[0]][Pair[1][2]])/this.state.balance.binance[Pair[0].slice(0,3)])).toFixed(2)+ '%' : ""}</td>
								<td>{this.state.tradingPairs.binance[Pair[0]] ? (100*((this.state.balance.binance[Pair[1][1].slice(3,Pair[1][1].length)]/this.state.tradingPairs.binance[Pair[0]][Pair[1][1]])/this.state.balance.binance[Pair[0].slice(3,Pair[0].length)])).toFixed(2)+ '%' : ""}</td>						
								<td>{this.state.tradingPairs.binance[Pair[0]] ? (1/this.state.tradingPairs.binance[Pair[0]][Pair[1][1]]).toFixed(7) : ""}</td>
								<td>1</td>
							</TableRow>										
						</TableBody>
					</Table> 							
					<Table>
					<TableHead>
						<TableRow>
							<th data-field="">Trade</th>
							<th data-field="">$</th>
							<th data-field="">{Pair[0].slice(0,3).toUpperCase()}</th>
							<th data-field="">{Pair[0].slice(3,Pair[0].length).toUpperCase()}</th>
							<th data-field="">{Pair[1][1].slice(3,Pair[1][1].length).toUpperCase()}</th>
							<th data-field="">Status</th>
						</TableRow>
					</TableHead>
					<TableBody>
					<TableRow>
						<td>{Pair[0].slice(3,Pair[0].length).toUpperCase()}</td>
						<td className="td_input"> <Input type="number" inputProps={{min: "0",step: "0.000001"}} id={Pair[0]} value={this.state.binanceB1Minimum[Pair[0]]} onChange={this.updateBinanceB1Minimum} /> </td>
						<td>{this.state.tradingPairs.binance[Pair[0]] ? (1/this.state.tradingPairs.binance[Pair[0]][Pair[0]] * this.state.binanceB1Minimum[Pair[0]]).toFixed(5) : ""}</td>
						<td>{this.state.binanceB1Minimum[Pair[0]]}</td>						
						<td>{this.state.tradingPairs.binance[Pair[0]] ? (this.state.tradingPairs.binance[Pair[0]][Pair[1][1]] * this.state.binanceB1Minimum[Pair[0]]).toFixed(5) : ""}</td>
						<td>{
							this.state.tradingPairs.binance[Pair[0]] ? 
							((this.state.binanceB1Minimum[Pair[0]] < this.state.balance.binance[Pair[0].slice(3,Pair[0].length)]) && ((1/this.state.tradingPairs.binance[Pair[0]][Pair[0]] * this.state.binanceB1Minimum[Pair[0]]) < this.state.balance.binance[Pair[0].slice(0,3)]) && ((this.state.tradingPairs.binance[Pair[0]][Pair[1][1]] * this.state.binanceB1Minimum[Pair[0]]) < this.state.balance.binance[Pair[1][1].slice(3,Pair[1][1].length)]) ? <Switch checked={true}/> : <Switch checked={false}/>)
							: ""
							}
					</td>	
					</TableRow>		
					<TableRow>
						<td>{Pair[0].slice(0,3).toUpperCase()}</td>
						<td className="td_input"> <Input type="number" inputProps={{min: "0",step: "0.001"}} id={Pair[0]} value={this.state.binanceC1Minimum[Pair[0]]} onChange={this.updateBinanceC1Minimum} /> </td>
						<td>{this.state.binanceC1Minimum[Pair[0]]}</td>						
						<td>{this.state.tradingPairs.binance[Pair[0]] ? (this.state.tradingPairs.binance[Pair[0]][Pair[0]] * this.state.binanceC1Minimum[Pair[0]]).toFixed(5) : ""}</td>
						<td>{this.state.tradingPairs.binance[Pair[0]] ? (this.state.tradingPairs.binance[Pair[0]][Pair[1][2]] * this.state.binanceC1Minimum[Pair[0]]).toFixed(5) : ""}</td>
						<td>{this.state.tradingPairs.binance[Pair[0]] ?
							((this.state.binanceC1Minimum[Pair[0]] < this.state.balance.binance[Pair[0].slice(0,3)]) 
							&&	((this.state.tradingPairs.binance[Pair[0]][Pair[0]] * this.state.binanceC1Minimum[Pair[0]]) < this.state.balance.binance[Pair[0].slice(3,Pair[0].length)]) &&
							((this.state.tradingPairs.binance[Pair[0]][Pair[1][2]] * this.state.binanceC1Minimum[Pair[0]]) < this.state.balance.binance[Pair[1][1].slice(3,Pair[1][1].length)])
							? <Switch checked={true}/> :  <Switch checked={false}/>)
							: ""
							}</td>	
					</TableRow>	
					</TableBody>
					</Table> 	
				</div>
				))
				})()						
			}	
			</TabContainer>}
			{this.state.tabValue === 2 && <TabContainer>
			   <Button variant="raised" color="primary" onClick={this.getBittrexDBTrade}>Generate Trading Statistics</Button>
			   <h3>Bittrex</h3>
			  <div>
				{this.state.bittrexProfit.btc ? this.state.bittrexProfit.btc.toFixed(8) : 0}/{this.state.balance.bittrex.btc} btc ({this.state.bittrexProfit.btc > 0 ?  (this.state.bittrexProfit.btc * 100/this.state.balance.bittrex.btc).toFixed(8) :  0.00000000})%
				<LinearProgress variant="determinate" value={this.state.bittrexProfit.btc ?  this.state.bittrexProfit.btc * 100/this.state.balance.bittrex.btc : 0} />
			  </div>
			  <div>
				{this.state.bittrexProfit[this.state.tradingPairs.misc] ? this.state.bittrexProfit[this.state.tradingPairs.misc].toFixed(8) : 0}/{this.state.balance.bittrex[this.state.tradingPairs.misc]} {this.state.tradingPairs.misc} ({this.state.bittrexProfit[this.state.tradingPairs.misc] ? (this.state.bittrexProfit[this.state.tradingPairs.misc]*100/this.state.balance.bittrex[this.state.tradingPairs.misc]).toFixed(8) : 0.00000000})%
				<LinearProgress variant="determinate" value={this.state.bittrexProfit[this.state.tradingPairs.misc] ?  this.state.bittrexProfit[this.state.tradingPairs.misc]*100/this.state.balance.bittrex[this.state.tradingPairs.misc]: 0} />
			  </div>			   
				 <ReactEchartsCore
		          echarts={echarts}
				  option={this.state.dbTrade}
				  style={{height: this.state.chartSize.height+'px', width:'100%'}}
				  notMerge={true}
				  lazyUpdate={true}
				  onEvents={{
					  'legendselectchanged':(evt)=>{
						  let _dbTrade = this.state.dbTrade;
						  _dbTrade.legend.selected = evt.selected;
						  return this.setState({dbTrade:_dbTrade})
						 },	
					  'dataZoom': (zoom)=>{
						  let _dbTrade = this.state.dbTrade;
						  _dbTrade.dataZoom = ({start:zoom.start,end:zoom.end});
						  return this.setState({dbTrade:_dbTrade})
						}
				  }}
				   />	
				  <h3>Binance</h3>  
				   {
					(()=>{
						let results = [];
						for(let key in this.state.binanceProfit){
						   for(let key2 in this.state.binanceProfit[key]){
								results.push([key2,this.state.binanceProfit[key][key2]]);
							}
						}
						
						return results.map((profit)=>(
							<div key={profit[1]}>
							{ profit[1] ? profit[1].toFixed(8) :""}/{this.state.balance.binance[profit[0]]} {profit[0]} ({profit[1] ? ([profit[1]] * 100/this.state.balance.binance[profit[0]]).toFixed(8) : ""})%
							<LinearProgress variant="determinate" value={profit[1] * 100/this.state.balance.binance[profit[0]]} />	
							</div>					
						))
					})()
					}
		          {
					(()=>{
					if(this.state.dbTradeBinance.length > 0)
					{return this.state.dbTradeBinance.map((option) => (
					<div  key={option.key}>
					<ReactEchartsCore
			          echarts={echarts}
					  option={option}
					  style={{height: this.state.chartSize.height+'px', width:'100%'}}
					  notMerge={true}
					  lazyUpdate={true}
					  onEvents={{
						  'legendselectchanged':(evt)=>{
							 return option.legend.selected = evt.selected;
							 },	
						  'dataZoom': (zoom)=>{
							  return option.dataZoom =({start:zoom.start,end:zoom.end});
							}
					  }}
				    />	
				    </div>
					))}
					})()						
				}
				 {
					(()=>{
					if(this.state.dbScatter.length > 0)
					{return this.state.dbScatter.map((option,i) => (
					<div  key={option.key}>
					<ReactEchartsCore
			          echarts={echarts}
					  option={option}
					  style={{height: this.state.chartSize.height+'px', width:'100%'}}
					  notMerge={true}
					  lazyUpdate={true}
					  onEvents={{
					  'legendselectchanged':(evt)=>{
						  let _dbScatter = this.state.dbScatter;
						  _dbScatter[i].legend.selected = evt.selected;
						  return this.setState({dbScatter:_dbScatter})
						 }
						}}
				    />	
				    </div>
					))}
					})()						
				}
			</TabContainer>}
			{this.state.tabValue === 3 && <TabContainer>
				<Button variant="raised" color="primary" onClick={this.clearOrders}>Clear Cache</Button>
				<Button variant="raised" color="primary" onClick={this.getOrders}>Retrieve Orders</Button>
				{this.state.orders.map((order)=> 
					<Card key={order.order_id} style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
					<CardHeader style={{backgroundPosition:"center",backgroundImage: order.image}}>
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
			      </Card>)}		
			</TabContainer>}
			{this.state.tabValue === 4 && <TabContainer>
				<textarea value={this.state.log} readOnly> </textarea>		
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
				<ReactEchartsCore
				  echarts={echarts}
				  option={this.state.swingGauge}
				  style={{height: this.state.chartSize.height*1.1+'px', width:'100%'}}
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
				<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
		        <CardContent >
		           <Typography type="title">Server Connection</Typography>
		           <br/>
					<FormControl fullWidth={true}>
						<InputLabel>Private Key</InputLabel>
						<Input type="text" placeholder="Private Key" value={this.state.privatekey} onChange={this.updatePkey}/>
					</FormControl>	
					<FormControl fullWidth={true}>
						<InputLabel>Host</InputLabel>
						<Input type="text" value={this.state.websocketNetwork} onChange={this.updateNetwork}/>
					</FormControl>	
					<FormControl fullWidth={true}>	
						<InputLabel>Port Number</InputLabel>
						<Input type="number" placeholder="Port" min={0} value={this.state.port} onChange={this.updatePort}/>	
					</FormControl>				
		        </CardContent>
		        <CardActions>
			        <FormGroup>
			        <FormControlLabel
					  label="Connect"
					  style={{margin:"auto"}}
			          control={<Switch
							  
				              checked={this.state.connected}
				              onChange={(event, checked) => {
								  if(checked){
									  return this.begin();
								  }
								  else{
									  return this.end();
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
				              checked={this.state.autoconnect}
				              onChange={(event, checked) => {
									return this.setStartup(checked);
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
			              checked={this.state.autosave}
			              onChange={(event, checked) => {
							  this.setState({ autosave: checked });
							  return this.autosave(checked);
							}}
						/>}
		        />
				</FormGroup>
		        <FormGroup>
		        <FormControlLabel
				  label="Web Notifications"
				  style={{margin:"auto"}}
		          control={<Switch
			              checked={this.state.webNotify}
			              onChange={(event, checked) => {
							  this.setState({ webNotify: checked });
							  return this.webNotify(checked);
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
			              checked={this.state.toastNotify}
			              onChange={(event, checked) => {
							  this.setState({ toastNotify: checked });
							  return this.toastNotify(checked);
							}}
						/>}
		        />
				</FormGroup>					
				{
				!this.state.cleared ?
				<FormGroup>
		        <FormControlLabel
				  label="Reset Settings"
				  style={{margin:"auto"}}
		          control={<Switch
			              checked={this.state.cleared}
			              onChange={(event, checked) => {
							if(checked){
								return this.setState({cleared:true},()=>{return this.clearData()});
							}
						}}
		            /> }
		        />
				</FormGroup> : <label>Data wiped!</label>
				}							
		        </CardActions>
				</Card>
				<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
			        <CardContent>
			            <Typography type="title">Bittrex Config</Typography>
			            <br/>
						<InputLabel>Bot Polling Rate:{this.state.pollingRate/60000} Minutes </InputLabel>
						<br/>
						<Input type="number" min={10} max={1400001} value={this.state.pollingRate/1000} onChange={this.updatePollingRate}/>
						<br/>
						<InputLabel>Swing Polling Rate:{this.state.swingPollingRate/60000} Minutes</InputLabel>
						<br/>
						<Input type="number" min={10} max={1400001} value={this.state.swingPollingRate/1000} onChange={this.updateSwingPollingRate}/>
						 <div className="Switches">
						<FormGroup>
						<FormControlLabel
						  label="WebSocket Connection Enabled"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={this.state.bittrexSocketStatus}
					              onChange={(evt,checked)=>{this.controlBittrex(evt,checked)}}
				            /> }
				        />
				        <FormControlLabel
						  label="Sane Trades"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={this.state.sanity}
					              onChange={this.updateSanity}
				            /> }
				        />
				        <FormControlLabel
						  label="Liquid Trades"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={this.state.liquidTrades}
					              onChange={this.updateLiquidTrade}
				            /> }
				        />
				        <FormControlLabel
						  label="View Bittrex Order Book"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={this.state.viewBittrexBook}
					              onChange={this.forceBittrexView}
				            /> }
				        />
				        <FormControlLabel
						  label="Swing Trade"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={this.state.swingTrade}
					              onChange={this.updateSwingTrade}
				            /> }
				        />
				        </FormGroup>
				        </div>
						<InputLabel>Lower Limit</InputLabel>
						<br/>
						<Input type="number" min={0} max={120} value={this.state.lowerLimit} onChange={this.updateLowerLimit}/>
						<br/>
						<InputLabel>Upper Limit</InputLabel>
						<br/>
						<Input type="number"  min={0} max={120} value={this.state.upperLimit} onChange={this.updateUpperLimit}/>			       
						<br/>
						<InputLabel>Swing Percentage</InputLabel>
						<br/>
						<Input type="number" min={0} max={100} value={this.state.swingPercentage} onChange={this.updateSwingPercentage}/>
						<br/>
						<InputLabel>Log Level</InputLabel>
						<br/>
						<Input type="number" min={0} max={3} value={this.state.logLevel} onChange={this.updateLogLevel}/>						
			        </CardContent>
			        <CardActions>
						<Button variant="raised" color="primary" onClick={this.get_poll_rate}>Get Bot Polling Rate</Button>
						<Button variant="raised" color="primary" onClick={this.swing_reset}>Reset Swing Trading</Button>	
			        </CardActions>
				</Card> 		    
				<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
			        <CardContent>
			            <Typography type="title">Binance Config</Typography>
			            <br/>
			            <FormControlLabel
						  label="WebSocket Connection Enabled"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={
									  (()=>{
										  if(this.state.binanceConnections > 0 && this.state.connected){return true;}
										  else{return false}
										 })()
									  }
					              onChange={(evt,checked)=>{this.controlBinance(evt,checked)}}
				            /> }
				        />
				        {
							(()=>{
							let p = [];
							for(let key in this.state.binanceB1Minimum){
								p.push([key,this.state.binanceB1Minimum[key]]);
							}
							return p.map((Pair) => (
							<div key={Pair[0]}>
							 <div className="Switches">
							<FormGroup>
					        <FormControlLabel
							  id={Pair[0]}
							  label="Liquid Trades"
							  style={{margin:"auto"}}
					          control={<Switch
						              checked={this.state.liquidTradesBinance[Pair[0]]}
						              onChange={this.updateLiquidTradeBinance}
					            /> }
					        />
					        ({Pair[0]})
					        </FormGroup>
					        </div>	
							<InputLabel>Minimum {Pair[0].slice(3,Pair[0].length).toUpperCase()} Order</InputLabel>
							<br/>
							<Input type="number" id={Pair[0]} inputProps={{min: "0",step: "0.000001" }} value={this.state.binanceB1Minimum[Pair[0]]} onChange={this.updateBinanceB1Minimum}/>
							<br/>
							<InputLabel>Minimum {Pair[0].slice(0,3).toUpperCase()} Order</InputLabel>
							<br/>
							<Input type="number" id={Pair[0]} inputProps={{min: "0",step: "0.001" }} value={this.state.binanceC1Minimum[Pair[0]]} onChange={this.updateBinanceC1Minimum}/>
							</div>	
							))
							})()						
						}	
						       					
			        </CardContent>
				</Card> 		    				  
				<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
			        <CardContent>
						<Typography type="title">Bittrex Status</Typography>
						<br/>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Asset</TableCell>
									<TableCell>Balance</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									(()=>{
										let p = [];
										for(let key in this.state.balance.bittrex){
											if(key !== "account" && this.state.balance.bittrex[key] > 0){
												p.push([key.toString(),this.state.balance.bittrex[key]]);
											}
										}
										return p.map(item=>(<TableRow key={item[0]}><TableCell>{item[0]}</TableCell><TableCell>{item[1]}</TableCell></TableRow>));
										
									})()
								} 
						</TableBody>
						</Table>
			        </CardContent>
			        <CardActions>
						<Button variant="raised" color="primary" onClick={this.updateBittrexBalance}>Get Balance</Button>			
			        </CardActions>
				</Card>
				<Card style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
			        <CardContent>
						<Typography type="title">Binance Status</Typography>
						<br/>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Asset</TableCell>
									<TableCell>Balance</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									(()=>{
										let p = [];
										for(let key in this.state.balance.binance){
											if(key !== "account" && this.state.balance.binance[key] > 0){
												p.push([key.toString(),this.state.balance.binance[key]]);
											}
										}
										return p.map(item=>(<TableRow key={item[0]}><TableCell>{item[0]}</TableCell><TableCell>{item[1]}</TableCell></TableRow>));
										
									})()
								} 
						</TableBody>
						</Table>
			        </CardContent>
			        <CardActions>
						<Button variant="raised" color="primary" onClick={this.updateBinanceBalance}>Get Balance</Button>			
			        </CardActions>
				</Card>				
				<footer>
					<div>
						MaterialUI theme provided by <a href='https://github.com/callemall/material-ui/tree/v1-beta'>Material-UI</a>
					</div>
				    <div>Favicon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></div>
				</footer> 				
			</TabContainer>}   
			</div>	
			<div className="Burger">
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
		       {this.state.previous.map(option => (
		            <MenuItem key={option} onClick={()=>{this.connect(option)}}>
		              {option}
		            </MenuItem>
		          ))}
		        <MenuItem key="xxx" onClick={this.menuClose}>
		        Close
		        </MenuItem>
		        </Menu>
		    </div>    
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
