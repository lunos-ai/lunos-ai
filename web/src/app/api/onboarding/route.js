import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, subjects, planType } = body;

    // Validate required fields
    if (!name || !subjects || !planType) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Update user name if provided
    if (name.trim()) {
      await sql`UPDATE auth_users SET name = ${name.trim()}, onboarding_completed = TRUE WHERE id = ${userId}`;
    } else {
      await sql`UPDATE auth_users SET onboarding_completed = TRUE WHERE id = ${userId}`;
    }

    // Create or update user preferences
    const existingPrefs =
      await sql`SELECT * FROM user_preferences WHERE user_id = ${userId}`;

    if (existingPrefs.length > 0) {
      // Update existing preferences
      await sql`
        UPDATE user_preferences 
        SET subjects = ${JSON.stringify(subjects)}, 
            plan_type = ${planType}, 
            updated_at = NOW()
        WHERE user_id = ${userId}
      `;
    } else {
      // Create new preferences
      await sql`
        INSERT INTO user_preferences (user_id, subjects, plan_type)
        VALUES (${userId}, ${JSON.stringify(subjects)}, ${planType})
      `;
    }

    return Response.json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (err) {
    console.error("Onboarding error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
