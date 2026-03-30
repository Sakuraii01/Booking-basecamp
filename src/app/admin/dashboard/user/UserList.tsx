import { EditUserForm } from "./EditUserForm";
import { UserCard } from "./UserCard";
import { AddUserModal } from "./AddUserModal";
export type User = {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
};

interface UserListProps {
  userData: User[];
  editingId: number | null;

  startEdit: (user: User) => void;
  cancelEdit: () => void;
  saveUser: (id: number) => void;
  fetchUsers: () => void;

  form: {
    email: string;
    name: string;
    role: "ADMIN" | "USER";
    password?: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      email: string;
      name: string;
      role: "ADMIN" | "USER";
      password: string;
    }>
  >;

  showAdd: boolean;
  setShowAdd: React.Dispatch<React.SetStateAction<boolean>>;

  newUser: {
    email: string;
    name: string;
    role: "ADMIN" | "USER";
    password: string;
  };
  setNewUser: React.Dispatch<
    React.SetStateAction<{
      email: string;
      name: string;
      role: "ADMIN" | "USER";
      password: string;
    }>
  >;
}

export const UserList = ({
  userData,
  editingId,
  startEdit,
  cancelEdit,
  saveUser,
  form,
  setForm,
  showAdd,
  setShowAdd,
  newUser,
  setNewUser,
  fetchUsers,
}: UserListProps) => {
  const handleDelete = async (id: number) => {
    const ok = confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    await fetch(`/api/admin/user`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    fetchUsers();

    // re-fetch users หรือ mutate state
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">
          Total Users: {userData?.length || 0}
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-primary-2 text-white rounded-lg"
        >
          + Add User
        </button>
      </div>

      <div className="space-y-4">
        {userData?.map((user: any) => (
          <div key={user.id}>
            {editingId === user.id ? (
              <EditUserForm
                form={form}
                setForm={setForm}
                onCancel={cancelEdit}
                onSave={() => saveUser(user.id)}
              />
            ) : (
              <UserCard
                user={user}
                onEdit={() => startEdit(user)}
                onDelete={() => handleDelete(user.id)}
              />
            )}
          </div>
        ))}
      </div>

      <AddUserModal
        open={showAdd}
        user={newUser}
        setUser={setNewUser}
        onClose={() => setShowAdd(false)}
        onCreate={async () => {
          await fetch("/api/admin/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          }).then((res) => {
            if (res.status === 201) {
              setNewUser({
                email: "",
                name: "",
                role: "USER",
                password: "",
              });
            }
            if (res.status === 500) {
              alert("Failed to create user. Please try again.");
            }
          });
          setShowAdd(false);
          fetchUsers();
        }}
      />
    </div>
  );
};
