import React from 'react'
import { AutoSizer } from 'react-virtualized';
import VirtualizedCheckbox from './VirtualizedCheckbox'
import Loader from './Loader'

const ListVirtualized = (props) => {

    const { items, isLoading,title, onChange,options, onSelectItemFromMenu, infoRef } = props;
    const [ filter, setFilter ] = React.useState('')

    const onSelect = (selected) => {
        props.onChange(selected);
    }
    return (
        <div style={{width: '100%', height: '100%', marginRight: 10}}>
            {isLoading &&
                <Loader />
            }
            {!isLoading  &&
                <VirtualizedCheckbox
                    items={items || []}
                    title={title}
                    onOk={onSelect}
                    options={options}
                    onSelectItemFromMenu={onSelectItemFromMenu}
                    onCancel={ () => console.log('')}
                />
            }
        </div>
    )
}

export default ListVirtualized;