import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import KanbanDetails from './kanban-details';

// ----------------------------------------------------------------------

export default function KanbanTaskItem({
  task,
  index,
  column,
  onDeleteTask,
  onUpdateTask,
  sx,
  ...other
}) {
  const theme = useTheme();

  const openDetails = useBoolean();

  const renderInfo = (
    <Stack direction="row" alignItems="center">
      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        sx={{
          typography: 'caption',
          color: 'text.disabled',
        }}
      >
        <Iconify width={16} icon="solar:chat-round-dots-bold" sx={{ mr: 0.25 }} />
        {/* <Box component="span" sx={{ mr: 1 }}>
          {task.comments.length}
        </Box> */}

        <Iconify width={16} icon="eva:attach-2-fill" sx={{ mr: 0.25 }} />
        {/* <Box component="span">{task.attachments.length}</Box> */}
      </Stack>

      {/* <AvatarGroup
        sx={{
          [`& .${avatarGroupClasses.avatar}`]: {
            width: 24,
            height: 24,
          },
        }}
      >
        {task.assignee.map((user) => (
          <Avatar key={user.id} alt={user.name} src={user.avatarUrl} />
        ))}
      </AvatarGroup> */}
    </Stack>
  );

  return (
    <>
      <Draggable draggableId={task.id} index={index} isDragDisabled>
        {(provided, snapshot) => (
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={openDetails.onTrue}
            sx={{
              width: 1,
              borderRadius: 1.5,
              overflow: 'hidden',
              position: 'relative',
              bgcolor: 'background.default',
              boxShadow: theme.customShadows.z1,
              '&:hover': {
                boxShadow: theme.customShadows.z20,
              },
              ...(openDetails.value && {
                boxShadow: theme.customShadows.z20,
              }),
              ...(snapshot.isDragging && {
                boxShadow: theme.customShadows.z20,
                ...bgBlur({
                  opacity: 0.48,
                  color: theme.palette.background.default,
                }),
              }),
              ...sx,
            }}
            {...other}
          >
            {/* {!!task.attachments.length && renderImg} */}
            <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>

              <ListItemText
                primary={task?.name}
                secondary={task?.submission?.campaign?.name}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                }}
              />
              {/* <Typography variant="subtitle2">{task?.name}</Typography> */}
              {/* <Typography variant="subtitle2">{task?.submission?.campaign?.name}</Typography> */}

              {/* {renderInfo} */}
            </Stack>
          </Paper>
        )}
      </Draggable>

      <KanbanDetails
        task={task}
        column={column}
        openDetails={openDetails.value}
        onCloseDetails={openDetails.onFalse}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
        status={other.status}
      />
    </>
  );
}

KanbanTaskItem.propTypes = {
  index: PropTypes.number,
  onDeleteTask: PropTypes.func,
  onUpdateTask: PropTypes.func,
  sx: PropTypes.object,
  column: PropTypes.object,
  task: PropTypes.object,
};
