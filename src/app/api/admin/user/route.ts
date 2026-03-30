import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getUser, createUser, updateUser, deleteUser } from "./query";

export async function GET() {
  try {
    const users = await getUser();
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, name, password, role } = await req.json();

    if (!email || !name || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, name, hashedPassword, role);

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, email, name, password, role } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const data: any = {};

    if (email) data.email = email;
    if (name) data.name = name;
    if (role) data.role = role;

    if (password && password.trim() !== "") {
      data.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const user = await updateUser(id, data);

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const user = await deleteUser(id);

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
