import React from 'react'
import { CircularProgress, IconButton } from '@material-ui/core'
import PreviewIcon from '@material-ui/icons/Visibility';
import Signature from '@material-ui/icons/BorderColor';
import { FormattedMessage } from 'react-intl';
import Can from '../../../config/Can';
import { useDispatch, useSelector } from 'react-redux';
import { signMarket } from '../_redux/mercadosActions';

export const CustomMarketActionFirma = () => {

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { customMarket, isLoading } = useSelector(state => state.mercados);

  const signCurrentMarket = async () => {

    const objectToSend = {
      signedUser: user.id,
      customMarketCode: customMarket.data.code
    };
    await dispatch(signMarket(objectToSend));
  };

  return (
    <>
      <Can I="view" a="manage-custom-market">
        <div
          id="btn_preview"
          className={`btn btn-secondary font-weight-bold px-2 pr-6 py-0 mb-2 ml-10`}
          style={{ fontWeight: '600' }}
          onClick={() => signCurrentMarket()}
        >
          <IconButton aria-label="" color="primary">
            {isLoading ? <CircularProgress size={22} /> : <Signature color="primary" />}
          </IconButton>
          <span style={{ color: '#17c191' }}>
            <FormattedMessage id="CUSTOM_MARKET_ACTION.SIGNATURE" />
          </span>
        </div>
      </Can>
    </>

  )
}
