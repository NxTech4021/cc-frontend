import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';

import InvoiceDetail from 'src/sections/creator/invoice/invoice-details';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView({ id, invoice }) {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const renderPathDashboard = useMemo(() => {
    if (user?.role.includes('admin') && user?.admin?.role?.name.includes('Finance')) {
      return paths.dashboard.finance.root;
    }

    return paths.dashboard.root;
  }, [user]);

  const renderPathInvoice = useMemo(() => {
    if (user?.role.includes('admin') && user?.admin?.role?.name.includes('Finance')) {
      return paths.dashboard.finance.invoice;
    }

    return paths.dashboard.creator.invoiceCreator;
  }, [user]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <InvoiceDetail invoiceId={invoice?.id} />
    </Container>
  );
}

InvoiceDetailsView.propTypes = {
  id: PropTypes.string,
  invoice: PropTypes.object,
};
