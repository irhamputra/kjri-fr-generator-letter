import * as React from "react";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import parseCookies from "../../utils/parseCookies";

const Dashboard: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <DashboardLayout>
      <h1>Dashboard</h1>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = parseCookies(req);

  return {
    props: {
      cookie,
    },
  };
};

export default Dashboard;
