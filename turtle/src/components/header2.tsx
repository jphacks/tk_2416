import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = {
    text: string; 
}

export const Header2: React.FC<Props> = ({text}) => {
    return (
      <Box sx={{ width: '100%', maxWidth: 500 }}>
    
        <Typography variant="h5" gutterBottom sx={{ color: '#5a3824', mb: 4 }} >
          {text}
        </Typography>
       
      </Box>
    );
  }