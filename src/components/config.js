import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';


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

export default Config;
