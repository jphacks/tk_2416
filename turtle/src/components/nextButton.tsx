import * as React from 'react';
import Button from '@mui/material/Button';

type Props = {
  url: string; 
}


export const NextButton : React.FC<Props> = ({url}) =>{
  return (
   
      <Button variant="contained" href={url}>
        →
      </Button>
  
  );
}