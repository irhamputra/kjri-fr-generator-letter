import { formatCurrencyToEUR } from "../utils/numberHelper";
import useQueryJalDir from "./query/useQueryJalDir";

const useCountUangHarianSPD = () => {
  const { data: listJalDir, isLoading: jalDirLoading } = useQueryJalDir();

  const countDailyCostSPD = (jaldis: string, duration: string, fullDayKurs: number) => {
    const [fullDayDur, halfDayDur = ""] = duration.split(",");

    let halfDay = 0;

    const days = parseFloat(fullDayDur) * fullDayKurs * parseFloat(jaldis);
    const oneFullDay = fullDayKurs * parseFloat(jaldis);

    if (halfDayDur === "5") {
      halfDay = oneFullDay * 0.4;
    }

    return days + halfDay || 0;
  };

  const count = (golPegawai: string, durasi: string, fullDayKurs: number) => {
    const indexGolongan = listJalDir.findIndex(({ golongan }: { golongan: string }) => golongan === golPegawai);
    const gol = listJalDir[indexGolongan];
    const total = countDailyCostSPD(gol?.harga, durasi, fullDayKurs);
    return !jalDirLoading ? total : 0;
  };

  const countToUER = (golPegawai: string, durasi: string, fullDayKurs: number) =>
    !jalDirLoading
      ? formatCurrencyToEUR(count(golPegawai, durasi, fullDayKurs))
      : "Can't count now. please try again later.";

  return { count, countToUER, jalDirLoading };
};

export default useCountUangHarianSPD;
