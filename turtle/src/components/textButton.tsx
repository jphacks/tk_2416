import * as React from 'react';
import Button from '@mui/material/Button';

type Props = {
  text: string; 
  url: string;
}


export const TextButton : React.FC<Props> = ({text, url}) =>{
  return (
   
      <Button variant="contained" href= {url} 
      sx={{
        backgroundColor: '#2e7d32',
        borderRadius: 32,
        height: 48,
        fontSize: 20,
        '&:hover': { backgroundColor: '#27632a' },
      }}>
        {text}
      </Button>
  
  );
}