import client from "tina/__generated__/client";
import { parseFilename } from "./file";

export const getPostsFromLanguage = async (language: string) => {
  const postsResponse = await client.queries.postConnection();

  return (
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
      }) ?? []
  );
};
