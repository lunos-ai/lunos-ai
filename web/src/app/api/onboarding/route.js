import supabase from "@/app/api/utils/sql";
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

    if (!subjects || !planType) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (name?.trim()) {
      const { error: userError } = await supabase
        .from("auth_users")
        .update({ name: name.trim() })
        .eq("id", userId);

      if (userError) throw userError;
    }

    const { data: existingPrefs, error: selectError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existingPrefs) {
      const { error: updateError } = await supabase
        .from("user_preferences")
        .update({
          subjects: subjects,
          plan_type: planType,
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("user_preferences")
        .insert({
          user_id: userId,
          subjects: subjects,
          plan_type: planType,
        });

      if (insertError) throw insertError;
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
