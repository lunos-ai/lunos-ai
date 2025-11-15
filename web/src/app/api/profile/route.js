'use server';

import { auth } from "@/auth";
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { data, error } = await supabase
      .from('auth_users')
      .select('id, name, email, image')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return Response.json({ user: data });
  } catch (err) {
    console.error("GET /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, email, password } = body || {};

    const updateData = {};

    if (typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim();
    }

    if (typeof email === "string" && email.trim().length > 0) {
      updateData.email = email.trim();
    }

    if (typeof password === "string" && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { error } = await supabase
        .from('auth_accounts')
        .update({ password: hashedPassword })
        .eq('userId', userId)
        .eq('provider', 'credentials');
      if (error) throw error;
    }

    if (Object.keys(updateData).length === 0 && !password) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    let updatedUser = null;

    if (Object.keys(updateData).length > 0) {
      const { data, error } = await supabase
        .from('auth_users')
        .update(updateData)
        .eq('id', userId)
        .select('id, name, email, image');
      if (error) throw error;
      updatedUser = data?.[0] || null;
    } else {
      const { data, error } = await supabase
        .from('auth_users')
        .select('id, name, email, image')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      updatedUser = data;
    }

    return Response.json({ user: updatedUser });
  } catch (err) {
    console.error("PUT /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { error } = await supabase
      .from('auth_users')
      .delete()
      .eq('id', userId);
    if (error) throw error;

    return Response.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
