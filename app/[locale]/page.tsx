// Next
import { setRequestLocale } from "next-intl/server";

// Components
import { AmortizationCalculator } from "@/components";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

const Home = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AmortizationCalculator />;
};

export default Home;
