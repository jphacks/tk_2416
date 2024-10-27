"use client"

import * as React from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { useState } from 'react';

type Props ={
    hint: string
}

export const TextInput : React.FC<Props>= ({hint}) =>{

    const [name, setName] = useState('');
  return (
   
    <TextField
    label={hint}
    variant="outlined"
    value={name}
    onChange={(e) => setName(e.target.value)}
    InputProps={{
      style: { borderColor: '#674637', borderRadius: 12, borderWidth:12 },
    }}
  />
  
  );
}
