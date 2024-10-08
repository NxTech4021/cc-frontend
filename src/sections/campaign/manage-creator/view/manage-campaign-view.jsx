import React, { useMemo, useState } from 'react';

import { Tab, Tabs, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetCampaignByCreatorId } from 'src/hooks/use-get-campaign-based-on-creator-id';

import { useAuthContext } from 'src/auth/hooks';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import MyCampaignView from '../my-campaign';
import AppliedCampaignView from '../applied-campaign-view';

const ManageCampaignView = () => {
  const [currentTab, setCurrentTab] = useState('myCampaign');
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { user } = useAuthContext();
  const { data, isLoading } = useGetCampaignByCreatorId();

  const filteredData = useMemo(
    () =>
      query
        ? data?.campaigns?.filter((elem) => elem.name.toLowerCase()?.includes(query.toLowerCase()))
        : data?.campaigns,
    [data, query]
  );

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={(e, val) => setCurrentTab(val)}
      sx={{
        mt: 2,
      }}
    >
      <Tab value="myCampaign" label="Active Campaigns" />
      <Tab value="applied" label="My Applications" />
      <Tab value="completed" label="Completed Campaigns" />
    </Tabs>
  );

  const handleClick = (id) => {
    router.push(paths.dashboard.campaign.creator.detail(id));
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading="Campaigns"
        links={[
          {
            name: 'Dashboard',
            href: paths.root,
          },
          { name: 'Campaign', href: paths.dashboard.campaign.creator.manage },
          { name: 'Lists' },
        ]}
      />
      {renderTabs}

      {currentTab === 'myCampaign' && !isLoading && (
        <MyCampaignView
          query={query}
          setQuery={setQuery}
          // filteredData={filteredData}
          filteredData={filteredData.filter(
            (campaign) =>
              !campaign?.shortlisted?.find((item) => item.userId === user.id).isCampaignDone
          )}
          onClick={handleClick}
        />
      )}
      {currentTab === 'applied' && <AppliedCampaignView />}
      {currentTab === 'completed' && !isLoading && (
        <MyCampaignView
          query={query}
          setQuery={setQuery}
          filteredData={filteredData.filter(
            (campaign) =>
              campaign?.shortlisted?.find((item) => item.userId === user.id).isCampaignDone
          )}
          onClick={handleClick}
        />
      )}
    </Container>
  );
};

export default ManageCampaignView;

// ManageCampaignView.propTypes = {};
