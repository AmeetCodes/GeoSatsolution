import type { Metadata } from "next";
import LegacyServicePage, {
  generateMetadata as generateLegacyMetadata,
  generateStaticParams as generateLegacyStaticParams,
} from "@/app/solutions/[slug]/page";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return generateLegacyStaticParams();
}

export function generateMetadata(props: ServicePageProps): Promise<Metadata> {
  return generateLegacyMetadata(props);
}

export default async function ServicePage(props: ServicePageProps) {
  return LegacyServicePage(props);
}
