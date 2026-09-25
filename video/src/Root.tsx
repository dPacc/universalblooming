import { Composition } from "remotion";
import { BloomiIntro } from "./BloomiIntro";

export const RemotionRoot = () => (
  <>
    <Composition id="BloomiIntro" component={BloomiIntro} durationInFrames={360} fps={30} width={1920} height={1080} />
  </>
);
