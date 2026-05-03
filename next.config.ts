import million from "million/compiler";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
};

const millionConfig = {
  auto: { rsc: true },
};

export default withNextIntl(
  million.next(nextConfig, millionConfig),
);
