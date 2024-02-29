import { Flex, NavLink } from "@mantine/core";
import { Link, useRouterState } from "@tanstack/react-router";

const routes = [
  {
    title: "Home",
    route: "/",
  },
  {
    title: "Education Level of Jobs",
    route: "/jobs/education-levels",
  },
];

export const Navigation = () => {
  const router = useRouterState();
  const currentRoute = router.location.pathname;

  return (
    <Flex direction="column">
      {routes.map((route) => {
        return (
          <NavLink
            key={route.route}
            component={Link}
            href={route.route}
            to={route.route}
            label={route.title}
            active={currentRoute === route.route}
          />
        );
      })}
    </Flex>
  );
};
