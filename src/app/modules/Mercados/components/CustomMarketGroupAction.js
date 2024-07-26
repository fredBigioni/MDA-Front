import React from 'react';
import { FormattedMessage } from "react-intl";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CustomMarketGroupDialog from './CustomMarketGroupDialog'
import CustomMarketGroupDelete from './CustomMarketGroupDelete'

export default function CustomMarketGroupAction(props) {
	const { customMarketGroup, customMarketGroups } = props;
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [openDialog, setOpenDialog] = React.useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
	const [customMarketGroupSelected, setCustomMarketGroupSelected] = React.useState(null);
	const openMenu = Boolean(anchorEl);  
	const ITEM_HEIGHT = 48;

	const handleOpenMenu = (event) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = (event) => {
		setAnchorEl(null);
	};  

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setOpenDeleteDialog(false);
	};    

	const handleOpenCreateDialog = (event) => {
		handleCloseMenu()
		setCustomMarketGroupSelected(null)
		setOpenDialog(true);
	};

	const handleOpenEditDialog = (event) => {
		handleCloseMenu()
		let customMarketGroupSelected = customMarketGroups.data.filter(x => x.code == customMarketGroup)
		setCustomMarketGroupSelected(customMarketGroupSelected[0])
		setOpenDialog(true);
	};

	const hasCustomMarketDetail = () => {
		return customMarketGroups.data.filter(x => x.code == customMarketGroup) > 0	
	}

	const handleOpenDeleteDialog = (event) => {
		handleCloseMenu()
		let customMarketGroupSelected = customMarketGroups.data.filter(x => x.code == customMarketGroup)
		setCustomMarketGroupSelected(customMarketGroupSelected[0])
		setOpenDeleteDialog(true);
	};	

    return ( 
		<>        
			<IconButton aria-label="" onClick={handleOpenMenu} color="primary">
				<MoreVertIcon style={{fontSize: '1.5rem'}}/>
			</IconButton>
			<Menu
				id="customMarketGroupMenu"
				anchorEl={anchorEl}
				keepMounted
				open={openMenu}
				onClose={handleCloseMenu}
				PaperProps={{
					style: {
						maxHeight: ITEM_HEIGHT * 4.5,
						width: '24ch',
					},
				}}
				>
				{/* <MenuItem key='menuItemCreateGroup' onClick={handleOpenCreateDialog}>
					<FormattedMessage id="CUSTOM_MARKET_GROUP_ACTION.CREATE" />
				</MenuItem> */}
				<MenuItem key='menuItemEditGroup' onClick={handleOpenEditDialog} disabled={customMarketGroup == -1} >
					<FormattedMessage id="CUSTOM_MARKET_GROUP_ACTION.EDIT" />
				</MenuItem>
				<MenuItem key='menuItemDeleteGroup' onClick={handleOpenDeleteDialog} disabled={customMarketGroup == -1 && hasCustomMarketDetail()} >
					<FormattedMessage id="CUSTOM_MARKET_GROUP_ACTION.DELETE" />
				</MenuItem>				                       
			</Menu>
			<CustomMarketGroupDialog open={openDialog} handleClose={handleCloseDialog} customMarketGroupSelected={customMarketGroupSelected}/>    
			<CustomMarketGroupDelete open={openDeleteDialog} handleClose={handleCloseDialog} customMarketGroupSelected={customMarketGroupSelected}/>    
		</>
    )
}