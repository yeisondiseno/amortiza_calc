import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import styles from "./page.module.css";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("App");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.description}>{t("description")}</p>
        <div className={styles.card}>
          <h2>Empezando</h2>
          <p>
            Edita <code>app/[locale]/page.tsx</code> para comenzar.
          </p>
        </div>
      </main>
    </div>
  );
}
