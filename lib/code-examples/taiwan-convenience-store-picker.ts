export const basic = `import { useState } from "react";
import TaiwanConvenienceStorePicker, { type ConvenienceStore } from "@/components/taiwan/TaiwanConvenienceStorePicker";

export default function PickupAddress() {
  const [store, setStore] = useState<ConvenienceStore | null>(null);
  return <TaiwanConvenienceStorePicker value={store} onChange={setStore} />;
}`;

export const fullProps = `import { useState } from "react";
import TaiwanConvenienceStorePicker, { type ConvenienceStore } from "@/components/taiwan/TaiwanConvenienceStorePicker";

export default function FamilyMartOnly() {
  const [store, setStore] = useState<ConvenienceStore | null>(null);
  return (
    <TaiwanConvenienceStorePicker
      value={store}
      onChange={setStore}
      chains={["family"]}        // restrict to one chain
      defaultCity="臺北市"
    />
  );
}`;

export const formIntegration = `// E-commerce checkout — wire to ECPay logistics API for live store data
import { useEffect, useState } from "react";
import TaiwanConvenienceStorePicker, {
  type ConvenienceStore,
  type ConvenienceChain,
} from "@/components/taiwan/TaiwanConvenienceStorePicker";

interface ECPayStore {
  CVSStoreID: string;
  CVSStoreName: string;
  CVSAddress: string;
  CVSTelephone: string;
}

export default function CheckoutPickupForm() {
  const [stores, setStores] = useState<ConvenienceStore[] | undefined>(undefined);
  const [selected, setSelected] = useState<ConvenienceStore | null>(null);

  useEffect(() => {
    // Fetch from your backend that wraps ECPay's CVS API
    fetch("/api/logistics/cvs?chain=711&city=Taipei")
      .then((r) => r.json() as Promise<{ stores: ECPayStore[] }>)
      .then((data) =>
        setStores(
          data.stores.map((s) => ({
            id: s.CVSStoreID,
            chain: "711" as ConvenienceChain,
            name: s.CVSStoreName,
            address: s.CVSAddress,
            city: "臺北市",
            district: "—",
            postal: "—",
          }))
        )
      );
  }, []);

  return (
    <div>
      <label>取貨門市</label>
      <TaiwanConvenienceStorePicker
        value={selected}
        onChange={setSelected}
        stores={stores}
        chains={["711"]}
      />
      {selected && (
        <input type="hidden" name="cvsStoreId" value={selected.id} />
      )}
    </div>
  );
}`;
