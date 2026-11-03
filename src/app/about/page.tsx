import { permanentRedirect } from "next/navigation";

/** "Về tôi" is now the home page. */
export default function AboutPage() {
  permanentRedirect("/");
}
