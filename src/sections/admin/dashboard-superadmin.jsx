import useSWR from 'swr';
import dayjs from 'dayjs';
import React from 'react';
import { useTheme } from '@emotion/react';

import { grey } from '@mui/material/colors';
import {
  Box,
  Grid,
  Card,
  alpha,
  Stack,
  Table,
  Paper,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import useGetCreators from 'src/hooks/use-get-creators';
import useGetCampaigns from 'src/hooks/use-get-campaigns';

import { fetcher } from 'src/utils/axios';
import { fNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Chart from 'src/components/chart';
import { useSettingsContext } from 'src/components/settings';
import EmptyContent from 'src/components/empty-content/empty-content';

const DashboardSuperadmin = () => {
  const { campaigns, isLoading } = useGetCampaigns();
  const { data: creators, isLoading: creatorLoading } = useGetCreators();
  const { data: analytics, isLoading: analyticsLoading } = useSWR('/api/admin/overview', fetcher);

  const theme = useTheme();
  const setting = useSettingsContext();

  const loadingDone = !isLoading && !creatorLoading;

  const taskLists =
    !isLoading &&
    campaigns
      ?.filter((campaign) => campaign.status === 'ACTIVE')
      .map((campaign) => {
        const campaignTasks = campaign?.campaignTasks.filter(
          (item) => item.status === 'IN_PROGRESS'
        );
        return (
          campaignTasks.length &&
          campaignTasks.map((task) => ({
            campaignName: campaign.name,
            campaignTask: task.task,
            dueDate: task.dueDate,
            status: task.status,
          }))
        );
      })
      .flat()
      .filter((item) => item !== 0);

  const chartOptions = {
    colors: [theme.palette.primary.light, theme.palette.primary.main].map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: theme.palette.primary.light, opacity: 1 },
          { offset: 100, color: theme.palette.primary.main, opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 2,
      },
    },
    tooltip: {
      theme: setting.themeMode,
      x: { show: true },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
  };

  const renderCampaignLists = (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell align="center">Campaign Name</TableCell>
            <TableCell align="center">Start Date</TableCell>
            <TableCell align="center">End Date</TableCell>
            <TableCell align="center">Total Shortlisted Creator</TableCell>
            <TableCell align="center">Total Pitch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!isLoading &&
            campaigns
              ?.filter((item) => item.status === 'ACTIVE')
              .map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell align="center">{campaign?.name}</TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(campaign?.campaignBrief?.startDate).format('ddd LL')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(campaign?.campaignBrief?.endDate).format('ddd LL')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Label color="success">{campaign?.shortlisted.length}</Label>
                  </TableCell>
                  <TableCell align="center">
                    <Label color="success">{campaign?.pitch.length}</Label>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return loadingDone ? (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Box component={Card} p={2} sx={{ boxShadow: `0px 2px 2px 2px ${alpha(grey[400], 0.3)}` }}>
          <Stack gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Campaign
            </Typography>
            <Stack gap={1} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h2">
                {campaigns?.filter((campaign) => campaign.status === 'ACTIVE')?.length}
              </Typography>
              {!analyticsLoading && (
                <Chart
                  dir="ltr"
                  type="bar"
                  // series={[{ data: [20, 41, 63, 33] }]}
                  series={[
                    {
                      data: analytics?.campaigns?.campaignsGraph?.map(
                        (campaign) => campaign?.totalCampaigns
                      ),
                    },
                  ]}
                  options={{
                    ...chartOptions,
                    xaxis: {
                      categories:
                        !analyticsLoading &&
                        analytics?.campaigns?.campaignsGraph?.map((campaign) =>
                          campaign?.month?.slice(0, 3)
                        ),
                    },
                  }}
                  width={60}
                  height={36}
                />
              )}
            </Stack>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} md={3}>
        <Box
          component={Card}
          p="16px 24px"
          sx={{ boxShadow: `0px 2px 2px 2px ${alpha(grey[400], 0.3)}` }}
        >
          <Stack gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Pitch
            </Typography>
            <Stack gap={1} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h2">
                {campaigns
                  ?.filter((campaign) => campaign.status === 'ACTIVE')
                  .reduce((acc, campaign) => acc + campaign.pitch.length, 0)}
              </Typography>
              <Chart
                dir="ltr"
                type="bar"
                series={[{ data: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26, 20, 89] }]}
                options={chartOptions}
                width={60}
                height={36}
              />
            </Stack>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} md={3}>
        <Box
          component={Card}
          p="16px 24px"
          sx={{ boxShadow: `0px 2px 2px 2px ${alpha(grey[400], 0.3)}` }}
        >
          <Stack gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Creator
            </Typography>
            <Stack gap={1} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h2">{creators?.length}</Typography>
              <Chart
                dir="ltr"
                type="bar"
                series={[{ data: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26, 20, 89] }]}
                options={chartOptions}
                width={60}
                height={36}
              />
            </Stack>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} md={3}>
        <Box
          component={Card}
          p="16px 24px"
          sx={{ boxShadow: `0px 2px 2px 2px ${alpha(grey[400], 0.3)}` }}
        >
          <Stack gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Task
            </Typography>
            <Stack gap={1} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h2">{taskLists?.length}</Typography>
              <Chart
                dir="ltr"
                type="bar"
                series={[{ data: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26, 20, 89] }]}
                options={chartOptions}
                width={60}
                height={36}
              />
            </Stack>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} md={12}>
        <Box
          component={Card}
          p="16px 24px"
          sx={{ boxShadow: `0px 5px 10px ${alpha(theme.palette.text.primary, 0.1)}` }}
        >
          <Stack gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Active Campaigns
            </Typography>
            {campaigns?.length ? renderCampaignLists : <EmptyContent title="No active campaign" />}
          </Stack>
        </Box>
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <Box
          component={Card}
          p={2}
          sx={{ boxShadow: `0px 5px 10px ${alpha(theme.palette.text.primary, 0.1)}` }}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle2">Tasks</Typography>
            {taskLists?.length ? (
              <>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Campaign</TableCell>
                        <TableCell>Due</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {taskLists.length > 0 &&
                        taskLists?.slice(0, 4).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="subtitle2">{item.campaignTask}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">{item.campaignName}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {dayjs(item.dueDate).format('ddd LL')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Label>{item.status}</Label>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  sx={{
                    ml: 'auto',
                  }}
                >
                  <Button size="small" endIcon={<Iconify icon="iconamoon:arrow-right-2-bold" />}>
                    View all
                  </Button>
                </Box>
              </>
            ) : (
              <EmptyContent title="No task" />
            )}
          </Stack>
        </Box>
      </Grid> */}
    </Grid>
  ) : (
    <Box
      sx={{
        position: 'relative',
        top: 200,
        textAlign: 'center',
      }}
    >
      <CircularProgress
        thickness={7}
        size={25}
        sx={{
          color: theme.palette.common.black,
          strokeLinecap: 'round',
        }}
      />
    </Box>
  );
};

export default DashboardSuperadmin;
