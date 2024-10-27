import * as React from 'react';
import Button from '@mui/material/Button';

type Props = {
  url?: string; 
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
}


export const NextButton : React.FC<Props> = ({url, onClick}) =>{
  return (
   
      <Button variant="contained" href={url}  onClick={onClick}
      sx={{
        backgroundColor: '#2e7d32',
        borderRadius: 32,
        height: 48,
        fontSize: 16,
        '&:hover': { backgroundColor: '#27632a' },
      }}>
        →
      </Button>
  
  );
}