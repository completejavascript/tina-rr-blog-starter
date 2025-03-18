import { Button, Card, Grid, Stack, Text, Title } from "@mantine/core";
import { Link, useLoaderData } from "react-router";
import { useTranslation } from "~/hooks/useTranslation";
import { getPostsFromLanguage } from "~/utils/tina";
import { extractLanguageFromUrl } from "~/utils/url";
import type { Route } from "./+types/home";

interface Post {
  slug: string;
  title: string;
}

// Define the type for our loader data
interface LoaderData {
  posts: Post[];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog Posts" },
    {
      name: "description",
      content: "Browse our collection of blog posts",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = request.url;
  const languageFromUrl = extractLanguageFromUrl(url);
  const posts = await getPostsFromLanguage(languageFromUrl);

  return {
    posts,
  };
}

export default function BlogsRoute() {
  const { posts } = useLoaderData() as LoaderData;
  const { t } = useTranslation();

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
                  to={`/posts/${post.slug}`}
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
