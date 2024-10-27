import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = {
    text: string; 
}

export const Header3: React.FC<Props> = ({text}) => {
    return (
      <Box sx={{ width: '100%', maxWidth: 500 }}>
    
        <Typography variant="h6" gutterBottom>
          {text}
        </Typography>
       
      </Box>
    );
  }