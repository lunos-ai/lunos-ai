import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user preferences
    const preferencesResult = await sql`
      SELECT subjects, plan_type, messages_used_today, last_message_date
      FROM user_preferences 
      WHERE user_id = ${userId}
    `;

    let preferences = {
      subjects: [],
      planType: "orbit",
      messagesUsedToday: 0,
      lastMessageDate: null,
    };

    if (preferencesResult.length > 0) {
      const prefs = preferencesResult[0];
      preferences = {
        subjects: prefs.subjects || [],
        planType: prefs.plan_type || "orbit",
        messagesUsedToday: prefs.messages_used_today || 0,
        lastMessageDate: prefs.last_message_date,
      };
    }

    return Response.json({ preferences });
  } catch (err) {
    console.error("GET /api/preferences error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
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
    const { subjects, planType } = body;

    // Check if preferences exist
    const existingPrefs = await sql`
      SELECT * FROM user_preferences WHERE user_id = ${userId}
    `;

    if (existingPrefs.length > 0) {
      // Update existing preferences
      const setClauses = [];
      const values = [];

      if (subjects !== undefined) {
        setClauses.push(`subjects = $${values.length + 1}`);
        values.push(JSON.stringify(subjects));
      }

      if (planType !== undefined) {
        setClauses.push(`plan_type = $${values.length + 1}`);
        values.push(planType);
      }

      setClauses.push(`updated_at = NOW()`);

      if (setClauses.length > 1) {
        // More than just updated_at
        const query = `
          UPDATE user_preferences 
          SET ${setClauses.join(", ")} 
          WHERE user_id = $${values.length + 1}
          RETURNING subjects, plan_type, messages_used_today, last_message_date
        `;

        const result = await sql(query, [...values, userId]);

        const updatedPrefs = result[0];
        return Response.json({
          preferences: {
            subjects: updatedPrefs.subjects || [],
            planType: updatedPrefs.plan_type,
            messagesUsedToday: updatedPrefs.messages_used_today,
            lastMessageDate: updatedPrefs.last_message_date,
          },
        });
      }
    } else {
      // Create new preferences
      await sql`
        INSERT INTO user_preferences (user_id, subjects, plan_type)
        VALUES (${userId}, ${JSON.stringify(subjects || [])}, ${planType || "orbit"})
      `;
    }

    return Response.json({
      success: true,
      message: "Preferences updated successfully",
    });
  } catch (err) {
    console.error("PUT /api/preferences error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
