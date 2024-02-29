import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Flex, Title } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Navigation } from "./navigation.tsx";

export const Layout = ({ children }: PropsWithChildren) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 65 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex
          direction="row"
          justify="flex-start"
          align="center"
          h="100%"
          pl={16}
          gap={16}
        >
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1}>Educational Research Aide</Title>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navigation />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
