import { useMemo } from "react";
import { useSggList } from "./queries/useSggList";

export const useSggCodeType = ({
  sidoFromUrl = null,
  sggFromUrl = null,
  dongFromUrl = null,
}) => {
  const { data: sggList = [] } = useSggList(sidoFromUrl);

  return useMemo(() => {
    if (!sggFromUrl && !sidoFromUrl) return null;

    const sggStr = String(sggFromUrl);
    const endNumOfSgg = sggStr.slice(-1);

    const isCityWithGu = sggList.some(
      (sgg) =>
        String(sgg.sggCd).startsWith(sggStr.slice(0, -1)) &&
        sgg.sggCd !== sggFromUrl, //자신 코드 제외
    );

    return dongFromUrl === null && Number(endNumOfSgg) === 0 && isCityWithGu
      ? Number(sggStr.slice(0, -1))
      : Number(sggFromUrl);
  }, [sggFromUrl, dongFromUrl, sggList, sidoFromUrl]);
};
