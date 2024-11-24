export type TWard = {
  Id?: string;
  Name?: string;
  Level: string;
};
export type TDistrict = {
  Id: string;
  Name: string;
  Wards: TWard[];
};
export type TCity = {
  Id: string;
  Name: string;
  Districts: TDistrict[];
};
