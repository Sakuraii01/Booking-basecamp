type Props = {
  user: any;
  onEdit: () => void;
  onDelete: () => void;
};

export const UserCard = ({ user, onEdit, onDelete }: Props) => (
  <div className="border rounded-xl p-4 shadow-sm bg-white flex justify-between items-center">
    <div>
      <p className="font-medium">{user.name}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
      <span
        className={`inline-block mt-1 px-3 py-1 text-xs rounded-full
          ${
            user.role === "ADMIN"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
      >
        {user.role}
      </span>
    </div>
    <div>
      <button
        onClick={onEdit}
        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="ml-3 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  </div>
);
