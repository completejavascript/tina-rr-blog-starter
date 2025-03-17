import {
  Anchor,
  Container,
  Image,
  List,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Link } from "react-router";
import logoDark from "~/assets/logo-dark.svg";
import logoLight from "~/assets/logo-light.svg";

export const Welcome: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="xl">
        <Image
          src={isDark ? logoDark : logoLight}
          alt="React Router"
          w={500}
          maw="100vw"
          p="md"
        />

        <Paper w={300} withBorder radius="xl" p="lg" shadow="sm">
          <Stack gap="md">
            <Text c={isDark ? "gray.2" : "gray.7"} ta="center">
              What's next?
            </Text>

            <List spacing="xs">
              {resources.map(({ href, text, icon }) => (
                <List.Item key={href} icon={icon}>
                  <Anchor
                    to={href}
                    component={Link}
                    c={isDark ? "blue.5" : "blue.7"}
                  >
                    {text}
                  </Anchor>
                </List.Item>
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

const resources = [
  {
    href: "/posts",
    text: "Blog Posts",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        style={{
          stroke: "var(--mantine-color-gray-6)",
        }}
      >
        <path
          d="M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];
