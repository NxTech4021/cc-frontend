import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useGetMessagesFromThread } from 'src/api/chat';

import Scrollbar from 'src/components/scrollbar';
//  import Lightbox, { useLightBox } from 'src/components/lightbox';


import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';


// ----------------------------------------------------------------------

export default function ChatMessageList({threadId}){
  
  const {messages} = useGetMessagesFromThread (threadId);
  const { messagesEndRef } = useMessagesScroll(messages);
  // console.clear();
  // console.log ('threadss', threadId)
  // console.log ( 'check', messages)
  // console.log('messages',threadId, messages)
  // const slides = messages
  //   .filter((message) => message.contentType === 'image')
  //   .map((message) => ({ src: message.body }));

  // const lightbox = useLightBox();

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        <Box>
          {messages && messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}

              // participants={participants}
              // onOpenLightbox={() => lightbox.onOpen(message.body)}
            />
          ))}
        </Box>
      </Scrollbar>

      {/* <Lightbox
        index={lightbox.selected}

        open={lightbox.open}
        close={lightbox.onClose}
      /> */}
    </>
  );
}

ChatMessageList.propTypes = {
  messages: PropTypes.array,
  threadId: PropTypes.string,
  // participants: PropTypes.array,
};
