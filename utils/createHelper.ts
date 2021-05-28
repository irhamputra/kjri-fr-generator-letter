const createRampungan = (pergiDari: string = "", tanggalPergi: Date = new Date()) => {
  return {
    pergiDari: pergiDari,
    tanggalPergi: tanggalPergi,
    tibaDi: "",
    tanggalTiba: new Date(),
  };
};

export { createRampungan };
