import {
  Anchor,
  Blockquote,
  Code,
  Divider,
  Image,
  Kbd,
  List,
  Mark,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck, IconCircleDot } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router";
import { TinaMarkdown, type TinaMarkdownContent } from "tinacms/dist/rich-text";

interface CustomTinaMarkdownProps {
  content: TinaMarkdownContent;
}

export const CustomTinaMarkdown: React.FC<CustomTinaMarkdownProps> = ({
  content,
}) => {
  return <TinaMarkdown content={content} components={components} />;
};

const components = {
  // Headings
  h1: (props: any) => <Title order={1} mb="md" mt="xl" {...props} />,
  h2: (props: any) => <Title order={2} mb="md" mt="xl" {...props} />,
  h3: (props: any) => <Title order={3} mb="sm" mt="lg" {...props} />,
  h4: (props: any) => <Title order={4} mb="sm" mt="md" {...props} />,
  h5: (props: any) => <Title order={5} mb="xs" mt="sm" {...props} />,
  h6: (props: any) => <Title order={6} mb="xs" mt="xs" {...props} />,

  // Paragraph and basic text
  p: (props: any) => <Text mb="md" size="md" {...props} />,

  // Lists
  ul: (props: any) => <List mb="md" spacing="xs" {...props} />,
  ol: (props: any) => <List mb="md" spacing="xs" type="ordered" {...props} />,
  li: (props: any) => <List.Item {...props} />,

  // Block elements
  blockquote: (props: any) => (
    <Blockquote color="blue" mb="md" mt="md" cite={props.cite} {...props} />
  ),

  // Code blocks
  code_block: (props: any) => (
    <Code block lang={props.language} mb="lg" mt="md">
      {props.value}
    </Code>
  ),

  // Inline elements
  code: (props: any) => <Code {...props} />,
  em: (props: any) => <Text component="em" fs="italic" {...props} />,
  strong: (props: any) => <Text component="strong" fw={700} {...props} />,
  del: (props: any) => <Text component="del" td="line-through" {...props} />,
  hr: () => <Divider my="lg" />,

  // Links and media
  a: (props: any) => {
    const isExternal = props.url.startsWith("http");

    return (
      <Anchor
        component={isExternal ? "a" : Link}
        href={props.url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {props.children}
      </Anchor>
    );
  },
  img: (props: any) => (
    <Image src={props.url} alt={props.alt || ""} title={props.title} my="md" />
  ),

  // Tables
  table: (props: any) => <Table mb="lg" {...props} />,
  thead: (props: any) => <Table.Thead {...props} />,
  tbody: (props: any) => <Table.Tbody {...props} />,
  tr: (props: any) => <Table.Tr {...props} />,
  td: (props: any) => <Table.Td {...props} />,
  th: (props: any) => <Table.Th {...props} />,

  // Special inline elements
  mark: (props: any) => <Mark {...props} />,
  kbd: (props: any) => <Kbd {...props} />,

  // Specific Tina components
  rich_text: (props: any) => <div {...props} />,

  // Task lists (checkboxes)
  task_list_item: (props: any) => {
    const { checked } = props;
    return (
      <List.Item
        icon={
          <ThemeIcon color={checked ? "green" : "gray"} size={20} radius="xl">
            {checked ? (
              <IconCircleCheck size={12} />
            ) : (
              <IconCircleDot size={12} />
            )}
          </ThemeIcon>
        }
        {...props}
      />
    );
  },
};
