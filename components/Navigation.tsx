import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navigation: React.FC = () => {
  const { pathname } = useRouter();

  const isLoginPage = pathname === "/login";
  const isDashboardPage = pathname.includes("/dashboard");

  if (isDashboardPage) return null;

  return (
    <header>
      {isLoginPage ? (
        <Link href="/">
          <a>Home</a>
        </Link>
      ) : (
        <Link href="/login">
          <a>Login</a>
        </Link>
      )}
    </header>
  );
};

export default Navigation;
