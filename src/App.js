import React, { Component } from 'react';
import './App.css';
import AES from "crypto-js/aes";
import Enc from 'crypto-js/enc-utf8';
import Typography from 'material-ui/Typography';
import AppBar  from 'material-ui/AppBar';
import AutoRenew from 'material-ui-icons/Autorenew';
import Button from 'material-ui/Button';
import BubbleChart from 'material-ui-icons/BubbleChart';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { FormControl,FormControlLabel, FormGroup } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel } from 'material-ui/Input';
import InsertChart from 'material-ui-icons/Dashboard';
import InsertSettings from 'material-ui-icons/Settings';
import InsertFile from 'material-ui-icons/ShopTwo';
import InsertLogs from 'material-ui-icons/LibraryBooks';
import { LinearProgress } from 'material-ui/Progress';
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

function balanceMinMax(_array){
	var _min = 0;
	var _max = 0;
	for(var i = 0;i < _array.length;i++)
		{
			if(_array[i][1] < _min || _min === 0){_min = _array[i][1];}
			if(_array[i][1] > _max || _max === 0){_max = _array[i][1];}
		}
	return [_min,_max];
}
			
function TabContainer(props) {
	return <div style={{ padding: 1 * 3 }}>{props.children}</div>;
}
			
function slope(array,_points,name){
	function minmax(_array){
		var _min = [0,0];
		var _max = [0,0];
		for(var i = 0;i < _array.length;i++)
			{
				if(_array[i][0] < _min[0] || _min[0] === 0){_min = _array[i];}
				if(_array[i][0] > _max[0] || _max[0] === 0){_max = _array[i];}
			}
		return [{x:_min[0],y:_min[1]},{x:_max[0],y:_max[1]}];
		
	}
	let line = {lineStyle:{normal:{type:'solid'}}};	
	if(!_points){
		if(!array){return [];}
		let detmm = minmax(array);
		let coord1 = detmm[0];
		let coord2 = detmm[1];
		let m = (coord2.y-coord1.y)/(coord2.x - coord1.x);
		let b = coord1.y - (m * coord1.x);
		line.label= {
	        normal: {
				show:true,
				formatter: 'y = '+m.toFixed(3)+' * x + '+b.toFixed(3)+'\r\n Break Even >= '+(m+b)+'%',
	            textStyle: {
					align: m < 0 ? "right":"left",
					verticalAlign:m < 0 ? "top":"top"
	            }
	        }
		}
		line.data=[
			[{
				coord: [1.000001, m*(1.000001)+b],
			    symbol: 'none'
			 },{
			    coord: [coord2.x*1.000001,m*(coord2.x*1.000001)+b],
			    symbol: 'none'
			}]
		]
		return line;
	}
	else{
		console.log(_points)
		let points = JSON.parse(JSON.stringify(_points));
		points.map((v,i)=>{
			return points[i] =[0,points[i].value[1]]
		});
		let r = (Math.log(points[points.length-1][1]/points[0][1]))/(points.length-2);
		let data = [];			
		for(let i=0;i<points.length;i++){
			data.push([points[i][0],(points[0][1] * Math.pow(Math.E,(r*i))).toFixed(7)])
		}
		line.smooth = true;
		line.data = data;
		line.type = "line"
		line.name ="Projection -"+name;
		line.text = 'P = '+points[0][1]+'e^('+r.toFixed(10)+'t) \r\nGained:'+ (points[points.length-1][1] - points[0][1]).toFixed(12) +"("+ (100*(points[points.length-1][1] -points[0][1])/points[0][1]).toFixed(8) + "%)";
	}			
	return line;
}
	
