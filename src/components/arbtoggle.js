import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';
import Switch from '@material-ui/core/Switch';

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

export default ArbToggle;
