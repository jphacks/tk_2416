import Image from "next/image";
import * as React from 'react';

import { Header1} from "@/components/header1";
import { Header2} from "@/components/header2";
import { Header3} from "@/components/header3";
import { NextButton } from "@/components/nextButton";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from "@mui/material";
import Stack from '@mui/material/Stack';

export default function Intro() {
  return (
    <Container>
      <Stack spacing={2}>
        <Typography variant = "h3">turtle stamina</Typography>
        <Header2 text="友達の体力を把握して旅行を楽しもう！"/>
        <NextButton url="setting" />
      </Stack>
    </Container>
  );
}
