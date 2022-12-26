import { useState } from "react";

export default function useCheckToKing(initValue: boolean) {
  const [checkToKing, setCheckToKing] = useState<boolean>(initValue);
  return { checkToKing, setCheckToKing };
}
