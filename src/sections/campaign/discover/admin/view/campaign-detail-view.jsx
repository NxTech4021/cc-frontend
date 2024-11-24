import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Tab,
  Box,
  Tabs,
  Stack,
  Button,
  Dialog,
  Container,
  Typography,
  IconButton,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import useGetCampaigns from 'src/hooks/use-get-campaigns';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import CampaignOverview from '../campaign-overview';
import CampaignAgreements from '../campaign-agreements';
import CampaignDetailBrand from '../campaign-detail-brand';
import CampaignInvoicesList from '../campaign-invoices-list';
import CampaignDetailContent from '../campaign-detail-content';
import CampaignDraftSubmissions from '../campaign-draft-submission';
import CampaignDetailPitch from '../campaign-detail-pitch/campaign-detail-pitch';
import CampaignDetailCreator from '../campaign-detail-creator/campaign-detail-creator';

const CampaignDetailView = ({ id }) => {
  const settings = useSettingsContext();
  const router = useRouter();
  const { campaigns, isLoading, mutate: campaignMutate } = useGetCampaigns();
  const [anchorEl, setAnchorEl] = useState(null);
  const reminderRef = useRef(null);
  const loading = useBoolean();
  const [url, setUrl] = useState('');
  const copyDialog = useBoolean();
  const copy = useBoolean();

  const open = Boolean(anchorEl);

  const currentCampaign = useMemo(
    () => !isLoading && campaigns?.find((campaign) => campaign.id === id),
    [campaigns, id, isLoading]
  );

  const isCampaignHasSpreadSheet = useMemo(
    () => currentCampaign?.spreadSheetURL,
    [currentCampaign]
  );

  // const dialog = useBoolean(!currentCampaign?.agreementTemplate);

  const [currentTab, setCurrentTab] = useState(
    localStorage.getItem('campaigndetail') || 'campaign-content'
  );

  const handleChangeTab = useCallback((event, newValue) => {
    localStorage.setItem('campaigndetail', newValue);
    setCurrentTab(newValue);
  }, []);

  const icons = (tab) => {
    if (tab.value === 'pitch' && currentCampaign?.pitch?.length > 0) {
      const undecidedPitches = currentCampaign.pitch.filter(
        (pitch) => pitch.status === 'undecided'
      );
      return undecidedPitches.length > 0 ? <Label>{undecidedPitches.length}</Label> : null;
    }

    if (tab.value === 'creator' && currentCampaign?.shortlisted?.length) {
      return <Label>{currentCampaign?.shortlisted?.length}</Label>;
    }

    if (tab.value === 'agreement' && currentCampaign?.creatorAgreement?.length) {
      return <Label>{currentCampaign?.creatorAgreement?.length}</Label>;
    }

    return '';
  };

  // important
  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 1, md: 3 },
        mt: 3,
      }}
    >
      {[
        { label: 'Overview', value: 'overview' },
        { label: 'Campaign Brief', value: 'campaign-content' },
        { label: 'Client Info', value: 'client' },
        { label: 'Shortlisted Creator', value: 'creator' },
        { label: 'Pitches', value: 'pitch' },
        { label: 'Agreements', value: 'agreement' },
        { label: 'Invoices', value: 'invoices' },
      ].map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={icons(tab)}
        />
      ))}
    </Tabs>
  );

  useEffect(() => {
    window.addEventListener('click', (event) => {
      if (reminderRef.current && !reminderRef.current.contains(event.target)) {
        setAnchorEl(false);
      }
    });
  }, [open]);

  // eslint-disable-next-line no-unused-vars
  // const renderReminder = (
  //   <>
  //     <IconButton
  //       ref={reminderRef}
  //       id="reminder"
  //       sx={{
  //         position: 'fixed',
  //         bottom: 30,
  //         right: 30,
  //         border: (theme) => `1px solid ${theme.palette.background.paper}`,
  //         bgcolor: (theme) => `${theme.palette.background.paper}`,
  //       }}
  //       onClick={(event) => {
  //         setAnchorEl(anchorEl ? null : event.currentTarget);
  //       }}
  //     >
  //       <Iconify icon="hugeicons:apple-reminder" width={30} />
  //     </IconButton>
  //     <Popper id={idd} open={open} anchorEl={anchorEl} placement="top-end">
  //       <Box
  //         sx={{
  //           p: 2,
  //           bgcolor: 'background.paper',
  //           mb: 1,

  //           width: {
  //             xs: 250,
  //             md: 450,
  //           },
  //           border: (theme) => `1px solid ${theme.palette.primary.light}`,
  //           position: 'relative',
  //         }}
  //         component={Card}
  //       >
  //         <Stack alignItems="center" direction="row" justifyContent="space-between">
  //           <Stack alignItems="center" spacing={1} direction="row">
  //             <Iconify icon="material-symbols:info-outline" />
  //             <Typography variant="h5">Reminders</Typography>
  //           </Stack>
  //           <Typography variant="caption">{dayjs().format('ll')}</Typography>
  //         </Stack>
  //         <Divider
  //           sx={{
  //             borderStyle: 'dashed',
  //             my: 1.5,
  //           }}
  //         />
  //         <List>
  //           <ListItem>
  //             {isDue(
  //               timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.filterPitch)
  //             ) && (
  //               <ListItemIcon>
  //                 <Iconify icon="clarity:warning-solid" color="warning.main" />
  //               </ListItemIcon>
  //             )}
  //             {isDone(
  //               timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.filterPitch)
  //             ) && (
  //               <ListItemIcon>
  //                 <Iconify icon="hugeicons:tick-04" color="success.main" />
  //               </ListItemIcon>
  //             )}
  //             <ListItemText
  //               primary="Filter Pitch"
  //               secondary={`Due ${timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.filterPitch)}`}
  //               primaryTypographyProps={{
  //                 variant: 'subtitle2',
  //               }}
  //               secondaryTypographyProps={{
  //                 variant: 'caption',
  //               }}
  //             />
  //           </ListItem>
  //           <ListItem>
  //             {isDue(
  //               timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.shortlisted)
  //             ) && (
  //               <ListItemIcon>
  //                 <Iconify icon="clarity:warning-solid" color="warning.main" />
  //               </ListItemIcon>
  //             )}
  //             {isDone(
  //               timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.shortlisted)
  //             ) && (
  //               <ListItemIcon>
  //                 <Iconify icon="hugeicons:tick-04" color="success.main" />
  //               </ListItemIcon>
  //             )}
  //             <ListItemText
  //               primary="Shortlist Creator"
  //               secondary={`Due ${timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.shortlisted)}`}
  //               primaryTypographyProps={{
  //                 variant: 'subtitle2',
  //               }}
  //               secondaryTypographyProps={{
  //                 variant: 'caption',
  //               }}
  //             />
  //           </ListItem>
  //           <ListItem>
  //             {isDue(
  //               timelineHelper(
  //                 currentCampaign?.campaignBrief?.startDate,
  //                 timeline?.feedBackFirstDraft
  //               )
  //             ) && (
  //               <ListItemIcon>
  //                 <Iconify icon="clarity:warning-solid" color="warning.main" />
  //               </ListItemIcon>
  //             )}
  //             {isDone(
  //               timelineHelper(
  //                 currentCampaign?.campaignBrief?.startDate,
  //                 timeline?.feedBackFirstDraft
  //               )
  //             ) && (
  //               <ListItemIcon>
  //                 <Iconify icon="hugeicons:tick-04" color="success.main" />
  //               </ListItemIcon>
  //             )}
  //             <ListItemText
  //               primary="Feedback First Draft"
  //               secondary={`Due ${timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.feedBackFirstDraft)}`}
  //               primaryTypographyProps={{
  //                 variant: 'subtitle2',
  //               }}
  //               secondaryTypographyProps={{
  //                 variant: 'caption',
  //               }}
  //             />
  //           </ListItem>
  //           <ListItem>
  //             {isDue(
  //               timelineHelper(
  //                 currentCampaign?.campaignBrief?.startDate,
  //                 timeline?.feedBackFinalDraft
  //               )
  //             ) && (
  //               <ListItemIcon>
  //                 <Iconify icon="clarity:warning-solid" color="warning.main" />
  //               </ListItemIcon>
  //             )}
  //             {isDone(
  //               timelineHelper(
  //                 currentCampaign?.campaignBrief?.startDate,
  //                 timeline?.feedBackFinalDraft
  //               )
  //             ) && (
  //               <ListItemIcon>
  //                 <Iconify icon="hugeicons:tick-04" color="success.main" />
  //               </ListItemIcon>
  //             )}
  //             <ListItemText
  //               primary="Feedback First Draft"
  //               secondary={`Due ${timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.feedBackFinalDraft)}`}
  //               primaryTypographyProps={{
  //                 variant: 'subtitle2',
  //               }}
  //               secondaryTypographyProps={{
  //                 variant: 'caption',
  //               }}
  //             />
  //           </ListItem>
  //           <ListItem>
  //             {isDue(timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.qc)) && (
  //               <ListItemIcon>
  //                 <Iconify icon="clarity:warning-solid" color="warning.main" />
  //               </ListItemIcon>
  //             )}
  //             {isDone(timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.qc)) && (
  //               <ListItemIcon>
  //                 <Iconify icon="hugeicons:tick-04" color="success.main" />
  //               </ListItemIcon>
  //             )}
  //             <ListItemText
  //               primary="Feedback First Draft"
  //               secondary={`Due ${timelineHelper(currentCampaign?.campaignBrief?.startDate, timeline?.qc)}`}
  //               primaryTypographyProps={{
  //                 variant: 'subtitle2',
  //               }}
  //               secondaryTypographyProps={{
  //                 variant: 'caption',
  //               }}
  //             />
  //           </ListItem>
  //         </List>
  //       </Box>
  //     </Popper>
  //   </>
  // );

  const generateSpreadSheet = useCallback(async () => {
    try {
      loading.onTrue();
      const res = await axiosInstance.post(endpoints.campaign.spreadsheet, {
        campaignId: currentCampaign?.id,
      });
      setUrl(res?.data?.url);
      enqueueSnackbar(res?.data?.message);
      copyDialog.onTrue();
      campaignMutate();
    } catch (error) {
      enqueueSnackbar(error?.message, {
        variant: 'error',
      });
    } finally {
      loading.onFalse();
    }
  }, [loading, copyDialog, campaignMutate, currentCampaign]);

  const renderTabContent = {
    overview: <CampaignOverview campaign={currentCampaign} />,
    'campaign-content': <CampaignDetailContent campaign={currentCampaign} />,
    creator: <CampaignDetailCreator campaign={currentCampaign} />,
    agreement: <CampaignAgreements campaign={currentCampaign} />,
    invoices: <CampaignInvoicesList campId={currentCampaign?.id} />,
    client: (
      <CampaignDetailBrand
        brand={currentCampaign?.brand ?? currentCampaign?.company}
        campaign={currentCampaign}
      />
    ),
    pitch: (
      <CampaignDetailPitch
        pitches={currentCampaign?.pitch}
        timeline={currentCampaign?.campaignTimeline?.find((elem) => elem.name === 'Open For Pitch')}
        timelines={currentCampaign?.campaignTimeline?.filter(
          (elem) => elem.for === 'creator' && elem.name !== 'Open For Pitch'
        )}
        shortlisted={currentCampaign?.shortlisted}
      />
    ),
    submission: <CampaignDraftSubmissions campaign={currentCampaign} />,
  };

  // Render the current tab component based on the `currentTab` value

  const copyURL = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        copy.onTrue();
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const copyDialogContainer = (
    <Dialog
      open={copyDialog.value}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          p: 2,
        },
      }}
    >
      <Box
        sx={{
          p: 1,
          bgcolor: (theme) => theme.palette.background.paper,
          border: 1,
          borderRadius: 1,
          borderColor: '#EBEBEB',
        }}
      >
        <Stack direction="row" alignItems="center">
          <Typography sx={{ flexGrow: 1, color: 'text.secondary' }} variant="subtitle2">
            {url || 'No url found.'}
          </Typography>
          {!copy.value ? (
            <IconButton onClick={copyURL}>
              <Iconify icon="solar:copy-line-duotone" />
            </IconButton>
          ) : (
            <IconButton disabled>
              <Iconify icon="charm:tick" color="success.main" />
            </IconButton>
          )}
        </Stack>
      </Box>

      <DialogActions>
        <Button onClick={copyDialog.onFalse} size="small" variant="outlined" sx={{ mx: 'auto' }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Campaign"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Campaign', href: paths.dashboard.campaign.root },
          { name: currentCampaign?.name },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="tabler:external-link" width={19} sx={{ ml: 1 }} />}
              onClick={() => {
                const a = document.createElement('a');
                a.href = currentCampaign?.spreadSheetURL;
                a.target = '_blank';
                a.click();
                document.body.removeChild(a);
              }}
              sx={{
                mb: 3,
                borderRadius: 1,
                boxShadow: (theme) => `0px 2px 1px 1px ${theme.palette.grey[400]}`,
              }}
              disabled={!currentCampaign?.spreadSheetURL}
            >
              Google spreadsheet
            </Button>

            {!isCampaignHasSpreadSheet && (
              <LoadingButton
                startIcon={<Iconify icon="lucide:file-spreadsheet" />}
                variant="outlined"
                size="small"
                sx={{
                  boxShadow: '0px -3px 0px 0px #E7E7E7 inset',
                }}
                onClick={generateSpreadSheet}
                loading={loading.value}
              >
                Generate new spreadsheet
              </LoadingButton>
            )}

            <Button
              variant="outlined"
              size="small"
              startIcon={
                <Iconify
                  icon="material-symbols-light:bookmark-manager-outline-rounded"
                  width={19}
                  sx={{ ml: 1 }}
                />
              }
              onClick={() => router.push(paths.dashboard.campaign.adminCampaignManageDetail(id))}
              sx={{
                mb: 3,
                borderRadius: 1,
                boxShadow: (theme) => `0px 2px 1px 1px ${theme.palette.grey[400]}`,
              }}
            >
              Edit
            </Button>
          </Stack>
        }
      />

      {renderTabs}
      {(!isLoading ? renderTabContent[currentTab] : <LoadingScreen />) || null}
      {copyDialogContainer}
    </Container>
  );
};

export default CampaignDetailView;

CampaignDetailView.propTypes = {
  id: PropTypes.string,
};
