import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Remix Framework Starter | Dev Hub" }];
};

export const loader: LoaderFunction = async () => {
  return json({
    framework: "Remix 2.8",
    message: "Resilient server-first mutations and nested layouts",
    uptimeSeconds: process.uptime()
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h1>{data.framework} Starter</h1>
      <p>{data.message}</p>
      <pre style={{ background: "#1e293b", padding: "1rem", borderRadius: "8px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
