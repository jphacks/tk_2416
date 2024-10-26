import * as React from 'react';
import Button from '@mui/material/Button';

type Props = {
  label: string; 
}


export const TextButton : React.FC<Props> = ({label}) =>{
  return (
   
      <Button variant="contained">
        {label}
      </Button>
  
  );
}