// next-intl
import { getTranslations } from "next-intl/server";
// Components
import { CalculatorPageSkeleton } from "@/components/CalculatorPageSkeleton";

export default async function LocaleHomeLoading() {
  const t = await getTranslations("calculator");
  const label = t("loading");

  return <CalculatorPageSkeleton variant="route" srLabel={label} />;
}
