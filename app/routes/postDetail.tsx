import { Paper, Stack, Title } from "@mantine/core";
import { useLoaderData } from "react-router";
import { client } from "tina/__generated__/client";
import { tinaField, useTina } from "tinacms/dist/react";
import { CustomTinaMarkdown } from "~/components/CustomTinaMarkdown";
import type { Route } from "./+types/home";
import { extractLanguageFromUrl } from "~/utils/url";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hello world" },
    {
      name: "description",
      content: "Hello world content from content directory",
    },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;
  const url = request.url;
  const language = extractLanguageFromUrl(url);

  const result = await client.queries.post({
    relativePath: `${slug}.${language}.md`,
  });

  return {
    data: result.data,
    variables: { ...result.variables },
    query: result.query,
  };
}

export default function BlogDetailRoute() {
  const loaderData = useLoaderData<typeof loader>();

  const { data } = useTina({
    query: loaderData.query,
    variables: loaderData.variables,
    data: loaderData.data,
  });

  const { title, body } = data.post;

  return (
    <Paper p="lg" shadow="sm" withBorder>
      <Stack gap="md">
        <Title order={1}>{title}</Title>

        <div className="tina-content" data-tina-field={tinaField(data, "post")}>
          <CustomTinaMarkdown content={body} />
        </div>
      </Stack>
    </Paper>
  );
}
