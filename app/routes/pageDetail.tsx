import { Paper, Stack } from "@mantine/core";
import { useLoaderData } from "react-router";
import { client } from "tina/__generated__/client";
import { tinaField, useTina } from "tinacms/dist/react";
import { CustomTinaMarkdown } from "~/components/CustomTinaMarkdown";
import { extractLanguageFromUrl } from "~/utils/url";
import type { Route } from "./+types/pageDetail";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { pageSlug } = params;
  const language = extractLanguageFromUrl(request.url);

  const result = await client.queries.page({
    relativePath: `${pageSlug}.${language}.md`,
  });

  return {
    data: result.data,
    variables: { ...result.variables },
    query: result.query,
  };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: (data as any)?.data?.page?.title ?? "" },
    {
      name: "description",
      content: (data as any)?.data?.page?.description ?? "",
    },
  ];
}

export default function PageDetailRoute() {
  const loaderData = useLoaderData<typeof loader>();

  const { data } = useTina({
    query: loaderData.query,
    variables: loaderData.variables,
    data: loaderData.data,
  });

  const { body } = data.page;

  return (
    <Paper p="xl" withBorder={false}>
      <Stack gap="md">
        <div className="tina-content" data-tina-field={tinaField(data, "page")}>
          <CustomTinaMarkdown content={body} />
        </div>
      </Stack>
    </Paper>
  );
}
