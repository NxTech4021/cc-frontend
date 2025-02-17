import PropTypes from 'prop-types';
import EmojiPicker from 'emoji-picker-react';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatMessageInput({ disabled, onSendMessage }) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const inputRef = useRef(null); // Reference to the input field

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim(); // Remove unnecessary spaces
    if (trimmedMessage !== '') {
      onSendMessage(trimmedMessage);
      setMessage(''); // Clear the message after sending
    }
  }, [message, onSendMessage]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter behavior
      handleSendMessage(); // Send the message
    }
  };

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiSelect = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);

    // Refocus the input field after selecting an emoji
    inputRef.current.focus();
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="normal"
      overflow="hidden"
      sx={{
        borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        px: 1,
        minHeight: 56,
        maxHeight: 100,
      }}
    >
      <IconButton onClick={toggleEmojiPicker} sx={{ alignSelf: 'center' }}>
        <Iconify icon="eva:smiling-face-fill" />
      </IconButton>
      {showEmojiPicker && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '60px',
            left: '10px',
            bgcolor: 'background.paper',
            boxShadow: 3,
            borderRadius: 1,
            p: 1,
            zIndex: 1000,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </Box>
      )}
      <InputBase
        multiline
        value={message}
        onKeyDown={handleKeyDown} // Handles sending the message only on Enter
        onChange={handleChangeMessage}
        placeholder="Type your message here"
        disabled={disabled}
        inputRef={inputRef} // Attach the ref to the input field
        sx={{
          maxHeight: 100,
          flexGrow: 1,
          overflow: 'auto',
        }}
      />
      <Button color="secondary" onClick={handleSendMessage} sx={{ alignSelf: 'center' }}>
        Send
      </Button>
    </Stack>
  );
}

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  onSendMessage: PropTypes.func.isRequired,
};