class App extends Component{
	constructor(props){
	    super(props);
	    this.state = {
			anch_menu:null,
			autoconnect: localStorage.getItem("AutoConnect") ? JSON.parse(localStorage.getItem("AutoConnect")) : false,
			autosave: JSON.parse(localStorage.getItem("Autosave")) ? true : false,
			balance:JSON.parse(localStorage.getItem("Bittrex_Balance")) ? JSON.parse(localStorage.getItem("Bittrex_Balance")):{bittrex:{account:"Bittrex"}},
			bittrexPercentage:0,
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
			dbBalance:JSON.parse(localStorage.getItem("DB_Balance"))? JSON.parse(localStorage.getItem("DB_Balance")) : [],
			dbTrade:JSON.parse(localStorage.getItem("DB_Trade"))? JSON.parse(localStorage.getItem("DB_Trade")) : {
				xAxis:{type:'time'},
				yAxis:{type:'value'}
			},
			cleared:false,
			chartSize:{
				width:document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth *0.9 : 1000,
				height:document.documentElement.clientHeight > 0 ? document.documentElement.clientHeight/1.9 : 500,
			},				
			connected:false,
			loading:0,
			log:"",
			menuAnchor: null,
			menu_open:false,
			myWorker:{},
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
			socketMessage:function(){},
			swingGauge:{},
			swingOrder:{},
			tabValue:0,
			toast:{
				open:false,
				message:""
			},	
			time:0,			
			tradingPairs:JSON.parse(localStorage.getItem("Trading_Pairs"))? JSON.parse(localStorage.getItem("Trading_Pairs")) : {bittrex:{}},
			webNotify: JSON.parse(localStorage.getItem("Web_Notify")) ? true : false,
			websocketNetwork:"localhost",
		}
		this.changeTab = this.changeTab.bind(this);	
		this.clearData = this.clearData.bind(this);
		this.clearOrders = this.clearOrders.bind(this);
		this.connect = this.connect.bind(this);		
		this.getBittrexDBBalance = this.getBittrexDBBalance.bind(this);
		this.getBittrexDBTrade = this.getBittrexDBTrade.bind(this);
		this.getOrders = this.getOrders.bind(this);
		this.getPollingRate = this.getPollingRate.bind(this);
		this.menuClose = this.menuClose.bind(this);
		this.menuOpen = this.menuOpen.bind(this);
		this.updateBittrexBalance = this.updateBittrexBalance.bind(this);
		this.updateNetwork = this.updateNetwork.bind(this);
		this.updatePkey = this.updatePkey.bind(this);	
		this.updatePercentage1 = this.updatePercentage1.bind(this);	
		this.updatePercentage2 = this.updatePercentage2.bind(this);	
		this.updatePollingRate = this.updatePollingRate.bind(this);	
		this.updatePort = this.updatePort.bind(this);	
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
		let list = ["AutoConnect","Autosave","Bittrex_Balance","DB_Balance","Orders","Previous_Connections","Trading_Pairs","xxpkeyxx"];
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
		let blob = new Blob(["onmessage = function(e) { return setTimeout(()=>{ return postMessage('')},2000) }"]);			
		let blobURL = window.URL.createObjectURL(blob);
		let dataWorker = new Worker(blobURL);
		dataWorker.onmessage =(e)=> {
			this.setState({time:this.state.time+2000,loading:((this.state.time+2000)/this.state.pollingRate) * 100});
			return this.state.myWorker.postMessage("");
		};		
		this.setState({myWorker:dataWorker});
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
		
	getBittrexDBBalance(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"bittrex_db","db":"balance"}),this.state.privatekey).toString());
	}
	
	getBittrexDBHistory(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"bittrex_db","db":"history"}),this.state.privatekey).toString());
	}	
	
	getBittrexDBTrade(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"bittrex_db","db":"trade"}),this.state.privatekey).toString());
	}		
						
	getOrders(){
		this.clearOrders();
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
			return this.setState({balance:{bittrex:data.balance}},()=>{
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

		if(data.type === "db_balance"){
				let bank = {};
				let dbBalances = [];
				let coins = [];
				let date;
				let quick_format = function(x){return new Date(x).toString().split(" ").slice(0,3).join("\r\n");}
				let quick_format2 = function(params){params=params[0];return params.value[0].toString().split("GMT")[0]+" / "+params.value[1];}
				for(let key in data.info[0]){
					if(key !== 'Time' && key !== '_id'){
						coins.push(key);
						bank[key]= [];
					}
				}
				for(let k=0;k<data.info.length;k++){
					date = data.info[k].Time;
					for(let i= 0;i < coins.length;i++){
						try{
							if(Number(data.info[k][coins[i]].toFixed(8)) !== bank[coins[i]][ bank[coins[i]].length  -1].value[1]){
								bank[coins[i]].push({value:[new Date(date),Number(data.info[k][coins[i]].toFixed(8))],name:date.toString()});
							}
						}
						catch(e){
							bank[coins[i]].push({value:[new Date(date),Number(data.info[k][coins[i]].toFixed(8))],name:date.toString()});
						}
					}
				}
				let format = function(obj,dataArray,name){
					obj.legend = {data:[name,"Projection -"+name]}  
					obj.yAxis = [{min:"dataMin",max:"dataMax"}];
					obj.xAxis = [{type:"time",min:"dataMin",max:"dataMax",axisLabel:{formatter:quick_format}}];
					obj.tooltip = {trigger:"axis",formatter:quick_format2}
					obj.grid =  {left:"1%",right:"1%",bottom:'7%',containLabel:true}
					let proj = slope(null,dataArray,name);
					obj.series = [{smooth:true,name:name,type:'line',data:dataArray}];
					obj.title = {textStyle:{fontSize:13},text:proj.text,top:'5.5%',left:"30%"}
					obj.range = balanceMinMax(dataArray);
					obj.dataZoom=[{realtime:true,show:true,start:80,end:100}];
					obj.value = obj.range[0];
					obj.maxvalue = obj.range[1];
					obj.base = dataArray;
					return obj;
				}
				let extraOption = {				    
				    xAxis: {
						animation:true,
				        type: 'time',   
						axisPointer: {
				            snap: true,
				            lineStyle: {
				                color:'#004E52',
				                opacity: 0.5,
				                width: 2
				            },
				            label: {
				                show: true,
				                formatter:function(f){
									return new Date(f.value);
								},
				                backgroundColor:'#004E52'
				            },
				            handle: {
				                show: true,
				                color:'#004E52'
				            }
				        },
				        splitLine: {
				            show: false
				        }
				    },
				    yAxis: {
				        type: 'value',
				        axisTick: {
				            inside: true
				        },
				        splitLine: {
				            show: false
				        },
				        axisLabel: {
				            inside: true,
				            formatter: '{value}\n'
				        },
				    },
				    series: [{name:" ",type:"line"}]
				}	
				for(let j=0; j<coins.length;j++){
					dbBalances.push(format(JSON.parse(JSON.stringify(extraOption)),bank[coins[j]],coins[j]));
				}
				if(this.state.autosave){
					localStorage.setItem("DB_Balance",JSON.stringify(dbBalances));
				}
				return this.setState({dbBalance:dbBalances});
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
			let date;
			let v = [];
			let dat = {}
			for(let k=0;k<data.info.length;k++){
				date = new Date(data.info[k].Time).toISOString().split("T")[0];
				if(dat[date]){
					dat[date]++;
				}
				else{
					dat[date]=1;
				}
			}
			for(let key in dat){
				v.push({value:[key,dat[key]],name:key})
			}
			let option = {
					animation:false,
		            dataZoom:[
				            {
				            show: true,
				            realtime: true,
				            start: 0,
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
		            grid: {
						top:'2%',
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
							lineStyle:{normal:{width:4.5}},
							animationDuration:4000,
							animationEasing: 'CubicOut',
		                    name:'Trades',
		                    type:'line',
		                    smooth:'true',
		                    data:v,
		                },
		            ]
		        }			
			if(this.state.autosave){
					localStorage.setItem("DB_Trade",JSON.stringify(option));
			}
			return this.setState({dbTrade:option});
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
				let lastTime = new Date().getTime() - dates[dates.length-1];
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
				this.setState({time:lastTime,option:option,bittrexPercentage:_bittrexPercentage});
				return this.tick()
			}
			catch(e){
				console.log(e)
				return this.toast(e);
			}
		}	
			
		if(data.type === "log"){
			this.setState({log:data.log+'\r\n<----------->\r\n'+this.state.log+'\r\n'});
			if(this.state.loading === 0){
				return this.tick();
			}
			else{
				return this.setState({time:0});
			}
		}	
			
		if(data.type === "order"){
			let _new_orders = this.state.orders;
			_new_orders.push({"filled":data.filled,"order_id":data.order_id,"type":data.otype,"amount":data.amount,"pair":data.pair,"status":data.status,"rate":data.rate,"timestamp_created":data.timestamp_created});
			if(this.state.autosave){
				localStorage.setItem("Orders",JSON.stringify(_new_orders));
			}
			return this.setState({order:_new_orders});
		}		
			
		if(data.type === "percentage"){
			let _tradingPairs = {bittrex:{}}
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
					formatter: "{a} <br/>{b} : {c}"
				},
				series:[{
						axisLine:{
							lineStyle:{
								width:10
							}
						},
						radius:"80%",
						name:"Swing Trade",
						type: 'gauge',
						title : {
			                fontWeight: 'bolder',
			                fontSize: 20,
			                fontStyle: 'italic'
			            },
						min: data.target > data.price ? data.target/2 : data.target,
						max:data.target > data.price ? data.target : data.price,
						detail: {formatter:"Current "+data.trade+"\r\n{value}"},
						data: [{value: data.price, name: "Target Price:"+data.target}]
					}]
			}
			this.setState({swingGauge:gauge});
		}	
		if (data.type === "swingStatus"){
			let gauge = {
				series:[{
						type:"gauge",
						data: [{name: "Loading",value:0}]
					}]
			}
			if(data.order && data.on === true){
				data.order.swing = data.swing;
				this.setState({swingGauge:gauge,swingOrder:data.order});
			}		
		}																									
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
	socketMessage(message){
		
	}
	
	tick(){
		return this.state.myWorker.postMessage("");
	}		

	toast(message){
		if(this.state.toast.open === false){	
			this.setState({toast:{message:message,open:true}});
		}
		else{
			if(message === this.state.toast.message){
				return;
			}
			this.setState({toast:{message:message+'\r\n'+this.state.toast.message,open:true}});
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
			
	updateBittrexBalance(){
		return this.state.socketMessage(AES.encrypt(JSON.stringify({"command":"bittrex_balance"}),this.state.privatekey).toString());
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
			console.log(e);
		}
		if(document.hasFocus()){
			setTimeout(()=>{this.updateSwingPrice()},10000);
			return req.send();
		} 
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
			 <LinearProgress mode="determinate" value={this.state.loading} />
			<Tabs value={this.state.tabValue} onChange={this.changeTab} centered fullWidth>	
				<Tab label={this.state.bittrexPercentage ? this.state.bittrexPercentage.toFixed(2) : 0} icon={<InsertChart />}></Tab>
				<Tab label="Charts" icon={<BubbleChart />}></Tab>
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
							<td>{(this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 * this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) > 0.0005 && (this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1) < this.state.balance.bittrex[this.state.tradingPairs.misc] && (this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 *  this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.btc && (this.state.tradingPairs.bittrex.usdt_btc * this.state.balance.bittrex[this.state.tradingPairs.misc] * this.state.percentage1 *  this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.usdt? <Switch checked={true}/> : <Switch checked={false}/>}</td>
						</TableRow>
						<TableRow>
							<td>BTC</td>
							<td  className="td_input"> <Input step={1} type="number" max={100} min={0} value={this.state.percentage2 * 100} onChange={this.updatePercentage2} /> </td>
							<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]).toFixed(5) : ""}</td>						
							<td>{this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc] ? (this.state.balance.bittrex.btc * this.state.percentage2).toFixed(5) : 0}</td>
							<td>{this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] ? (this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] * this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]).toFixed(5) : ""}</td>
							<td>{(this.state.balance.bittrex.btc * this.state.percentage2) > 0.0005 &&	(this.state.balance.bittrex.btc * this.state.percentage2) < this.state.balance.bittrex.btc && (this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex[this.state.tradingPairs.misc] && (this.state.tradingPairs.bittrex['usdt_'+this.state.tradingPairs.misc] * this.state.balance.bittrex.btc * this.state.percentage2 / this.state.tradingPairs.bittrex['btc_'+this.state.tradingPairs.misc]) < this.state.balance.bittrex.usdt ?<Switch checked={true}/> :  <Switch checked={false}/>}</td>					
						</TableRow>		
					</TableBody>
					</Table> 	
			</TabContainer>}
			{this.state.tabValue === 1 && <TabContainer>
			   <Button raised color="primary" onClick={this.getBittrexDBBalance}>Generate Balance Charts</Button>
			   {this.state.dbBalance.map((option) => (
				 <div key={option.series[0].name}>
		         <ReactEchartsCore
		          echarts={echarts}
				  option={option}
				  style={{height: this.state.chartSize.height+'px', width:'100%'}}
				  notMerge={true}
				  lazyUpdate={true}
				  onEvents={{
					  'dataZoom': (zoom)=>{
					   return option.dataZoom = ({start:zoom.start,end:zoom.end});
						}
				  }}
				   />	
				   </div>
				))} 
				<Button raised color="accent" onClick={this.getBittrexDBTrade}>Generate Trade Chart</Button>   	
				 <ReactEchartsCore
		          echarts={echarts}
				  option={this.state.dbTrade}
				  style={{height: this.state.chartSize.height+'px', width:'100%'}}
				  notMerge={true}
				  lazyUpdate={true}
				  onEvents={{
					  'dataZoom': (zoom)=>{
						  //mutate state directly for smoother experience;
						  return this.state.dbTrade.dataZoom =({start:zoom.start,end:zoom.end});
						}
				  }}
				   />	   	   			
			</TabContainer>}
			{this.state.tabValue === 2 && <TabContainer>
				<Button raised color="primary" onClick={this.clearOrders}>Clear Cache</Button>
				<Button raised color="primary" onClick={this.getOrders}>Retrieve Orders</Button>
				{this.state.orders.map((order)=> 
					<Card key={order.order_id} raised style={{maxWidth:"95%",margin:"1em",backgroundColor:""}}>
			        <CardContent>
			           <Typography type="headline">{order.type}</Typography>
						<Typography component="p">
						{order.pair.replace('_','/')}
						<br/>{order.amount} @ {order.rate}
						<br/>Created:{order.timestamp_created}
						<br/>{order.order_id}
						</Typography>
						<LinearProgress mode="determinate" value={ order.filled > 0? ((order.amount-order.filled)/order.amount)*100 : 0} />					
						{ order.filled > 0? (((order.amount-order.filled)/order.amount)*100).toFixed(2) +'% Filled' : '0% Filled'}
			        </CardContent>
			      </Card>)}		
			</TabContainer>}
			{this.state.tabValue === 3 && <TabContainer>
				<textarea value={this.state.log}> </textarea>		
			</TabContainer>}
			{this.state.tabValue === 4 && <TabContainer>
				<div>
				{this.state.swingOrder.order && <Card key={this.state.swingOrder.order.OrderUuid} raised style={{maxWidth:"95%",margin:"1em",backgroundColor:""}}>
			        <CardContent>
			           <Typography type="headline">Previous Trade</Typography>
						<Typography component="p">
						{this.state.swingOrder.order.Type} {this.state.swingOrder.order.Exchange}
						<br/>{this.state.swingOrder.order.Quantity} @ {this.state.swingOrder.order.PricePerUnit}
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
				<Card raised style={{maxWidth:"95%",margin:"1em",backgroundColor:""}}>
					{this.state.swingOrder.order && <CardContent>
						<Typography type="headline">Next Trade</Typography>
						{this.state.swingOrder.order.Type === "LIMIT_SELL" ? "LIMIT_BUY" : "LIMIT_SELL"} {this.state.swingOrder.order.Exchange}
						<br/>{this.state.swingOrder.order.Quantity} @ {this.state.swingOrder.order.Type === "LIMIT_SELL" ? this.state.swingOrder.order.Limit * (1+(this.state.swingOrder.swing/100)) : this.state.swingOrder.order.Limit * (1-(this.state.swingOrder.swing/100))}
					</CardContent>}
				</Card>
				</div>		
			</TabContainer>}
			{this.state.tabValue === 5 && <TabContainer>		
				<Card raised style={{maxWidth:"95%",margin:"1em",backgroundColor:""}}>
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
				  label="Notifications"
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
				<Card raised style={{maxWidth:"95%",margin:"1em",backgroundColor:""}} >
			        <CardContent>
			           <Typography type="title">Bot</Typography>
						<br/>
						<InputLabel>Polling Rate:{this.state.pollingRate/1000} Seconds </InputLabel>
						<br/>
						<input type="range" step={5} min={10} max={300} value={this.state.pollingRate/1000} onChange={this.updatePollingRate}/>
			        </CardContent>
			        <CardActions>
						<Button raised color="primary" onClick={this.get_poll_rate}>Get Poll Rate</Button>			
			        </CardActions>
				</Card> 		      
				<Card raised style={{maxWidth:"95%",margin:"1em",backgroundColor:""}} >
			        <CardContent>
						<Typography type="title">Bittrex Status</Typography>
						<br/>
						{this.state.orders? this.state.orders.length : ""} Orders Open 
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
											if(key !== "account")
												p.push([key.toString(),this.state.balance.bittrex[key]]);
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
				<footer>
					<div>
						MaterialUI theme provided by <a href='https://github.com/callemall/material-ui/tree/v1-beta'>Material-UI</a>
					</div>
				    <div>Favicon made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
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
