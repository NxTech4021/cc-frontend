/* eslint-disable react/prop-types */
import React from 'react';

import { deepOrange } from '@mui/material/colors';
import { Box, Stack, Avatar, useTheme, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

const MediaKitCover = ({ user }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 5,
      }}
    >
      <Stack direction="column" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: deepOrange[500], width: 150, height: 150 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h2" color={theme.palette.text.primary} fontWeight={800}>
          {user?.name}
        </Typography>
        {/* <Stack direction="row" gap={2}>
          {user?.creator?.interests.map((elem) => (
            <Chip
              label={elem?.name}
              sx={{
                borderRadius: 10,
                fontWeight: 800,
              }}
            />
          ))}
        </Stack> */}
        <Stack gap={2}>
          <Typography
            gutterBottom
            variant="body1"
            maxWidth={600}
            textAlign="center"
            lineHeight={1.2}
            fontWeight={600}
            color={theme.palette.grey[600]}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, odio sequi aliquid
            obcaecati esse quidem quas eligendi quos minima voluptates? Hic tempore perferendis
            velit natus.
          </Typography>
          <Stack direction={{ sm: 'row' }} justifyContent="space-evenly" alignItems="center">
            <Stack direction="row" gap={2}>
              <Iconify icon="mingcute:location-fill" />
              <Typography variant="subtitle2" gutterBottom fontWeight={800}>
                Live at {user?.country}
              </Typography>
            </Stack>
            <Stack direction="row" gap={2}>
              <Iconify icon="mdi:email" />
              <Typography variant="subtitle2" gutterBottom fontWeight={800}>
                {user?.email}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
export default MediaKitCover;
