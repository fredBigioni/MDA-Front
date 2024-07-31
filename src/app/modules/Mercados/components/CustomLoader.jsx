import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

export const CustomLoader = () => {
    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(0, 0, 0, 0.7)"
            zIndex={1300} // Asegúrate de que el zIndex sea suficientemente alto
        >
            <CircularProgress style={{ width: '80px', height: '80px' }} />
        </Box>
    );
};
