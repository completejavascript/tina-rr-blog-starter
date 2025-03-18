import { Container, Flex } from "@mantine/core";
import { Outlet } from "react-router";
import LanguageSwitcher from "~/components/LanguageSwitcher";

const MainLayout: React.FC = () => {
  return (
    <Container size="md" py="xl">
      <Flex justify={"end"}>
        <LanguageSwitcher />
      </Flex>

      <Outlet />
    </Container>
  );
};

export default MainLayout;
