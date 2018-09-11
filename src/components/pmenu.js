import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

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

export default PMenu;
	
