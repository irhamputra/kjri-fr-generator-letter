import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import ManageUserForm from "../../components/forms/ManageUser";

const UserName: NextPage = () => {
  const {
    query: { id },
  } = useRouter();
  return (
    <div>
      <ManageUserForm userId={id as string} />
    </div>
  );
};

export default UserName;
