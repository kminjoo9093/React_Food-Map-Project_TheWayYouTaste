import { useMemo } from "react";
import { useSggList } from "./queries/useSggList";

type UseSggCodeTypeParams = {
    sidoFromUrl: string | null,
  sggFromUrl: string | null,
  dongFromUrl: string | null,
}

export const useSggCodeType = ({
  sidoFromUrl = null,
  sggFromUrl = null,
  dongFromUrl = null,
} : UseSggCodeTypeParams) : number | null => {
  const sidoCode = sidoFromUrl !== null ? Number(sidoFromUrl) : null;
  const sggCode = sggFromUrl !== null ? Number(sggFromUrl) : null;
  const dongCode = dongFromUrl !== null ? Number(dongFromUrl) : null;

  const { data: sggList = [] } = useSggList(sidoCode);

  return useMemo(() => {
    if (sggFromUrl === null) return null;

    const endNumOfSgg = sggFromUrl.slice(-1);
    const cityPrefix = sggFromUrl.slice(0, -1);

    const isCityWithGu = sggList.some(
      (sgg) =>
        String(sgg.sggCd).startsWith(cityPrefix) &&
        sgg.sggCd !== sggCode, //자신 코드 제외
    );

    return dongCode === null && Number(endNumOfSgg) === 0 && isCityWithGu
      ? Number(sggFromUrl.slice(0, -1))
      : sggCode;
  }, [sggFromUrl, sggCode, dongCode, sggList]);
};
