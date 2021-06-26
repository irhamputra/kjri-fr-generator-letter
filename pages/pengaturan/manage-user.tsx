import * as React from "react";
import { NextPage } from "next";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Pencil, Trash } from "react-bootstrap-icons";
import { toast } from "react-hot-toast";
import useQueryUsers from "../../hooks/query/useQueryUsers";
import { Auth } from "../../typings/AuthQueryClient";
import Link from "next/link";
import RegisterUser from "../../components/RegisterUser";

const ManageUser: NextPage = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const { data: listUsers, isLoading: loadingUser } = useQueryUsers();

  const { mutateAsync } = useMutation(
    "deleteUser",
    async (uid: string) => {
      try {
        const { data } = await axios.delete(`/api/v1/user/${uid}`);

        return data;
      } catch (e) {
        toast.error("Gagal menghapus user!");
        throw new Error(e.message);
      }
    },
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("fetchUser");

        toast.success(data.message);
      },
    }
  );

  if (!query?.isAdmin && query?.role !== "tu") throw Error("Invalid permission");

  if (loadingUser) return <h4>Loading...</h4>;

  return (
    <section style={{ marginTop: "6rem" }}>
      <RegisterUser />
      <table className="table caption-top mt-3">
        <caption>List Staff</caption>
        <thead>
          <tr>
            <th scope="col">NIP</th>
            <th scope="col">Nama Staff</th>
            <th scope="col">Golongan</th>
            <th scope="col">Jabatan</th>
            <th scope="col">Email</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {listUsers?.map?.(
            (v: {
              displayName: string;
              golongan: string;
              nip: string;
              uid: string;
              jabatan: string;
              email: string;
            }) => (
              <tr key={v.uid}>
                <td scope="row">{v.nip}</td>
                <td>{v.displayName}</td>
                <td>{v.golongan}</td>
                <td>{v.jabatan}</td>
                <td>{v.email}</td>
                <td>
                  <div className="d-flex">
                    <Link href={`/profile/${v.uid}`} passHref>
                      <a>
                        <button className="btn-primary btn  mx-1">
                          <Pencil size={20} />
                        </button>
                      </a>
                    </Link>

                    <button
                      onClick={async () => {
                        await mutateAsync(v.uid);
                      }}
                      className="btn-danger btn mx-1"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </section>
  );
};

export default ManageUser;
