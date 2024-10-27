import * as React from 'react';
import { Stack, Box, LinearProgress } from "@mui/material";
import { Header3 } from './header3';

type Props = {
    name: string; 
    energy: number;
}

export const EnergyBar: React.FC<Props> = ({name, energy}) => {
    return (
        <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        sx={{ width: '100%', px: 2 }}  // Full width with padding on sides
    >
      
        <Header3 text={name} />

        <Box
            sx={{
                flexGrow: 1,               // Use remaining space
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <LinearProgress
                variant="determinate"
                value={energy}                  // Set progress value here
                sx={{
                    width: '60%',           // Fill available width in Box
                    height: '8px',           // Adjust thickness as needed
                }}
            />
        </Box>
    </Stack>

    );
  }


      