import Menu from '../Menu';
import MenuItem from '../MenuItem';
import EditIcon from '../icons/EditIcon';
import DeleteIcon from '../icons/DeleteIcon';
import { deleteGroup } from '../../redux/groupsSlice';
import { useConfirm } from '../../contexts/ConfirmContext/ConfirmContext';
import { useSnackbar } from '../../contexts/SnackbarContext/SnackbarContext';
import type { GroupObject } from '../../types';
import GroupEditor from './GroupEditor';
import { useAppDispatch } from '../../redux/hooks';
import { Link } from '@tanstack/react-router';

type GroupCardProps = {
  group: GroupObject;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<string>>;
}

export default function GroupCard({ group, isEditing, setIsEditing }: GroupCardProps) {
  const showConfirm = useConfirm();
  const showSnackbar = useSnackbar();
  const dispatch = useAppDispatch();

  if (isEditing) {
    return (
      <div className="text-base">
        <GroupEditor
          mode="edit"
          currGroup={group}
          closeHandler={() => setIsEditing("")}
        />
      </div>
    )
  }

  return (
    <div className="group relative hover:cursor-pointer hover:bg-gray-100">
      <Link
        to="/groups/$groupID"
        params={{ groupID: group.id }}
        className="p-2 block border-b border-b-gray-200 truncate w-full"
      >
        {group.title}
      </Link>
      <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 text-base">
        <Menu>
          <MenuItem onClick={() => setIsEditing(group.id)}>
            <EditIcon />
            Edit
          </MenuItem>
          <MenuItem onClick={() => {
            showConfirm({
              message: "This action can not be reversed. Are you sure?",
              cancelText: "Cancel",
              confirmText: "Yes, delete this group",
              onConfirm: () => {
                showSnackbar({ message: "Group deleted" });
                dispatch(deleteGroup(group.id))
              },
            })
          }}
          >
            <DeleteIcon />
            Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}