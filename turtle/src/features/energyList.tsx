import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';

import { EnergyBar } from '@/components/energyBar';
 
export default function EnergyList() {

  const energyData = [{
    name: "marie", 
    energy: 100
  }, {
    name: "ayana", 
    energy: 100
  }, {
    name: "miyabi", 
    energy: 100
  }]

  return (

    <Stack>
       {energyData.map((person, index) => (
            <EnergyBar key={index} name={person.name} energy={person.energy} />
          ))}
    </Stack>

   

  );
}
