import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import {
  Box,
  List,
  Card,
  Stack,
  Divider,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

const CampaignInfo = ({ campaign }) => {
  const requirement = campaign?.campaignRequirement;

  const renderOverview = (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
      <Stack direction="row" spacing={1} alignItems="start">
        <Iconify icon="mdi:clock" width={18} />
        <Stack>
          <ListItemText
            primary="Duration"
            secondary={`${dayjs(campaign?.campaignBrief?.startDate).format('LL')} - ${dayjs(campaign?.campaignBrief?.endDate).format('LL')}`}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="start">
        <Iconify icon="typcn:point-of-interest" width={18} />
        <Stack>
          <ListItemText
            primary="Industries"
            secondary={<Label>{campaign?.campaignBrief?.industries}</Label>}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="start">
        <Iconify icon="ci:main-component" width={18} />
        <Stack>
          <ListItemText
            primary="Client"
            secondary={campaign?.brand?.name ?? campaign?.company?.name}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      </Stack>
    </Box>
  );

  const renderGallery =
    campaign?.campaignBrief?.images.length < 2 ? (
      <Image
        src={campaign?.campaignBrief?.images[0]}
        alt="test"
        ratio="16/9"
        sx={{ borderRadius: 2, cursor: 'pointer' }}
      />
    ) : (
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        gap={1}
        mb={5}
      >
        <Image
          src={campaign?.campaignBrief?.images[0]}
          alt="test"
          ratio="1/1"
          sx={{ borderRadius: 2, cursor: 'pointer' }}
        />

        {campaign?.campaignBrief?.images.slice(1).map((elem, index) => (
          <Image
            key={index}
            src={elem}
            alt="test"
            ratio="1/1"
            sx={{ borderRadius: 2, cursor: 'pointer' }}
          />
        ))}
        {/* </Box> */}
      </Box>
    );

  const renderInformation = (
    <Stack spacing={5}>
      <ListItemText
        primary={campaign?.name}
        secondary={campaign?.description}
        primaryTypographyProps={{
          variant: 'h4',
        }}
        secondaryTypographyProps={{
          variant: 'body2',
        }}
      />

      <Divider
        sx={{
          borderStyle: 'dashed',
        }}
      />

      {renderOverview}

      <Divider
        sx={{
          borderStyle: 'dashed',
        }}
      />

      <Stack direction="column">
        <Typography variant="h5"> Campaign Objectives</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Iconify icon="octicon:dot-16" />
            </ListItemIcon>
            <ListItemText primary={campaign?.campaignBrief?.objectives} />
          </ListItem>
        </List>
      </Stack>

      <Divider
        sx={{
          borderStyle: 'dashed',
        }}
      />
    </Stack>
  );

  const renderDos = (
    <>
      <Stack direction="column">
        <Typography variant="h5">Campaign Do&apos;s</Typography>
        <List>
          {campaign?.campaignBrief?.campaigns_do.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Iconify icon="octicon:dot-16" sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText primary={item.value} />
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack direction="column">
        <Typography variant="h5">Campaign Dont&apos;s</Typography>
        <List>
          {campaign?.campaignBrief?.campaigns_dont.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Iconify icon="octicon:dot-16" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText primary={item.value} />
            </ListItem>
          ))}
        </List>
      </Stack>
    </>
  );

  const renderDetails = (
    <Stack gap={1.5}>
      <Typography variant="h5">Campaign Details</Typography>
      <Box
        maxWidth={800}
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        component={Card}
        p={4}
        mx="auto"
        gap={2}
      >
        <ListItemText
          primary="Age"
          secondary={
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {requirement.age.map((value) => (
                <Label>{value}</Label>
              ))}
            </Stack>
          }
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
        <ListItemText
          primary="Gender"
          secondary={
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {requirement.gender.map((value) => (
                <Label>{value}</Label>
              ))}
            </Stack>
          }
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
        <ListItemText
          primary="Geo Location"
          secondary={
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {requirement.geoLocation.map((value) => (
                <Label>{value}</Label>
              ))}
            </Stack>
          }
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
        <ListItemText
          primary="Languages"
          secondary={
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {requirement.language.map((value) => (
                <Label>{value}</Label>
              ))}
            </Stack>
          }
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
        <ListItemText
          primary="Creator Persona"
          secondary={
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {requirement.creator_persona.map((value) => (
                <Label>{value}</Label>
              ))}
            </Stack>
          }
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
        <ListItemText
          primary="Gender"
          secondary={requirement.user_persona}
          primaryTypographyProps={{
            typography: 'body2',
            color: 'text.secondary',
            mb: 0.5,
          }}
          secondaryTypographyProps={{
            typography: 'subtitle2',
            color: 'text.primary',
            component: 'span',
          }}
        />
      </Box>
    </Stack>
  );

  return (
    <Stack spacing={2} maxWidth={800} mx="auto">
      {renderGallery}
      {renderInformation}
      {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}
      {renderDetails}
      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderDos}
    </Stack>
  );
};

export default CampaignInfo;

CampaignInfo.propTypes = {
  campaign: PropTypes.object,
};
