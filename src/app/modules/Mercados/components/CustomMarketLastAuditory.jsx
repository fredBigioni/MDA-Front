import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getLastAuditoryMarket } from '../_redux/mercadosActions';

const CustomMarketLastAuditory = () => {
    const dispatch = useDispatch();
    const { lastAuditory } = useSelector(state => state.mercados);

    useEffect(() => {
        dispatch(getLastAuditoryMarket());
    }, [dispatch]);

    return (
        <span style={{ color: '#17c191' }}>
            {/* <FormattedMessage id="CUSTOM_MARKET_ACTION.LASTAUDITORY" /> */}
            {lastAuditory}
        </span>
    );
}

export default CustomMarketLastAuditory;
