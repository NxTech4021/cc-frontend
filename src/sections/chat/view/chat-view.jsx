
import { useEffect} from 'react';
import { useParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';

import ChatNav from '../chat-nav';
// import ChatRoom from '../chat-room';
import ThreadMessages from './threadmessages';
import ChatHeaderDetail from '../chat-header-detail';
import ChatHeaderCompose from '../chat-header-compose';


// ----------------------------------------------------------------------


export default function ChatView() {
  const router = useRouter();
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get('id') || '';
 
  // console.log(user.id);

  const {id} = useParams(); // Extracts the threadId from the route
  
  useEffect(() => {
    if (!selectedConversationId) {
      router.push(paths.dashboard.chat);
    } else {
      // Fetch messages for the selected conversation
      // fetchMessages(selectedConversationId);
    }
  }, [router, selectedConversationId]);


  //  const filteredMessages = messages.filter(message => message.threadId === threadId);

  

  // Head is Showing all the search and names 
  const renderHead = (
    <Stack direction="row" alignItems="center" flexShrink={0} sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72 }}>
      {selectedConversationId ? (
        <ChatHeaderDetail participants={[]} /> 
      ) : (
        <ChatHeaderCompose currentUserId={user.id} />
        // <ChatHeaderCompose currentUserId={user.id} onAddRecipients={handleAddRecipients} />
      )}
    </Stack>
  );

  // Renders the navigation

  const renderNav = (
    <ChatNav
      contacts={[]} 
      selectedConversationId={selectedConversationId}
    />
    
  );


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Chat
      </Typography>

      <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
        {renderNav}

        <Stack sx={{ width: 1, height: 1, overflow: 'hidden' }}>
          {renderHead}

          <Stack
            direction="row"
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >
            
             {id? (
            <ThreadMessages threadId={id} />
          ) : (
            <p>Select a Campaign to view messages</p>
          )}
           
        
            {/* <ChatRoom conversation={messages} participants={[]} /> Update with actual participants */}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

ChatView.propTypes = {
  // id: PropTypes.object.isRequired,
};
