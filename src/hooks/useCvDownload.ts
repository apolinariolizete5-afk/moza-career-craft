import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useSession } from "@/hooks/useSession";
import { createCvPayment, getCvAccess, getCvPrice } from "@/lib/payments.functions";

/** Controla o download do CV: só liberta depois do pagamento confirmado (PaySuite). */
export function useCvDownload() {
  const { user } = useSession();
  const access = useServerFn(getCvAccess);
  const price = useServerFn(getCvPrice);
  const pay = useServerFn(createCvPayment);

  const [paid, setPaid] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    void price().then((r) => active && setAmount(r.price));
    if (user) void access().then((r) => active && setPaid(r.paid));
    else setPaid(false);
    return () => {
      active = false;
    };
  }, [user, access, price]);

  const download = useCallback(async () => {
    if (paid) {
      window.print();
      return;
    }
    if (!user) {
      setMessage("Inicie sessão para pagar e descarregar o seu CV.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const result = await pay({ data: { returnUrl: window.location.href } });
      if (result.ok) window.location.href = result.checkoutUrl;
      else setMessage(result.error);
    } catch {
      setMessage("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }, [paid, user, pay]);

  return { paid, amount, busy, message, download };
}
