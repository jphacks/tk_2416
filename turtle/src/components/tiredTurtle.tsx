
import * as React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';

export default function TiredTurtle() {
    return(
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Image
          src="/turtleTired.webp" // Place your turtle image inside /public folder
          alt="Turtle"
          width={150}
          height={250}
        />
      </Box>
    )
}