import React, { Component } from 'react';
import { List } from 'react-virtualized';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckboxUi from '@material-ui/core/Checkbox';

const Checkbox = ({ onChange, checked, label, isGroup, style, value }) =>
  <div style={{ ...style }}>
    <FormControlLabel control={
      <CheckboxUi 
        checked={checked || false}
        onChange={onChange}
        value={value}
        />
        }
        label = {[label, isGroup ? <span className="text-primary pl-4" key={value}><strong>&#8859;</strong></span> : null]}
      />
  </div>; 

const Checkboxes = (props) => {

  const { items, rowHeight, height, width } = props;
  const rowCount = items.length + 1;

  const handleChange = event => {
    const { labelKey, onChange } = props;
    onChange({ [labelKey]: event.target.value, checked: event.target.checked });
  };

  const handleSelectAllChange = event => {
    const { onSelectAllChange } = props;
    onSelectAllChange(event.target.checked);
  };
  const checkboxRenderer = ({ index, style }) => {
    const { items, filtered, labelKey } = props;

    if (index === 0) {
      const label = filtered ? '(Todos los filtrados)' : '(Todos)';
      const checked = items.filter(i => i.checked).length === items.length;
      return (
        <Checkbox
          style={style}
          key={'#ALL#'}
          onChange={handleSelectAllChange}
          label={label}
          checked={checked}
        />
      );
    }
    const item = items[index - 1];
    return (
      <Checkbox
        style={style}
        key={item.value}
        onChange={handleChange}
        label={item.label}
        value={item.value}
        checked={item.checked}
        isGroup={item.isGroup}
      />
    );
  };
  
    
    return (
      <List
        height={height}
        width={width}
        rowCount={rowCount}
        rowHeight={rowHeight}
        rowRenderer={checkboxRenderer}
      />
    );
  
}

export default Checkboxes;