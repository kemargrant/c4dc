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
import CardContent from '@material-ui/core/CardContent';
import InsertSettings from '@material-ui/icons/Settings';
import InsertFile from '@material-ui/icons/ShopTwo';
import InsertLogs from '@material-ui/icons/LibraryBooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TrendingDown from '@material-ui/icons/TrendingDown';
import TrendingUp from '@material-ui/icons/TrendingUp';
import { Chart } from 'react-google-charts';
import BinanceCharts from './components/binancecharts';				
import BinanceProfit from './components/binanceprofit';				
import BittrexChart from './components/bittrexchart';				
import BittrexProfit from './components/bittrexprofit';				
import BittrexState from './components/bittrexstate';		
import BinanceState from './components/binancestate';		
import GeneralBalance from './components/generalbalance';		
import Config from './components/config';		
import ExchangeConfig from './components/exchangeconfig';		
import Log from './components/log';
import Orders from './components/orders';
import PMenu from './components/pmenu';
import TabContainer from './components/tabcontainer';
		
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
			binanceGauge:[[],[]],
			bittrexGauge:[[],[]],
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
			XXXAmount:null,
			BTCAmount:null,
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
		this.updateXXXAmount = this.updateXXXAmount.bind(this);	
		this.updateBTCAmount = this.updateBTCAmount.bind(this);	
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
				if(data.p1 > -1){
					this.setState({XXXAmount:data.p1,BTCAmount:data.p2});
					console.log(this.state)
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
			let agauge = this.state.binanceGauge[1].slice(0);
			let bgauge = this.state.binanceGauge[0].slice(0);
			if(agauge.length > 100){
				agauge.shift(agauge.push({x:agauge[agauge.length - 1].x + 1,y:Number(data.percentage.toFixed(4))}))
				bgauge.shift(bgauge.push({x:agauge[agauge.length - 1].x,y:Number(((agauge.reduce((s,c)=>{return s+c.y},0))/agauge.length).toFixed(4)) }))
			}
			else{
				agauge.push({x:agauge.length,y:Number(data.percentage.toFixed(4))})
				bgauge.push({x:agauge.length-1,y:Number(((agauge.reduce((s,c)=>{return s+c.y},0))/agauge.length).toFixed(4)) })
			}
			
			let _tradingPairs = {bittrex:this.state.tradingPairs.bittrex,binance:_binance,misc:this.state.tradingPairs.misc}
			return this.setState({binanceGauge:[bgauge,agauge],tradingPairs:_tradingPairs});
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
			if(agauge.length > 100){
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
	
	updateXXXAmount(evt){
		this.setState({XXXAmount:evt.currentTarget.value});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"update_amount","xxxAmount":evt.currentTarget.value,"btcAmount":this.state.BTCAmount}),this.state.privatekey).toString());
	}
	
	updateBTCAmount(evt){
		this.setState({BTCAmount:evt.currentTarget.value});
		return this.state.bsocket.postMessage(AES.encrypt(JSON.stringify({"command":"update_amount","btcAmount":evt.currentTarget.value,"xxxAmount":this.state.XXXAmount}),this.state.privatekey).toString());			
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
				<BittrexState 
					balance={this.state.balance.bittrex}
					bittrexStatus={this.state.bittrexStatus}
					bookData={this.state.bittrexBook}
					forceMonitorBittrex={this.forceMonitorBittrex}
					gauge={this.state.bittrexGauge}
					XXXAmount={this.state.XXXAmount}
					BTCAmount={this.state.BTCAmount}
					progress={this.state.bittrexProgress * 100/3}
					style={{height: this.state.chartSize.height, width: this.state.chartSize.width}}
					time={this.state.bittrexStatusTime}
					viewBook = {this.state.viewBittrexBook}
					toggleBook={this.forceBittrexView}
					tradingPairs={this.state.tradingPairs}
					updateXXXAmount={this.updateXXXAmount}
					updateBTCAmount={this.updateBTCAmount}
				/>	  			
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
