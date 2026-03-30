type Props = {
  form: any;
  setForm: (v: any) => void;
  onCancel: () => void;
  onSave: () => void;
};

export const EditUserForm = ({ form, setForm, onCancel, onSave }: Props) => (
  <div className="grid grid-cols-2 gap-4">
    {["name", "email"].map((field) => (
      <div key={field}>
        <label className="text-sm capitalize">{field}</label>
        <input
          className="w-full border rounded-lg p-2"
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        />
      </div>
    ))}

    <div>
      <label className="text-sm">Role</label>
      <select
        className="w-full border rounded-lg p-2"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
    </div>

    <div>
      <label className="text-sm">
        New Password <span className="text-gray-400">(optional)</span>
      </label>
      <input
        type="password"
        className="w-full border rounded-lg p-2"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
    </div>

    <div className="col-span-2 flex justify-end gap-3">
      <button onClick={onCancel} className="px-4 py-2 border rounded-lg">
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-primary-2 text-white rounded-lg"
      >
        Save
      </button>
    </div>
  </div>
);
