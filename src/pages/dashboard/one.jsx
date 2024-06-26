import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import DashboardAdmin from 'src/sections/admin/dashboard';
import DashboardCreator from 'src/sections/creator/dashboard';
// import CreatorView from 'src/sections/creator/form/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { user, permission } = useAuthContext();

  console.log(permission);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      {user?.role === 'admin' && <DashboardAdmin />}
      {user?.role === 'creator' && <DashboardCreator />}

      {/* <CreatorView /> */}

      {/* {user?.creator?.firstName && (
        <Typography variant="h1" gutterBottom>
          Hi, {user?.creator?.firstName}
        </Typography>
      )} */}
    </>
  );
}
