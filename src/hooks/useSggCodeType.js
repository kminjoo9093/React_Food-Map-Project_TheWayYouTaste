import { useMemo } from "react";
import {
  useSelectedDong,
  useSelectedSgg,
  useSelectedSido,
} from "../store/filters";
import { useSggList } from "./queries/useSggList";

export const useSggCodeType = () => {
  const selectedSido = useSelectedSido();
  const selectedSgg = useSelectedSgg();
  const selectedDong = useSelectedDong();
  const {data: sggList = []} = useSggList(selectedSido);

  return useMemo(() => {
    if (!selectedSgg) return null;

    const sggStr = String(selectedSgg);
    const endNumOfSgg = sggStr.slice(-1);
    
    const isCityWithGu = sggList.some((sgg) =>
      String(sgg.sggCd).startsWith(sggStr.slice(0, -1)) 
        && sgg.sggCd !== selectedSgg //자신 코드 제외
    );

    return selectedDong === null && Number(endNumOfSgg) === 0 && isCityWithGu
      ? Number(sggStr.slice(0, -1))
      : Number(selectedSgg);
  }, [selectedSgg, selectedDong, sggList]);
};
