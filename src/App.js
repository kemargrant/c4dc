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
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/gauge';
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
			autoconnect: localStorage.getItem("AutoConnect") ? JSON.parse(localStorage.getItem("AutoConnect")) : false,
			autosave: JSON.parse(localStorage.getItem("Autosave")) ? true : false,
			balance:JSON.parse(localStorage.getItem("Bittrex_Balance")) ? JSON.parse(localStorage.getItem("Bittrex_Balance")):{binance:{account:"Binance"},bittrex:{account:"Bittrex"}},
			binanceBTCMinimum:0,
			binanceC1Minimum:0,
			binanceC1:"",
			binanceC2:"",
			binanceGauge:{
				tooltip : {
					formatter: "{c}"
				},
				title : {
						text:"Binance Meter",
						show:true,
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
			binanceProfit:JSON.parse(localStorage.getItem("Binance_Profit"))? JSON.parse(localStorage.getItem("Binance_Profit")) : {btc:0},
			bittrexProfit:JSON.parse(localStorage.getItem("Bittrex_Profit"))? JSON.parse(localStorage.getItem("Bittrex_Profit")) : {btc:0},
			binanceProgress:0,
			bittrexPercentage:0,
			binanceStatus:false,
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
			dbTrade:JSON.parse(localStorage.getItem("DB_Trade"))? JSON.parse(localStorage.getItem("DB_Trade")) : {
				xAxis:{type:'time'},
				yAxis:{type:'value'}
			},
			dbTradeBinance:JSON.parse(localStorage.getItem("DB_TradeBinance"))? JSON.parse(localStorage.getItem("DB_TradeBinance")) : {
				xAxis:{type:'time'},
				yAxis:{type:'value'}
			},			
			cleared:false,
			chartSize:{
				width:document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth *0.9 : 1000,
				height:document.documentElement.clientHeight > 0 ? document.documentElement.clientHeight/1.9 : 500,
			},				
			connected:false,
			liquidTrades:true,
			liquidTradesBinance:true,
			log:"",
			logLevel:0,
			lowerLimit:89,
			menuAnchor: null,
			menu_open:false,
			option:{
				xAxis:{type:'time'},
				yAxis:{type:'value'}
			},
			orders:JSON.parse(localStorage.getItem("Orders"))? JSON.parse(localStorage.getItem("Orders")):[],
			previous:JSON.parse(localStorage.getItem("Previous_Connections"))? JSON.parse(localStorage.getItem("Previous_Connections")) : ["Full History"],
			percentage1:null,
			percentage2:null,
			pollingRate:0,
			port:7071,
			privatekey:localStorage.getItem("xxpkeyxx") ? localStorage.getItem("xxpkeyxx"): "",
			sanity:true,
			socketMessage:function(){},
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
			toastNotify: JSON.parse(localStorage.getItem("Toast_Notify")) ? true : false,
			tradingPairs:JSON.parse(localStorage.getItem("Trading_Pairs"))? JSON.parse(localStorage.getItem("Trading_Pairs")) : {bittrex:{},binance:{},msc:""},
			tradeInfo:undefined,
			upperLimit:101.79,
			webNotify: JSON.parse(localStorage.getItem("Web_Notify")) ? true : false,
			websocketNetwork:"localhost",
		}
		this.changeTab = this.changeTab.bind(this);	
		this.clearData = this.clearData.bind(this);
		this.clearOrders = this.clearOrders.bind(this);
		this.connect = this.connect.bind(this);		
		this.getBittrexDBTrade = this.getBittrexDBTrade.bind(this);
		this.getOrders = this.getOrders.bind(this);
		this.getPollingRate = this.getPollingRate.bind(this);
		this.menuClose = this.menuClose.bind(this);
		this.menuOpen = this.menuOpen.bind(this);
		this.updateBinanceBalance = this.updateBinanceBalance.bind(this);	
		this.updateBinanceBTCMinimum = this.updateBinanceBTCMinimum.bind(this);	
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
			return localStorage.removeItem("Autosave");
		}
		else{
			return localStorage.setItem("Autosave",true);
		}	
	}
	
	begin(){
		return this.backgroundSocketSetup();
	}

	backgroundSocketSetup(){
		let js = "let closed = function(){return postMessage(null)};\
		let ws;\
		try{ws = new WebSocket('ws://sub_network');}catch(e){};\
		onmessage = function(text){return ws.send(text.data)};\
		ws.onopen = function(){return postMessage(0);};\
		ws.onmessage = function(m){return postMessage({data:m.data,type:m.type})};\
		ws.onclose = closed;\
		ws.onerror = closed;"
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
		if(this.state.autosave && this.state.privatekey){
			localStorage.setItem("xxpkeyxx",this.state.privatekey);
		}
		return this.setState({socketMessage:function(x){return bsocket.postMessage(x)}});
	}
	
	changeTab(evt,value){
		return this.setState({tabValue:value});
	}	
	
	clearData(){
		let list = ["AutoConnect","Autosave","Bittrex_Balance","Binance_Profit","Bittrex_Profit","Orders","Previous_Connections","Toast_Notify","Trading_Pairs","Web_Notify","xxpkeyxx"];
		for(let i=0;i< list.length;i++){
			localStorage.removeItem(list[i]);
		}
		return this.setState({autosave:false});
	}
	
	clearOrders(){
		localStorage.removeItem("Orders");
		return this.setState({orders:[]});
	}		

	componentDidMount(){
		if(this.state.autoconnect === true && this.state.previous.length > 1){
			this.connect(this.state.previous[1]);
		}
		return;
	}
	
	connect(net){
		this.setState({menuAnchor:null,menu_open:false});
		if(net === "Full History"){
			return this.getBittrexDBHistory();
		}
		else{
			return this.setState({websocketNetwork:net.split(':')[1].replace('//',''),port:Number(net.split(':')[2])},()=>{
				return this.begin();
			});
		}
	}	
	
	getBittrexDBHistory(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"bittrex_db","db":"history"}),this.state.privatekey).toString());
	}	
	
	getBittrexDBTrade(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"bittrex_db","db":"trade"}),this.state.privatekey).toString());
	}		
						
	getOrders(){
		this.clearOrders();
		this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"binance_orders"}),this.state.privatekey).toString());
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"bittrex_orders"}),this.state.privatekey).toString());
	}		
	
	getPollingRate(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"poll_rate"}),this.state.privatekey).toString());			
	}					
	
	faux_socket(data){
		if(data === 0){
			this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"connect"}),this.state.privatekey).toString());
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
					localStorage.setItem("Bittrex_Balance",JSON.stringify(this.state.balance));
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
					localStorage.setItem("Bittrex_Balance",JSON.stringify(this.state.balance));
				}
			});
		}		
		
		if(data.type === "binancePercent"){
			if(!Number(data.percentage)){return;}
			let _binance = {}
			let gauge = this.state.binanceGauge;
			gauge.series[0].data = [{value:data.percentage.toFixed(4),name:"%"}];
			_binance[this.state.binanceC1+"_btc"] = data.info.a;
			_binance["btc_"+this.state.binanceC2] = data.info.b;
			_binance[this.state.binanceC1+"_"+this.state.binanceC2] = data.info.c;
			let _tradingPairs = {bittrex:this.state.tradingPairs.bittrex,binance:_binance,misc:this.state.tradingPairs.misc}
			return this.setState({binanceGauge:gauge,tradingPairs:_tradingPairs});
		}

		if(data.type === "binanceStatus"){
			if(data.value === false){
				this.setState({binanceProgress:0});
			}
			return this.setState({binanceStatus:data.value});
		}			
		
		if(data.type === "config"){
			return this.setState({logLevel:data.logLevel,swingPollingRate:data.swingRate,sanity:data.sanity,liquidTrades:data.liquid,upperLimit:data.upperLimit,lowerLimit:data.lowerLimit,swingTrade:data.vibrate,swingPercentage:data.swingPercentage * 100});
		}

		if(data.type === "configBinance"){		
				
			return this.setState({balance:{bittrex:this.state.balance.bittrex,binance:data.balance},liquidTradesBinance:data.liquid,binanceStatus:data.status,binanceC1:data.pair.slice(0,3),binanceC2:data.pair.slice(3,data.pair.length),binanceBTCMinimum:data.minBTC,binanceC1Minimum:data.minXXX});
		}		
					
		if(data.type === "db_history"){
			let date;
			let new_option = this.state.option; 
			let v = [];
			for(let k=0;k<data.info.length;k++){
				date = new Date(data.info[k].Time);
				v.push({value:[date,data.info[k].Percent],name:date.toString()});
			}
			new_option.series = [{sampling:"average",smooth:true,animation:false,name:'Percentages',type:'line',data:v,markLine:this.state.border}];
			return this.setState({option:new_option});
		}	
		if(data.type === "db_trade"){
			if(!this.state.tradingPairs.misc){
				let _temp = this.state.tradingPairs;
				_temp.misc = "xxx";
				this.setState({tradingPairs:_temp});
			}
			let msc = this.state.tradingPairs.misc ? this.state.tradingPairs.misc.toUpperCase() : "XXX";
			let msc2 = this.state.binanceC1;
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
			let _binanceProfit ={}
			let _bittrexProfit ={}
			let date;
			let date2;
			let v = [];
			let btc = [];
			let _msc = [];
			let v2 = [];
			let btc2 = [];
			let _msc2 = [];			
			let dat = {}
			let dat2 = {}
			let btcCount = {}
			let btcCount2 = {}
			let _mscCount = {}
			let _mscCount2 = {}
			data.info = sort(data.info);
			_binanceProfit.btc = 0;
			_binanceProfit[msc2] = 0;
			_bittrexProfit.btc = 0;
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
							_bittrexProfit.btc += (data.info[k].After - data.info[k].Before);
						}
						if(btcCount[date]){
							btcCount[date]++;
						}
						else{
							btcCount[date]=1;
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
					date2 = new Date(data.info[k].Time).toISOString().split("T")[0];
					if(dat2[date2]){
						dat2[date2]++;
					}
					else{
						dat2[date2]=1;
					}
					if(data.info[k].Percent > 100){
						_binanceProfit.btc += data.info[k].Profit;
						if(data.info[k].Profit2){
							_binanceProfit[msc2] += data.info[k].Profit2;
						}
						if(btcCount2[date2]){
							btcCount2[date2]++;
						}
						else{
							btcCount2[date2]=1;
						}
					}
					else{
						_binanceProfit[msc2] += data.info[k].Profit;
						if(_mscCount2[date2]){
							_mscCount2[date2]++;
						}
						else{
							_mscCount2[date2]=1;
						}
					}
				}
			}
			for(let key in dat){
				v.push({value:[key,dat[key]],name:key});
			}
			for(let key in btcCount){
				btc.push({value:[key,btcCount[key]],name:key});
			}
			for(let key in _mscCount){
				_msc.push({value:[key,_mscCount[key]],name:key});
			}	
			for(let key in dat2){
				v2.push({value:[key,dat2[key]],name:key});
			}
			for(let key in btcCount2){
				btc2.push({value:[key,btcCount2[key]],name:key});
			}
			for(let key in _mscCount2){
				_msc2.push({value:[key,_mscCount2[key]],name:key});
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
		                    data:btc,
		                },
		                {
						
		                    name:msc+' Profitable',
		                    type:'line',
		                    smooth:'true',
		                    data:_msc,
		                },
		            ]
		        }	
		    let option2 = JSON.parse(JSON.stringify(option));
		    option2.legend.data = ['Total','BTC Profitable',msc2.toUpperCase()+' Profitable'];
		    option2.series[0].data = v2;
		    option2.series[1].data = btc2;
		    option2.series[2].data = _msc2;
		    option2.series[2].name = msc2.toUpperCase() + ' Profitable';
			if(this.state.autosave){
					localStorage.setItem("DB_Trade",JSON.stringify(option));
					localStorage.setItem("DB_TradeBinance",JSON.stringify(option2));
					localStorage.setItem("Binance_Profit",JSON.stringify(_binanceProfit));
					localStorage.setItem("Bittrex_Profit",JSON.stringify(_bittrexProfit));
			}
			return this.setState({dbTrade:option,dbTradeBinance:option2,tradeInfo:data.info,binanceProfit:_binanceProfit,bittrexProfit:_bittrexProfit});
		}				
		
		if(data.type === "history"){
			if(this.state.autosave && !this.state.previous.includes("ws://"+this.state.websocketNetwork+":"+this.state.port)){
				let prev = this.state.previous.slice();
				prev.push("ws://"+this.state.websocketNetwork+":"+this.state.port);
				localStorage.setItem("Previous_Connections",JSON.stringify(prev));
				this.setState({previous:prev});
			}
			try{
				let dates;
				let v = [];
				if(data.bittrex_history2){ 
					dates = data.bittrex_history2.length > 0 ? data.bittrex_history2 : []; 
				}	
				for(let k=0;k<dates.length;k++){
					v.push({value:[new Date(dates[k]),data.bittrex_history1[k]],name:new Date(dates[k]).toString()});
				}
				let option = {
					animation:false,
		            dataZoom:[
				            {
				            show: true,
				            realtime: true,
				            start: 80,
				            end: 100
				        },
				    ],
		            tooltip:{
		                trigger: 'axis',
						formatter: function(params){
							params = params[0];
							return params.name.split("GMT")[0]+ '/' + params.value[1].toFixed(2);
						},            
		            },
		            legend: {
						textStyle:{
							color:'white'
							},
		                data:['Percentage']
		            },
		            toolbox:{
						feature:{restore:{}}
		            },
		            grid: {
						top:'2%',
		                left: '3%',
		                right: '3%',
		                bottom: '15%',
		                containLabel: true
		            },
		            xAxis:[
						{
							axisLabel:{color:"#fbfcfb"},
							axisLine: {onZero: false},
							boundaryGap : false,
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
							axisLabel:{color:"#fbfcfb"},
							min:99.1,
							max:100.9,
		                    type : 'value',
		                    boundaryGap: [0, '100%'],
		                    splitNumber:5,
		                    splitLine: {
								show:true,
								lineStyle:{type:'dashed',width:1}
							}
		                }
		            ],
		            backgroundColor:"black",
		            series:[
		                {
							lineStyle:{normal:{width:4.5}},
							animation:false,
							color:["green"],
							animationDuration:4000,
							animationEasing: 'CubicOut',
		                    name:'Percentage',
		                    type:'line',
		                    smooth:'true',
		                    data:v,
		                    markLine:this.state.border,
		                },
		            ]
		        }
				let _bittrexPercentage = data.bittrex_history1 ? data.bittrex_history1[data.bittrex_history1.length-1] : 0;
				this.setState({option:option,bittrexPercentage:_bittrexPercentage});
				return;
			}
			catch(e){
				return this.toast(e);
			}
		}	
			
		if(data.type === "log"){
			this.setState({log:data.log+'\r\n<----------->\r\n'+this.state.log+'\r\n'});
		}	
			
		if(data.type === "order"){
			let _new_orders = this.state.orders;
			if(data.exchange === "binance"){
				data.image = "url('https://pbs.twimg.com/profile_banners/877807935493033984/1511522262/1500x500')";
			}
			else{
				data.image = "url('https://pbs.twimg.com/profile_banners/2309637680/1420589155/1500x500')";
			}
			_new_orders.push({"image":data.image,"filled":data.filled,"exchange":data.exchange,"order_id":data.order_id,"type":data.otype,"amount":data.amount,"pair":data.pair,"status":data.status,"rate":data.rate,"timestamp_created":data.timestamp_created});
			if(this.state.autosave){
				localStorage.setItem("Orders",JSON.stringify(_new_orders));
			}
			return this.setState({orders:_new_orders});
		}		
			
		if(data.type === "orderRemove"){
			let _edit_orders = [];
			let _binanceProgress = this.state.binanceProgress;
			for(var i = 0;i < this.state.orders.length;i++){
				if(this.state.orders[i].order_id !== data.order_id){
					_edit_orders.push(this.state.orders[i]);
				}
			}
			if(this.state.autosave){
				localStorage.setItem("Orders",JSON.stringify(_edit_orders));
			}
			_binanceProgress += 1;
			if (_binanceProgress === 3){
				_binanceProgress = 0;
			}
			return this.setState({orders:_edit_orders,binanceProgress:_binanceProgress});
		}				
			
		if(data.type === "percentage"){
			let _tradingPairs = {bittrex:{},binance:this.state.tradingPairs.binance}
			let date = new Date();
			for(let key in data){
				if(key.search('-') > -1){
					_tradingPairs.bittrex[key.toLowerCase().replace('-','_')] = data[key];
					if(key.search('BTC') > -1 && key.search('USDT') <0){
						_tradingPairs.misc = key.replace('BTC-','').toLowerCase();
					}
				}
			}
			let v = this.state.option.series ? this.state.option.series[0].data.slice() : []
			v.push({value:[date,data.percentage],name:date.toString()})
			let new_option = this.state.option; 
			new_option.series = [{
				animation:false,
				lineStyle:{normal:{width:5}},
				name:'Percentage',
				type:'line',
				data:v,
				smooth:true,
				markLine:this.state.border
			}];
			if(this.state.autosave){
				localStorage.setItem("Trading_Pairs",JSON.stringify(_tradingPairs));
			}
			return this.setState({option:new_option,tradingPairs:_tradingPairs,bittrexPercentage:data.percentage});
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
		
	forceMonitorBinance(checked){
		this.setState({binanceStatus:checked});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"binanceMonitor","bool":checked}),this.state.privatekey).toString());				
	}	
			
	menuOpen(evt){
		return this.setState({menuAnchor:evt.currentTarget,menu_open:true});
	}

	menuClose(){
		return this.setState({ menuAnchor: null,menu_open:false });
	}	
	
	setStartup(checked){
		this.setState({autoconnect:checked});
		return localStorage.setItem("AutoConnect",checked);
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
		return setTimeout(()=>{return this.setState({toast:{open:false}});},2000);
	}	

	toastNotify(checked){
		if(!checked){
			return localStorage.removeItem("Toast_Notify");
		}
		else{
			return localStorage.setItem("Toast_Notify",true);
		}	
	}	

	updateBinanceBalance(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"binance_balance"}),this.state.privatekey).toString());
	}			

	updateBinanceBTCMinimum(evt){
		this.setState({binanceBTCMinimum:evt.currentTarget.value});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"binanceBTCMinimum","min":evt.currentTarget.value}),this.state.privatekey).toString());			
	}
	
	updateBinanceC1Minimum(evt){
		this.setState({binanceC1Minimum:evt.currentTarget.value});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"binanceC1Minimum","min":evt.currentTarget.value}),this.state.privatekey).toString());			
	}	

	updateLogLevel(evt){
		this.setState({logLevel:evt.currentTarget.value});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"logs","logLevel":evt.currentTarget.value}),this.state.privatekey).toString());			
	}	
			
	updateBittrexBalance(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"bittrex_balance"}),this.state.privatekey).toString());
	}					

	updateLiquidTrade(evt,checked){
		this.setState({liquidTrades:checked});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"liquidTrade","bool":checked}),this.state.privatekey).toString());
	}

	updateLiquidTradeBinance(evt,checked){
		this.setState({liquidTradesBinance:checked});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"liquidTradeBinance","bool":checked}),this.state.privatekey).toString());
	}		
	
	updateLowerLimit(evt){
		this.setState({lowerLimit:evt.currentTarget.value});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"lowerLimit","limit":evt.currentTarget.value}),this.state.privatekey).toString());			
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
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"update_percentage","percentage1":evt.currentTarget.value/100,"percentage2":this.state.percentage2}),this.state.privatekey).toString());
	}
	
	updatePercentage2(evt){
		this.setState({percentage2:evt.currentTarget.value/100});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"update_percentage","percentage2":evt.currentTarget.value/100,"percentage1":this.state.percentage1}),this.state.privatekey).toString());			
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
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"poll","rate":rate}),this.state.privatekey).toString());
	}	

	updateSanity(evt,checked){
		this.setState({sanity:checked});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"sanity","bool":checked}),this.state.privatekey).toString());
	}

	updateSwingPercentage(evt){
		let rate = evt.currentTarget.value; 
		this.setState({swingPercentage:rate});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"swingPercentage","percentage":rate}),this.state.privatekey).toString());
	}
	
	updateSwingPollingRate(evt){
		let rate = evt.currentTarget.value; 
		this.setState({swingPollingRate:rate * 1000});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"swingPoll","rate":rate}),this.state.privatekey).toString());
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
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"swingTrade","bool":checked}),this.state.privatekey).toString());
	}		

	updateUpperLimit(evt){
		this.setState({upperLimit:evt.currentTarget.value});
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"upperLimit","limit":evt.currentTarget.value}),this.state.privatekey).toString());			
	}		
		
	webNotify(checked){
		if(!checked){
			return localStorage.removeItem("Web_Notify");
		}
		else{
			return localStorage.setItem("Web_Notify",true);
		}	
	}	
	render(){  	
		return (
		  <div className="App">
			<AppBar position="static">
			<Tabs scrollable value={this.state.tabValue} onChange={this.changeTab} centered fullWidth>	
				<Tab label="Bittrex" icon={<img className="bittrexImg" alt="Bittrex Logo" src="https://pbs.twimg.com/profile_images/552616908093001728/97DIMDFd_400x400.png"/>}></Tab>
				<Tab label="Binance" icon={<img className="binanceImg" alt="Binance Logo" src="https://resource.binance.com/resources/img/favicon.ico" />}></Tab>				
				<Tab label="Stats" icon={<BubbleChart />}></Tab>
				<Tab label="Orders" icon={<InsertFile />}></Tab>
				<Tab label="Logs" icon={<InsertLogs />}></Tab>
				<Tab label="Swing" icon={<AutoRenew />} onClick={()=>{this.updateSwingPrice()}}></Tab>
				<Tab label="Settings" icon={<InsertSettings />}></Tab>   
			</Tabs>
			</AppBar>	
			<div className="body">     
			{this.state.tabValue === 0 && <TabContainer>
				<div className="graph">
				<ReactEchartsCore
				  echarts={echarts}
				  option={this.state.option}
				  style={{height: this.state.chartSize.height+'px', width:'100%'}}
				  notMerge={true}
				  lazyUpdate={true}
				  onEvents={{
					  'legendselectchanged':(evt)=>{
						 return this.state.option.legend.selected = evt.selected;
						 },	
					  'dataZoom': (zoom)=>{
						  //mutate state directly for smoother experience;
						  return this.state.option.dataZoom =({start:zoom.start,end:zoom.end});
						}
				  }}
				   />
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
							<td>{(this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 * this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) > 0.0001 && (this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1) < this.state.balance.bittrex[this.state.tradingPairs.misc] && (this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 *  this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.btc && (this.state.tradingPairs.bittrex.usdt_btc * this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 *  this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.usdt? <Switch checked={true}/> : <Switch checked={false}/>}</td>
						</TableRow>
						<TableRow>
							<td>BTC</td>
							<td  className="td_input"> <Input step={1} type="number" max={100} min={0} value={this.state.percentage2 * 100} onChange={this.updatePercentage2} /> </td>
							<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]).toFixed(5) : ""}</td>						
							<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex.btc * this.state.percentage2).toFixed(5) : 0}</td>
							<td>{this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] ? (this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] * this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]).toFixed(5) : ""}</td>
							<td>{(this.state.balance.bittrex.btc * this.state.percentage2) > 0.0001 &&	(this.state.balance.bittrex.btc * this.state.percentage2) < this.state.balance.bittrex.btc && (this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex[this.state.tradingPairs.misc] && (this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] * this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.usdt ?<Switch checked={true}/> :  <Switch checked={false}/>}</td>					
						</TableRow>		
					</TableBody>
					</Table> 	
			</TabContainer>}
			{this.state.tabValue === 1 && <TabContainer>
			<ReactEchartsCore
				  echarts={echarts}
				  option={this.state.binanceGauge}
				  style={{height: this.state.chartSize.height*1.3+'px', width:'100%'}}
				   />	
			{this.state.binanceStatus ? <Button raised color="primary">Arbitrage In Progress</Button>: ""}
			{this.state.binanceProgress > 0 ? <LinearProgress mode="determinate" value={this.state.binanceProgress*100/3} /> : ""}
			<div className="monitorToggle">
			<FormGroup>
		        <FormControlLabel
				  label={!this.state.binanceStatus ? "Active" : "Paused"}
				  style={{margin:"auto"}}
		          control={<Switch
			              checked={!this.state.binanceStatus}
			              onChange={(event, checked) => {
							  this.forceMonitorBinance(!checked)
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
						<th data-field="">{this.state.binanceC1 ? this.state.binanceC1.toUpperCase() : ""}/Ratio</th>
						<th data-field="">BTC/Ratio</th>
						<th data-field="">&#8224;BTC</th>
						<th data-field="">&#8224;{this.state.binanceC2.toUpperCase()}</th>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<td>{this.state.binanceC1 ? this.state.binanceC1.toUpperCase() : ""}</td>	
						<td>{this.state.balance.binance[this.state.binanceC1]}</td>	
						<td>100%</td>				
						<td>{this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] ? (this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] * this.state.balance.binance[this.state.binanceC1]*100/this.state.balance.binance.btc).toFixed(2)+'%' : ""}</td>
						<td>{this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] ? this.state.tradingPairs.binance[this.state.binanceC1+'_btc'].toFixed(7) : ""}</td>
						<td>{this.state.tradingPairs.binance[this.state.binanceC1+'_'+this.state.binanceC2] ? this.state.tradingPairs.binance[this.state.binanceC1+'_'+this.state.binanceC2].toFixed(1) : ""}</td>
					</TableRow>
					<TableRow>
						<td>BTC</td>	
						<td>{this.state.balance.binance.btc}</td>
						<td>{this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] ? (this.state.balance.binance.btc/this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] *100/this.state.balance.binance[this.state.binanceC1]).toFixed(2)+'%' : ""}</td>
						<td>100%</td>
						<td>1</td>
						<td>{this.state.tradingPairs.binance['btc_'+this.state.binanceC2] ? this.state.tradingPairs.binance['btc_'+this.state.binanceC2].toFixed(1) : "" }</td>
					</TableRow>
					<TableRow>
						<td>USDT</td>
						<td>{this.state.balance.binance.usdt ? this.state.balance.binance.usdt.toFixed(7) : 0}</td>
						<td>{this.state.tradingPairs.binance[this.state.binanceC1+'_'+this.state.binanceC2] ? (100*((this.state.balance.binance.usdt/this.state.tradingPairs.binance[this.state.binanceC1+'_'+this.state.binanceC2])/this.state.balance.binance[this.state.binanceC1])).toFixed(2)+ '%' : ""}</td>
						<td>{this.state.tradingPairs.binance['btc_'+this.state.binanceC2] ? (100*((this.state.balance.binance.usdt/this.state.tradingPairs.binance['btc_'+this.state.binanceC2])/this.state.balance.binance.btc)).toFixed(2)+ '%' : ""}</td>						
						<td>{this.state.tradingPairs.binance['btc_'+this.state.binanceC2] ? (1/this.state.tradingPairs.binance['btc_'+this.state.binanceC2]).toFixed(7) : "" }</td>
						<td>1</td>
					</TableRow>										
				</TableBody>
			</Table> 
			<Table>
				<TableHead>
					<TableRow>
						<th data-field="">Trade</th>
						<th data-field="">$</th>
						<th data-field="">{this.state.binanceC1 ? this.state.binanceC1.toUpperCase() : ""}</th>
						<th data-field="">BTC</th>
						<th data-field="">{this.state.binanceC2.toUpperCase()}</th>
						<th data-field="">Status</th>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<td>BTC</td>
						<td className="td_input"> <Input type="number" inputProps={{min: "0",step: "0.000001"}} value={this.state.binanceBTCMinimum} onChange={this.updateBinanceBTCMinimum} /> </td>
						<td>{this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] ? (1/this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] * this.state.binanceBTCMinimum).toFixed(5) : 0}</td>
						<td>{this.state.binanceBTCMinimum ? this.state.binanceBTCMinimum : 0}</td>						
						<td>{this.state.tradingPairs.binance['btc_'+this.state.binanceC2] ? (this.state.tradingPairs.binance['btc_'+this.state.binanceC2] * this.state.binanceBTCMinimum).toFixed(5) : 0}</td>
						<td>{(this.state.binanceBTCMinimum < this.state.balance.binance.btc) && ((1/this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] * this.state.binanceBTCMinimum) < this.state.balance.binance[this.state.binanceC1]) && ((this.state.tradingPairs.binance['btc_'+this.state.binanceC2] * this.state.binanceBTCMinimum) < this.state.balance.binance[this.state.binanceC2]) ? <Switch checked={true}/> :  <Switch checked={false}/>}</td>	
					</TableRow>		
					<TableRow>
						<td>{this.state.binanceC1 ? this.state.binanceC1.toUpperCase() : ""}</td>
						<td  className="td_input"> <Input type="number" inputProps={{min: "0",step: "0.001"}} value={this.state.binanceC1Minimum} onChange={this.updateBinanceC1Minimum} /> </td>
						<td>{this.state.binanceC1Minimum ? this.state.binanceC1Minimum : 0}</td>						
						<td>{this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] ? (this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] * this.state.binanceC1Minimum).toFixed(5) : 0}</td>
						<td>{this.state.tradingPairs.binance[this.state.binanceC1+'_'+this.state.binanceC2] ? (this.state.tradingPairs.binance[this.state.binanceC1+'_'+this.state.binanceC2] * this.state.binanceC1Minimum).toFixed(5) : ""}</td>
						<td>{(this.state.binanceC1Minimum < this.state.balance.binance[this.state.binanceC1]) &&	 ((this.state.tradingPairs.binance[this.state.binanceC1+'_btc'] * this.state.binanceC1Minimum) < this.state.balance.binance.btc) &&((this.state.tradingPairs.binance[this.state.binanceC1+'_'+this.state.binanceC2] * this.state.binanceC1Minimum) < this.state.balance.binance[this.state.binanceC2])? <Switch checked={true}/> :  <Switch checked={false}/>}</td>	
					</TableRow>		
				</TableBody>
			</Table> 				
			</TabContainer>}
			{this.state.tabValue === 2 && <TabContainer>
			   <Button raised color="primary" onClick={this.getBittrexDBTrade}>Generate Trading Statistics</Button>
			   <h3>Bittrex</h3>
			  <div>
				{this.state.bittrexProfit.btc ? this.state.bittrexProfit.btc.toFixed(8) : 0}/{this.state.balance.bittrex.btc} btc ({this.state.bittrexProfit.btc > 0 ?  (this.state.bittrexProfit.btc * 100/this.state.balance.bittrex.btc).toFixed(8) :  0.00000000})%
				<LinearProgress mode="determinate" value={this.state.bittrexProfit.btc ?  this.state.bittrexProfit.btc * 100/this.state.balance.bittrex.btc : 0} />
			  </div>
			  <div>
				{this.state.bittrexProfit[this.state.tradingPairs.misc] ? this.state.bittrexProfit[this.state.tradingPairs.misc].toFixed(8) : 0}/{this.state.balance.bittrex[this.state.tradingPairs.misc]} {this.state.tradingPairs.misc} ({this.state.bittrexProfit[this.state.tradingPairs.misc] ? (this.state.bittrexProfit[this.state.tradingPairs.misc]*100/this.state.balance.bittrex[this.state.tradingPairs.misc]).toFixed(8) : 0.00000000})%
				<LinearProgress mode="determinate" value={this.state.bittrexProfit[this.state.tradingPairs.misc] ?  this.state.bittrexProfit[this.state.tradingPairs.misc]*100/this.state.balance.bittrex[this.state.tradingPairs.misc]: 0} />
			  </div>			   
				 <ReactEchartsCore
		          echarts={echarts}
				  option={this.state.dbTrade}
				  style={{height: this.state.chartSize.height+'px', width:'97%'}}
				  notMerge={true}
				  lazyUpdate={true}
				  onEvents={{
					  'legendselectchanged':(evt)=>{
						 return this.state.dbTrade.legend.selected = evt.selected;
						 },	
					  'dataZoom': (zoom)=>{
						  //mutate state directly for smoother experience;
						  return this.state.dbTrade.dataZoom =({start:zoom.start,end:zoom.end});
						}
				  }}
				   />	
				  <h3>Binance</h3>  
				  <div>
					{this.state.binanceProfit.btc ? this.state.binanceProfit.btc.toFixed(8) : 0}/{this.state.balance.binance.btc} btc ({this.state.binanceBTCMinimum > 0 ?  (this.state.binanceProfit.btc * 100/this.state.balance.binance.btc).toFixed(8) : 0.00000000})%
					<LinearProgress mode="determinate" value={this.state.binanceProfit.btc ?  this.state.binanceProfit.btc * 100/this.state.balance.binance.btc : 0} />
				  </div>
				  <div>
					{this.state.binanceProfit[this.state.binanceC1] ? this.state.binanceProfit[this.state.binanceC1].toFixed(8) : 0}/{this.state.balance.binance[this.state.binanceC1]} {this.state.binanceC1} ({this.state.binanceProfit[this.state.binanceC1] ? (this.state.binanceProfit[this.state.binanceC1]*100/this.state.balance.binance[this.state.binanceC1]).toFixed(8) : 0.00000000})%
					<LinearProgress mode="determinate" value={this.state.binanceProfit[this.state.binanceC1] ?  this.state.binanceProfit[this.state.binanceC1]*100/this.state.balance.binance[this.state.binanceC1]: 0} />
				  </div>
				  <ReactEchartsCore
			          echarts={echarts}
					  option={this.state.dbTradeBinance}
					  style={{height: this.state.chartSize.height+'px', width:'97%'}}
					  notMerge={true}
					  lazyUpdate={true}
					  onEvents={{
						  'legendselectchanged':(evt)=>{
							 return this.state.dbTradeBinance.legend.selected = evt.selected;
							 },	
						  'dataZoom': (zoom)=>{
							  return this.state.dbTradeBinance.dataZoom =({start:zoom.start,end:zoom.end});
							}
					  }}
				    />					     			
			</TabContainer>}
			{this.state.tabValue === 3 && <TabContainer>
				<Button raised color="primary" onClick={this.clearOrders}>Clear Cache</Button>
				<Button raised color="primary" onClick={this.getOrders}>Retrieve Orders</Button>
				{this.state.orders.map((order)=> 
					<Card key={order.order_id} raised style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
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
						<LinearProgress mode="determinate" value={ order.filled > 0? ((order.amount-order.filled)/order.amount)*100 : 0} />					
						{ order.filled > 0? (((order.amount-order.filled)/order.amount)*100).toFixed(2) +'% Filled' : '0% Filled'}
			        </CardContent>
			      </Card>)}		
			</TabContainer>}
			{this.state.tabValue === 4 && <TabContainer>
				<textarea value={this.state.log} readOnly> </textarea>		
			</TabContainer>}
			{this.state.tabValue === 5 && <TabContainer>
				<div>
				{this.state.swingOrder.order && <Card key={this.state.swingOrder.order.OrderUuid} raised style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
			        <CardContent>
			           <Typography type="headline">Previous Trade</Typography>
						<Typography component="p">
						{this.state.swingOrder.order.Type} {this.state.swingOrder.order.Exchange}
						<br/>{this.state.swingOrder.order.Quantity} @ {this.state.swingOrder.order.Limit}
						<br/>Created:{this.state.swingOrder.order.Opened}
						<br/>{this.state.swingOrder.order.OrderUuid}
						</Typography>
						<LinearProgress mode="determinate" value={ this.state.swingOrder.order.QuantityRemaining >= 0? ((this.state.swingOrder.order.Quantity-this.state.swingOrder.order.QuantityRemaining)/this.state.swingOrder.order.Quantity)*100 : 0} />					
						{ this.state.swingOrder.order.QuantityRemaining >= 0? (((this.state.swingOrder.order.Quantity-this.state.swingOrder.order.QuantityRemaining)/this.state.swingOrder.order.Quantity)*100).toFixed(2) +'% Filled' : '0% Filled'}
			        </CardContent>
			      </Card>}
				<ReactEchartsCore
				  echarts={echarts}
				  option={this.state.swingGauge}
				  style={{height: this.state.chartSize.height*1.1+'px', width:'100%'}}
				   />
				<Card raised style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
					{this.state.swingOrder.order && <CardContent>
						<Typography type="headline">Next Trade</Typography>
						{this.state.swingOrder.order.Type === "LIMIT_SELL" ? "LIMIT_BUY" : "LIMIT_SELL"} {this.state.swingOrder.order.Exchange}
						<br/>{this.state.swingOrder.order.Quantity} @ {this.state.swingOrder.order.Type === "LIMIT_SELL" ? this.state.swingOrder.order.Limit * (1-(this.state.swingPercentage/100)) : this.state.swingOrder.order.Limit * (1+(this.state.swingPercentage/100))}
					</CardContent>}
				</Card>
				</div>		
			</TabContainer>}
			{this.state.tabValue === 6 && <TabContainer>		
				<Card raised style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}}>
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
				<Card raised style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
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
						<Button raised color="primary" onClick={this.get_poll_rate}>Get Bot Polling Rate</Button>	
			        </CardActions>
				</Card> 		    
				<Card raised style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
			        <CardContent>
			            <Typography type="title">Binance Config</Typography>
			            <br/>
						 <div className="Switches">
						<FormGroup>
				        <FormControlLabel
						  label="Liquid Trades"
						  style={{margin:"auto"}}
				          control={<Switch
					              checked={this.state.liquidTradesBinance}
					              onChange={this.updateLiquidTradeBinance}
				            /> }
				        />
				        </FormGroup>
				        </div>
						<InputLabel>Minimum BTC Order</InputLabel>
						<br/>
						<Input type="number" inputProps={{min: "0",step: "0.000001" }} value={this.state.binanceBTCMinimum} onChange={this.updateBinanceBTCMinimum}/>
						<br/>
						<InputLabel>Minimum {this.state.binanceC1.toUpperCase()} Order</InputLabel>
						<br/>
						<Input type="number" inputProps={{min: "0",step: "0.001" }} value={this.state.binanceC1Minimum} onChange={this.updateBinanceC1Minimum}/>			       					
			        </CardContent>
				</Card> 		    				  
				<Card raised style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
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
						<Button raised color="primary" onClick={this.updateBittrexBalance}>Get Balance</Button>			
			        </CardActions>
				</Card>
				<Card raised style={{maxWidth:"97%",margin:"0.8em",backgroundColor:""}} >
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
						<Button raised color="primary" onClick={this.updateBinanceBalance}>Get Balance</Button>			
			        </CardActions>
				</Card>				
				<footer>
					<div>
						MaterialUI theme provided by <a href='https://github.com/callemall/material-ui/tree/v1-beta'>Material-UI</a>
					</div>
				    <div>Favicon made by <a rel="noopener noreferrer" href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
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
		          onRequestClose={this.menuClose}
		          PaperProps={{
		            style: {
		              maxHeight: 48 * 4.5,
		              width: 200,
		            },
		          }}
		        >
		       {this.state.previous.map(option => (
		            <MenuItem key={option} selected={this.state.previous.length > 1 ? option === this.state.previous[1] : false} onClick={()=>{this.connect(option)}}>
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
