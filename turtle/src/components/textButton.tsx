import * as React from 'react';
import Button from '@mui/material/Button';

type Props = {
  text: string; 
  url?: string;
  onClick?: null;
}


export const TextButton : React.FC<Props> = ({text, url, onClick}) =>{
  return (
   
      <Button variant="contained" href= {url} 
      onClick={onClick}
      sx={{
        backgroundColor: '#2e7d32',
        borderRadius: 32,
        pr: 5,
        pl:5,
        pt: 3,
        pb: 3,
        height: 48,
        fontSize: 18,
        '&:hover': { backgroundColor: '#27632a' },
      }}>
        {text}
      </Button>
  
  );
}