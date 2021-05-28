import axios from "axios";

import { useEffect, useState } from "react";
import { useMyQuery } from "../../hooks/useMyQuery";
import { createRampungan } from "../../utils/createHelper";
import FormRampunganFill from "./FormRampunganFill";
import FormSuratStaff from "./FormSuratStaff";

const FormSPD: React.FC<{ editId: string; onPageIndexChange: (val: number) => unknown }> = ({
  editId,
  onPageIndexChange,
}) => {
  const [activePageIndex, setPageIndex] = useState(0);
  const [suratStaff, setSuratStaff] = useState({});

  const [rampunganFill, setRampunganFill] = useState({
    data: [
      {
        nama: "Abui",
        nip: "1212121",
        rampungan: [
          {
            pergiDari: "Frankfurt",
            tanggalPergi: new Date(),
            tibaDi: "Leipzig",
            tanggalTiba: new Date(),
          },
        ],
      },
      {
        nama: "Siapa aja",
        nip: "1234141",
        rampungan: [
          ,
          {
            pergiDari: "Leipzig",
            tanggalPergi: new Date(),
            tibaDi: "Munchen",
            tanggalTiba: new Date(),
          },
        ],
      },
    ],
  });

  const { data: editedData = {}, isFetched } = useMyQuery(
    ["fetchSingleSurat", editId],
    async () => {
      const { data } = await axios.get(`/api/v1/surat-tugas/${editId}`);

      return data;
    },
    {
      enabled: !!editId,
    }
  );
  useEffect(() => {
    setSuratStaff({
      namaPegawai: editedData?.listPegawai || [],
      nomorSurat: editedData?.nomorSurat || "",
      fullDayKurs: 0.84,
    });
  }, [isFetched]);

  useEffect(() => onPageIndexChange(activePageIndex), [activePageIndex]);
  switch (activePageIndex) {
    case 0:
      return (
        <FormSuratStaff
          initialValues={suratStaff}
          onSave={(val) => {
            const rampunganFill = val.namaPegawai?.map(({ pegawai }) => {
              return { nama: pegawai.displayName, nip: pegawai.nip, rampungan: [createRampungan("Frankfurt")] };
            });
            setSuratStaff(val);
            setRampunganFill({ data: rampunganFill });
            setPageIndex((val) => val + 1);
          }}
          editId={editId}
        />
      );
    case 1:
      return <FormRampunganFill initialValues={rampunganFill} onClickBack={() => setPageIndex((val) => val - 1)} />;
    default:
      return <div>Ada</div>;
  }
};

export default FormSPD;
