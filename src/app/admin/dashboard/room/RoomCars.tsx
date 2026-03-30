export type Room = {
  id: number;
  name: string;
};

type Props = {
  room: Room;
  isEditing: boolean;
  value: string;
  onChange: (v: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
};

export const RoomCard = ({
  room,
  isEditing,
  value,
  onChange,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: Props) => (
  <div className="p-4 border rounded-xl bg-white shadow-sm">
    {!isEditing ? (
      <div className="flex justify-between items-center">
        <p className="font-medium">{room.name}</p>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    ) : (
      <div className="space-y-3">
        <input
          className="w-full border rounded-lg p-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-3 py-1 bg-primary-2 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    )}
  </div>
);
