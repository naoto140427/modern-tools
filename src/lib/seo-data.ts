import { SeoInfo } from "@/types/seo";
import { imageSeo } from "@/config/tools/image";
import { videoSeo } from "@/config/tools/video";
import { pdfSeo } from "@/config/tools/pdf";
import { audioSeo } from "@/config/tools/audio";
import { aiSeo } from "@/config/tools/ai";
import { qrSeo } from "@/config/tools/qr";
import { textSeo } from "@/config/tools/text";
import { devSeo } from "@/config/tools/dev";
import { archiveSeo } from "@/config/tools/archive";
import { recorderSeo } from "@/config/tools/recorder";

export type { SeoInfo };

export const seoData: Record<string, Record<string, SeoInfo>> = {
  image: imageSeo,
  video: videoSeo,
  pdf: pdfSeo,
  audio: audioSeo,
  ai: aiSeo,
  qr: qrSeo,
  text: textSeo,
  dev: devSeo,
  archive: archiveSeo,
  recorder: recorderSeo,
};
