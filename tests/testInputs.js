const API_URL = process.env.TEST_API_URL || "http://localhost:3000/api/chat";

const testMessages = [
  "how do i sort a list of objects in python?",
  "explain this sql query for me",
  "This paragraph sounds awkward, can you help me fix it?",
  "I'm preparing for a job interview, any tips?",
  "what's the average of these numbers: 12,45,23,67,34",
  "Help me make this better.",
  "I need to write a function that takes a user id and returns their profile.",
  "hey",
  "Can you write me a poem about clouds?",
  "Rewrite this sentence to be more professional.",
  "I'm not sure what to do with my career.",
  "what is a pivot table",
  "fxi thsi bug pls: for i in range(10) print(i)",
  "How do I structure a cover letter?",
  "My boss says my writing is too verbose."
];

async function sendMessage(message) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const payload = await response.json().catch(() => ({}));
  return {
    status: response.status,
    ok: response.ok,
    payload
  };
}

async function run() {
  console.log(`Sending ${testMessages.length} test inputs to ${API_URL}\n`);

  for (const message of testMessages) {
    try {
      const result = await sendMessage(message);
      console.log("Input:", message);
      console.log("Status:", result.status);
      console.log(
        "Output:",
        JSON.stringify(result.payload, null, 2)
      );
      console.log("--------------------------------------------------\n");
    } catch (error) {
      console.log("Input:", message);
      console.log("Error:", error.message);
      console.log("--------------------------------------------------\n");
    }
  }
}

run();
