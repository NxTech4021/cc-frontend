import React, { lazy } from 'react';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

const DashboardFinance = lazy(() => import('../admin/Finance/Dashboard'));

function FianaceDiscover() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Finance"
        links={[
          { name: 'Dashboard', href: paths.dashboard.finance.root },
          {
            name: 'Finance',
            href: paths.dashboard.finance.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DashboardFinance />
    </Container>
  );
}

export default FianaceDiscover;
