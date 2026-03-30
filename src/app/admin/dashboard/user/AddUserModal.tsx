type Props = {
  open: boolean;
  user: any;
  setUser: (v: any) => void;
  onClose: () => void;
  onCreate: () => void;
};

export const AddUserModal = ({
  open,
  user,
  setUser,
  onClose,
  onCreate,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New User</h3>

        <div className="space-y-3">
          {["name", "email", "password"].map((field) => (
            <div key={field}>
              <label className="text-sm capitalize">{field}</label>
              <input
                type={field === "password" ? "password" : "text"}
                className="w-full border rounded-lg p-2"
                value={user[field]}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
              />
            </div>
          ))}

          <div>
            <label className="text-sm">Role</label>
            <select
              className="w-full border rounded-lg p-2"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-primary-2 text-white rounded-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
