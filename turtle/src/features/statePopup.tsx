import React from 'react';
import { Radio, RadioGroup, FormControl, FormControlLabel, Typography, Button, Paper } from '@mui/material';

const HealthPopup = () => {
  return (
    <Paper
      elevation={3}
      style={{
        padding: '20px',
        borderRadius: '15px',
        width: '300px',
        textAlign: 'center',
        backgroundColor: '#FFF8E1'
      }}
    >
      <FormControl component="fieldset">
        <Typography variant="h6" style={{ marginBottom: '20px', color: '#6D4C41', fontWeight: 'bold' }}>
          今日の体調は？
        </Typography>
        <RadioGroup>
          <FormControlLabel value="veryGood" control={<Radio />} label="とても良い" />
          <FormControlLabel value="good" control={<Radio />} label="良い" />
          <FormControlLabel value="normal" control={<Radio />} label="普通" />
          <FormControlLabel value="bad" control={<Radio />} label="悪い" />
          <FormControlLabel value="veryBad" control={<Radio />} label="とても悪い" />
        </RadioGroup>
        <Button
          variant="contained"
          style={{
            marginTop: '20px',
            backgroundColor: '#2E7D32',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '10px 20px'
          }}
        >
          ▶︎
        </Button>
      </FormControl>
    </Paper>
  );
};

export default HealthPopup;