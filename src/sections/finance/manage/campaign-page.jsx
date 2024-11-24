import useSWR from 'swr';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// import { Stack, Container, Button } from '@mui/material';
import { Box, Container, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import useGetCampaignsFinance from 'src/hooks/use-get-campaign-finance';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { useGetAllInvoices } from 'src/api/invoices';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import InvoiceLists from '../invoices-list';

function CampaignPage() {
  const settings = useSettingsContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { campaigns } = useGetCampaignsFinance();
  const { data: invoices, isLoading: invoicesLoading } = useGetAllInvoices();

  const { data: invoiceData, isLoading } = useSWR(endpoints.invoice.ConnectToXero, fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    const fetchToken = async () => {
      const searchParams = new URLSearchParams(location.search);

      const code = searchParams.get('code'); // Get the authorization code
      if (code) {
        try {
          // Call the backend to exchange the authorization code for the access token
          const { data } = await axiosInstance.get(endpoints.invoice.xeroCallback(code), {
            withCredentials: true,
          });

          navigate('/dashboard');
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      }
    };

    fetchToken();
  }, [navigate, location]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Invoice"
        links={[
          { name: 'Dashboard', href: paths.dashboard.finance.root },
          {
            name: 'Invoice',
            href: paths.dashboard.finance.invoice,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {!invoicesLoading && invoices?.length ? (
        <InvoiceLists invoices={invoices} />
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
              color: (theme) => theme.palette.common.black,
              strokeLinecap: 'round',
            }}
          />
        </Box>
      )}
    </Container>
  );
}

export default CampaignPage;
