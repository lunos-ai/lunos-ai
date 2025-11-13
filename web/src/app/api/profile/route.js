import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { hash } from "argon2";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rows = await sql`
      SELECT id, name, email, image, onboarding_completed 
      FROM auth_users 
      WHERE id = ${userId} 
      LIMIT 1
    `;

    const user = rows?.[0] || null;
    return Response.json({ user });
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

    const setClauses = [];
    const values = [];

    if (typeof name === "string" && name.trim().length > 0) {
      setClauses.push(`name = $${values.length + 1}`);
      values.push(name.trim());
    }

    if (typeof email === "string" && email.trim().length > 0) {
      setClauses.push(`email = $${values.length + 1}`);
      values.push(email.trim());
    }

    // Handle password update
    if (typeof password === "string" && password.length > 0) {
      const hashedPassword = await hash(password);

      // Update password in auth_accounts table
      await sql`
        UPDATE auth_accounts 
        SET password = ${hashedPassword}
        WHERE "userId" = ${userId} AND provider = 'credentials'
      `;
    }

    if (setClauses.length === 0 && !password) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    let updatedUser = null;

    if (setClauses.length > 0) {
      const finalQuery = `
        UPDATE auth_users 
        SET ${setClauses.join(", ")} 
        WHERE id = $${values.length + 1} 
        RETURNING id, name, email, image, onboarding_completed
      `;

      const result = await sql(finalQuery, [...values, userId]);
      updatedUser = result?.[0] || null;
    } else {
      // If only password was updated, get current user data
      const result = await sql`
        SELECT id, name, email, image, onboarding_completed 
        FROM auth_users 
        WHERE id = ${userId}
      `;
      updatedUser = result?.[0] || null;
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

    // Delete user and all related data (cascading deletes will handle related tables)
    await sql`DELETE FROM auth_users WHERE id = ${userId}`;

    return Response.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
