import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = {
    text: string; 
}

export const Header1: React.FC<Props> = ({text}) => {
    return (
      <Box sx={{ width: '100%', maxWidth: 500 }}>
    
        <Typography variant="h4" gutterBottom align="center" sx={{ color: '#5a3824', fontWeight: 'bold' }} >
          {text}
        </Typography>
         
    

      </Box>
    );
  }