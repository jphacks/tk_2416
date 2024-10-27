import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

export const SettingButton: React.FC<Props> = ({url}) =>{
    return(

            <IconButton aria-label="Settings" sx={{ position: 'absolute', top: 10, left: 10 }}>
                <SettingsIcon sx={{ fontSize: 50 }} />
            </IconButton>
    )
}
