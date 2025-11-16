import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: "VoaTKGxmcvHZpJWJQXHoZQ419GdVTkWk",
});

async function run() {
  const result = await mistral.chat.complete({
    model: "mistral-3b-2410",
    messages: [
      {
        content: UserPrompt,
        role: "user",
      },
    ],
  });

  console.log(result);
}

run();
