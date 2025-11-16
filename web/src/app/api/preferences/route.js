import supabase from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: prefs, error } = await supabase
      .from("user_preferences")
      .select("subjects, plan_type, messages_used_today, last_message_date")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    const preferences = prefs
      ? {
          subjects: prefs.subjects || [],
          planType: prefs.plan_type || "orbit",
          messagesUsedToday: prefs.messages_used_today || 0,
          lastMessageDate: prefs.last_message_date,
        }
      : {
          subjects: [],
          planType: "orbit",
          messagesUsedToday: 0,
          lastMessageDate: null,
        };

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

    const { data: existingPrefs, error: selectError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existingPrefs) {
      const updateData = {};
      if (subjects !== undefined) {
        updateData.subjects = subjects;
      }
      if (planType !== undefined) {
        updateData.plan_type = planType;
      }

      if (Object.keys(updateData).length > 0) {
        const { data: updatedPrefs, error: updateError } = await supabase
          .from("user_preferences")
          .update(updateData)
          .eq("user_id", userId)
          .select("subjects, plan_type, messages_used_today, last_message_date");

        if (updateError) throw updateError;

        const prefs = updatedPrefs?.[0];
        if (prefs) {
          return Response.json({
            preferences: {
              subjects: prefs.subjects || [],
              planType: prefs.plan_type,
              messagesUsedToday: prefs.messages_used_today,
              lastMessageDate: prefs.last_message_date,
            },
          });
        }
      }
    } else {
      const { error: insertError } = await supabase
        .from("user_preferences")
        .insert({
          user_id: userId,
          subjects: subjects || [],
          plan_type: planType || "orbit",
        });

      if (insertError) throw insertError;
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
