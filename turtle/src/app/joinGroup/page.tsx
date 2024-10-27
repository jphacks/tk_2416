
import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import turtleImage from './turtle.png';
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';

function App() {
    return (
        <Box
            sx={{
                width: '390px',
                height: '844px',
                margin: 'auto',
                border: '1px solid #ddd',
                overflow: 'auto',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            {/* 設定ボタン */}
            <IconButton aria-label="Settings" sx={{ position: 'absolute', top: 10, left: 10 }}>
                <SettingsIcon sx={{ fontSize: 50 }} />
            </IconButton>

            {/* 現在の状況 */}
            <Typography variant="body1" sx={{ fontSize: 32, fontWeight: 'Bold', textAlign: 'center', mt: 12, width: '359px' }}>
                お出かけ待機中
            </Typography>


            {/* カメ表示 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 5 }}>
                <img src={turtleImage} alt="Turtle" style={{ width: '211px', height: '318px' }} />
            </Box>


            {/* グループID入力 */}
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '262px' },
                    my: 3,
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="outlined-basic" label="グループID" variant="outlined" />
            </Box>

            {/* グループ参加ボタン */}
            <Stack spacing={2} sx={{ '& button': { m: 1 } }}>
                <Button variant="contained" size="large" sx={{ width: '262px', height: '55px' }}>
                    グループに参加
                </Button>
            </Stack>

        </Box>
    );
}

export default App;