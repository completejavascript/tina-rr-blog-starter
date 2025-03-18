import { Container } from "@mantine/core";
import { Outlet } from "react-router";
import LanguageSwitcher from "~/components/LanguageSwitcher";

interface LanguageSwitcherProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<LanguageSwitcherProps> = ({ children }) => {
  return (
    <Container size="md" py="xl">
      <LanguageSwitcher />
      {children}
    </Container>
  );
};
