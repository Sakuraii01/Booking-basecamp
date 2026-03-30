"use client";
import { Navbar } from "../../component/navbar";
import useViewModel from "./viewModel";

import { useState } from "react";
import { UserList } from "./user/UserList";
import { RoomCard } from "./room/RoomCars";

type Role = "ADMIN" | "USER";

const AdminDashboardPage = () => {
  const { loading, rooms, userData, fetchData } = useViewModel();

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [roomName, setRoomName] = useState("");
  const [newRoomName, setNewRoomName] = useState("");

  const [form, setForm] = useState({
    email: "",
    name: "",
    role: "USER" as Role,
    password: "",
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "USER" as Role,
    password: "",
  });

  const startEdit = (user: any) => {
    setEditingId(user.id);
    setForm({
      email: user.email,
      name: user.name,
      role: user.role,
      password: "",
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ email: "", name: "", role: "USER", password: "" });
  };

  const saveUser = async (id: number) => {
    await fetch(`/api/admin/user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        email: form.email,
        name: form.name,
        role: form.role,
        ...(form.password && { password: form.password }),
      }),
    });

    cancelEdit();
    fetchData();
  };

  const startEditRoom = (room: any) => {
    setEditingRoomId(room.id);
    setRoomName(room.name);
  };

  const cancelEditRoom = () => {
    setEditingRoomId(null);
    setRoomName("");
  };

  const saveRoom = async (id: number) => {
    await fetch(`/api/admin/room`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, name: roomName }),
    });

    cancelEditRoom();
    fetchData();
  };

  const deleteRoom = async (id: number) => {
    if (!confirm("Delete this room?")) return;

    await fetch(`/api/admin/room`, {
      method: "DELETE",
      body: JSON.stringify({ id: id }),
    });
    fetchData();
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    await fetch("/api/admin/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRoomName }),
    });

    setNewRoomName("");
    fetchData();
  };

  return (
    <div className="m-4 flex gap-4">
      <Navbar />

      <section className="flex-1 p-6 bg-white rounded-2xl shadow-md">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Rooms */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-3">Rooms</h2>

          {/* Create */}
          <div className="flex gap-2 mb-4">
            <input
              className="border rounded-lg p-2 flex-1"
              placeholder="New room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button
              onClick={createRoom}
              className="px-4 py-2 bg-primary-2 text-white rounded-lg"
            >
              Add
            </button>
          </div>

          {/* List */}
          <div className="grid grid-cols-2 gap-4">
            {rooms?.rooms?.map((room: any) => (
              <RoomCard
                key={room.id}
                room={room}
                isEditing={editingRoomId === room.id}
                value={roomName}
                onChange={setRoomName}
                onEdit={() => startEditRoom(room)}
                onCancel={cancelEditRoom}
                onSave={() => saveRoom(room.id)}
                onDelete={() => deleteRoom(room.id)}
              />
            ))}
          </div>
        </div>

        <UserList
          userData={userData}
          editingId={editingId}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveUser={saveUser}
          form={form}
          setForm={setForm}
          showAdd={showAdd}
          setShowAdd={setShowAdd}
          newUser={newUser}
          setNewUser={setNewUser}
          fetchUsers={fetchData}
        />
      </section>
    </div>
  );
};

export default AdminDashboardPage;
