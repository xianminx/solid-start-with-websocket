export function GET() {
  const data = {
    message: "Hello World",
  };
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  });
}
