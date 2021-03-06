import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

const LetterType: NextPage = () => {
  const { query } = useRouter();

  return (
    <>
      <h1>Letter Type {query.type}</h1>
    </>
  );
};

export default LetterType;
