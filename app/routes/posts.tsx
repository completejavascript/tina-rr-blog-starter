import { Button, Card, Grid, Stack, Text, Title } from "@mantine/core";
import { Link, useLoaderData } from "react-router";
import client from "tina/__generated__/client";
import { usePathWithLanguage } from "~/hooks/usePathWithLanguage";
import { getTranslation, useTranslation } from "~/hooks/useTranslation";
import { parseFilename } from "~/utils/file";
import { extractLanguageFromPath, extractLanguageFromUrl } from "~/utils/url";
import type { Route } from "./+types/home";

interface Post {
  slug: string;
  title: string;
}

// Define the type for our loader data
interface LoaderData {
  posts: Post[];
}

export function meta({ location }: Route.MetaArgs) {
  const language = extractLanguageFromPath(location.pathname);

  return [
    { title: getTranslation("posts.meta.title", language) },
    {
      name: "description",
      content: getTranslation("posts.meta.description", language),
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const language = extractLanguageFromUrl(request.url);

  const postsResponse = await client.queries.postConnection();
  const posts =
    postsResponse.data.postConnection.edges
      ?.filter((edge) => {
        if (!edge?.node?._sys.filename) return false;

        const filename = edge.node._sys.filename;
        const { language: fileLanguage } = parseFilename(filename);
        return language === fileLanguage;
      })
      ?.map((edge) => {
        const filename = edge?.node?._sys.filename!;
        const { baseName } = parseFilename(filename);

        return {
          slug: baseName,
          title: edge?.node?.title ?? baseName,
        };
      }) ?? [];

  return {
    posts,
  };
}

export default function BlogsRoute() {
  const { posts } = useLoaderData() as LoaderData;
  const { t } = useTranslation();
  const langPath = usePathWithLanguage();

  return (
    <Stack gap="xl">
      <Title order={1}>{t("posts.title")}</Title>
      <Text c="dimmed" size="lg">
        {t("posts.description")}
      </Text>

      <Grid>
        {posts.map((post) => (
          <Grid.Col key={post.slug} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3}>{post.title}</Title>

                <Button
                  component={Link}
                  to={langPath(`/posts/${post.slug}`)}
                  variant="light"
                  color="blue"
                  fullWidth
                >
                  {t("posts.readArticle")}
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {posts.length === 0 && (
        <Text ta="center" mt="xl">
          {t("posts.noPosts")}
        </Text>
      )}
    </Stack>
  );
}
