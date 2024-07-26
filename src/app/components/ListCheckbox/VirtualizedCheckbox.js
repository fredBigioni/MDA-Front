import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Checkboxes from './Checkboxes';

function getDistinctFast(items, key) {
  let unique = {};
  let distinct = [];
  for (let opt of items) {
    if (typeof unique[opt[key]] === 'undefined') {
      distinct.push(opt);
    }
    unique[opt[key]] = 0;
  }
  return distinct;
}

// Fast function to update items
// Use the fact that both arrays are sorted and have no duplicates
// and that all elements of the second array are present in the first array
function updateItems(base, items, labelKey) {
  let index = 0;
  for (let it of items) {
    while (base[index][labelKey] !== it[labelKey]) {
      index += 1;
    }
    base[index].checked = it.checked;
  }
  return base;
}

const FilterBar = ({ value, onChange, height, width, title, options, onSelectItemFromMenu, hasSelectedItems }) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onSelectOption = (action) => {
    onSelectItemFromMenu(action)
    handleClose();
  }
  
  /*const options = [
    'Asignar al mercado',
    'Crear grupo',
  ];*/
  const ITEM_HEIGHT = 48;

  return (
    <div style={{ height }}>
      <div style={{width: '80%'}}>
          <TextField 
            autoComplete="off"
            style={{width}}
            id="filter" 
            label={title} 
            variant="outlined"
            onChange={event => onChange(event.target.value)}
            value={value}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <div>
                  {options !== undefined && options.length > 0 &&
                    <>
                      <InputAdornment onClick={handleClick} style={{cursor:'pointer'}} position='end'>
                        <IconButton>
                          <MoreVertIcon />
                        </IconButton>
                      </InputAdornment>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '24ch',
                          },
                        }}
                      >
                        {options.map((option,key) => (
                          <MenuItem key={key} onClick={() => onSelectOption(option.action)} disabled={!hasSelectedItems}>
                            {option.title}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  }
                </div>
              )
            }}
          />
        </div>
  </div>
  )
}

const Footer = ({
  width,
  height,
  hasOkButton,
  hasCancelButton,
  onOk,
  onCancel
}) =>
  <div style={{ display: 'flex', width, height }}>
    {hasOkButton && <input type="button" value="Ok" onClick={onOk} />}
    {hasCancelButton &&
      <input type="button" value="Cancel" onClick={onCancel} />}
  </div>;

class VirtualizedCheckbox extends Component {
  static propTypes = {
    hasCancelButton: PropTypes.bool,
    hasFilterBox: PropTypes.bool,
    hasOkButton: PropTypes.bool,
    height: PropTypes.number,
    items: PropTypes.array,
    labelKey: PropTypes.string,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onOk: PropTypes.func,
    rowHeight: PropTypes.number,
    textFilter: PropTypes.string
  };

  static defaultProps = {
    hasOkButton: false,
    hasCancelButton: false,
    hasFilterBox: true,
    labelKey: 'value',
    onCancel: () => null,
    onChange: () => null,
    onOk: () => null,
    items: [],
    rowHeight: 35,
    textFilter: ''
  };

  constructor(props) {
    super(props);
    const { items: propsItems, labelKey, textFilter } = props;

    this.state = {
      items: [],
      filter: ''
    }
    if(this.props.items.length > 0) {
      const objectItems =
        typeof propsItems[0] === 'string'
          ? propsItems.map(item => ({ [labelKey]: item }))
          : propsItems;
      const items = getDistinctFast(objectItems, labelKey);
      this.state = {
        items,
        filter: textFilter
      };

    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(this.props.item !== nextProps.items) {
      this.setState({ items: nextProps.items})
    }
  }

  handleSelectAllChange = checked => {
    const items = this.getFilteredItems().map(it => ({ ...it, checked }));
    this.setState(prevState => ({
      items: updateItems(prevState.items, items, this.props.labelKey)
    }));
    let prepareItems = []
    items.map(itm => {
      if(itm.checked) {
        prepareItems.push(itm)
      }
    })
    this.props.onOk(prepareItems)
  };

  handleChange = eventTarget => {
    const index = this.state.items.findIndex(
      it => it[this.props.labelKey] === eventTarget[this.props.labelKey]
    );
    const items = [...this.state.items];
    items[index].checked = eventTarget.checked;
    this.setState(prevState => ({
      items
    }));
    if (this.props.onChange) {
      this.props.onChange(items[index]);
    }
    this.handleOkClick();
  };

  handleFilterChange = filter => {
    this.setState(() => ({
      filter
    }));
  };

  getFilteredItems = () => {
    const { items, filter } = this.state;
    return items.filter(
      it =>
        it[this.props.labelKey] &&
        it.label.toLowerCase().includes(filter.toLowerCase())
    );
  };

  handleOkClick = () => {
    const { items, filter } = this.state;
    const checkedItems = items.filter(i => i.checked);
    this.props.onOk(checkedItems, checkedItems.length === items.length, filter);
  };

  handleCancelClick = () => this.props.onCancel();
  
  hasSelectedItems = () => {
    return this.state.items.filter(i => i.checked).length
  }

  render() {
    const {
      rowHeight,
      hasOkButton,
      hasCancelButton,
      hasFilterBox,
      height,
      width: propWidth,
      title,
      options,
      onSelectItemFromMenu
    } = this.props;
    const hasFooter = hasOkButton || hasCancelButton;
    const virtualScrollHeight = h => {
      let i = 0;
      if (hasFooter) {
        i += 1;
      }
      if (hasFilterBox) {
        i += 1;
      }
      const actualHeight = height || h;
      return actualHeight - i * rowHeight;
    };
    
    return (
      <AutoSizer>
        {({ width, height }) =>
          <div>
            {hasFilterBox
              ? <FilterBar
                  value={this.state.filter}
                  onChange={this.handleFilterChange}
                  height={60}
                  width={propWidth || width}
                  title={title}
                  options={options}
                  hasSelectedItems={this.hasSelectedItems()}
                  onSelectItemFromMenu={onSelectItemFromMenu}
                />
              : null}
              {this.props.items.length > 0 &&
                <Checkboxes
                  height={virtualScrollHeight(height)}
                  width={propWidth || width}
                  items={this.getFilteredItems()}
                  labelKey={this.props.labelKey}
                  filtered={!!this.state.filter}
                  rowHeight={rowHeight}
                  onChange={this.handleChange}
                  onSelectAllChange={this.handleSelectAllChange}
                />
              }
            {hasFooter
              ? <Footer
                  onOk={this.handleOkClick}
                  onCancel={this.handleCancelClick}
                  width={propWidth || width}
                  height={rowHeight}
                  hasOkButton={false}
                  hasCancelButton={false}
                />
              : null}
          </div>}
      </AutoSizer>
    );
  }
}

export default VirtualizedCheckbox;