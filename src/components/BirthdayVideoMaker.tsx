"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Expand,
  Film,
  ImagePlus,
  LoaderCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./BirthdayVideoMaker.module.css";

type VideoFormat = "landscape" | "portrait";

type CelebrationTheme =
  | "birthday"
  | "anniversary"
  | "bride-to-be"
  | "groom-to-be"
  | "baby-shower"
  | "graduation";

type CharacterMotion =
  | "party-bounce"
  | "romantic-sway"
  | "petal-hop"
  | "high-five"
  | "gentle-float"
  | "victory-jump";

type ThemeDefinition = {
  id: CelebrationTheme;
  label: string;
  icon: string;
  title: readonly [string, string];
  titleScale: number;
  assetSrc: string;
  fileStem: string;
  motion: CharacterMotion;
  characterWidth: { landscape: number; portrait: number };
  colors: {
    background: readonly [string, string, string];
    glow: string;
    beamLeft: string;
    beamRight: string;
    accent: string;
    shadow: string;
  };
};

type LoadedAssets = {
  photo: HTMLImageElement;
  characters: Record<CelebrationTheme, HTMLImageElement>;
  curtainPullers: readonly HTMLImageElement[];
  logo: HTMLImageElement;
};

type ConfettiParticle = {
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  spin: number;
  drift: number;
  color: string;
  shape: "rect" | "circle";
};

type AudioRecording = {
  context: AudioContext;
  track: MediaStreamTrack;
};

const DEFAULT_VIDEO_DURATION_MS = 15_000;
const BIRTHDAY_SONG_DURATION_SECONDS = 58.112;
const VIDEO_FPS = 30;
const MAX_PHOTO_SIZE = 15 * 1024 * 1024;
const COUNTDOWN_END_SECONDS = 3;
const CURTAIN_REVEAL_SECONDS = 3.8;
const CURTAIN_OPEN_END_SECONDS = COUNTDOWN_END_SECONDS + CURTAIN_REVEAL_SECONDS;
const ASSISTANT_EXIT_SECONDS = 0.75;
const CELEBRATION_BURST_SECONDS =
  CURTAIN_OPEN_END_SECONDS + ASSISTANT_EXIT_SECONDS;
const POSTER_REVEAL_SECONDS = CELEBRATION_BURST_SECONDS + 0.12;
const CURTAIN_FADE_SECONDS = 0.24;
const POSTER_CONTENT_START_SECONDS = POSTER_REVEAL_SECONDS + 0.14;
const POSTER_CONTENT_REVEAL_SECONDS = 0.72;
const CHEER_SETTLE_SECONDS = 2.1;
const BIRTHDAY_SONG_START_SECONDS = CURTAIN_OPEN_END_SECONDS;
const CURTAIN_SEQUENCE_FRAME_COUNT = 7;
const CURTAIN_PULL_POSE_FOR_FRAME = [0, 1, 2, 2, 0, 1, 2] as const;
const CURTAIN_PULL_POSE_METADATA = [
  { curtainEdgeX: 0.51, handY: 0.283, footY: 0.925 },
  { curtainEdgeX: 0.463, handY: 0.273, footY: 0.915 },
  { curtainEdgeX: 0.48, handY: 0.28, footY: 0.925 },
] as const;

function getVideoDurationMs(themeId: CelebrationTheme) {
  if (themeId === "birthday") {
    return Math.ceil(
      (BIRTHDAY_SONG_START_SECONDS + BIRTHDAY_SONG_DURATION_SECONDS + 0.25) *
        1000,
    );
  }

  return DEFAULT_VIDEO_DURATION_MS;
}

const FORMAT_SIZE: Record<VideoFormat, { width: number; height: number }> = {
  landscape: { width: 1280, height: 720 },
  portrait: { width: 720, height: 1280 },
};

const CELEBRATION_THEMES: readonly ThemeDefinition[] = [
  {
    id: "birthday",
    label: "Birthday",
    icon: "🎂",
    title: ["HAPPY", "BIRTHDAY!"],
    titleScale: 1,
    assetSrc: "/images/birthday/birthday-cartoons.png",
    fileStem: "happy-birthday",
    motion: "party-bounce",
    characterWidth: { landscape: 0.3, portrait: 0.48 },
    colors: {
      background: ["#030716", "#11104a", "#280627"],
      glow: "rgba(124, 92, 252, 0.34)",
      beamLeft: "rgba(69, 166, 255, 1)",
      beamRight: "rgba(255, 53, 229, 1)",
      accent: "#ffd23f",
      shadow: "rgba(252, 25, 237, 0.56)",
    },
  },
  {
    id: "anniversary",
    label: "Wedding Anniversary",
    icon: "💞",
    title: ["HAPPY", "ANNIVERSARY!"],
    titleScale: 0.72,
    assetSrc: "/images/celebrations/anniversary.png",
    fileStem: "happy-anniversary",
    motion: "romantic-sway",
    characterWidth: { landscape: 0.25, portrait: 0.32 },
    colors: {
      background: ["#10050f", "#48112e", "#250522"],
      glow: "rgba(255, 107, 176, 0.32)",
      beamLeft: "rgba(255, 176, 94, 1)",
      beamRight: "rgba(255, 91, 162, 1)",
      accent: "#ffcf72",
      shadow: "rgba(255, 87, 155, 0.54)",
    },
  },
  {
    id: "bride-to-be",
    label: "Bride-to-Be",
    icon: "👰",
    title: ["BRIDE", "TO BE!"],
    titleScale: 0.94,
    assetSrc: "/images/celebrations/bride-to-be.png",
    fileStem: "bride-to-be",
    motion: "petal-hop",
    characterWidth: { landscape: 0.25, portrait: 0.32 },
    colors: {
      background: ["#12051a", "#41155c", "#3a082c"],
      glow: "rgba(255, 107, 243, 0.32)",
      beamLeft: "rgba(184, 133, 255, 1)",
      beamRight: "rgba(255, 87, 194, 1)",
      accent: "#ffc1ed",
      shadow: "rgba(255, 86, 203, 0.56)",
    },
  },
  {
    id: "groom-to-be",
    label: "Groom-to-Be",
    icon: "🤵",
    title: ["GROOM", "TO BE!"],
    titleScale: 0.94,
    assetSrc: "/images/celebrations/groom-to-be.png",
    fileStem: "groom-to-be",
    motion: "high-five",
    characterWidth: { landscape: 0.32, portrait: 0.48 },
    colors: {
      background: ["#020916", "#082f58", "#160d38"],
      glow: "rgba(20, 126, 255, 0.34)",
      beamLeft: "rgba(37, 189, 255, 1)",
      beamRight: "rgba(138, 92, 255, 1)",
      accent: "#ffd36a",
      shadow: "rgba(37, 137, 255, 0.58)",
    },
  },
  {
    id: "baby-shower",
    label: "Baby Shower",
    icon: "🧸",
    title: ["BABY", "SHOWER!"],
    titleScale: 0.88,
    assetSrc: "/images/celebrations/baby-shower.png",
    fileStem: "baby-shower",
    motion: "gentle-float",
    characterWidth: { landscape: 0.25, portrait: 0.32 },
    colors: {
      background: ["#071323", "#1b3156", "#321840"],
      glow: "rgba(192, 156, 255, 0.3)",
      beamLeft: "rgba(126, 202, 255, 1)",
      beamRight: "rgba(226, 159, 255, 1)",
      accent: "#ffe29a",
      shadow: "rgba(183, 142, 255, 0.52)",
    },
  },
  {
    id: "graduation",
    label: "Graduation",
    icon: "🎓",
    title: ["HAPPY", "GRADUATION!"],
    titleScale: 0.74,
    assetSrc: "/images/celebrations/graduation.png",
    fileStem: "happy-graduation",
    motion: "victory-jump",
    characterWidth: { landscape: 0.32, portrait: 0.48 },
    colors: {
      background: ["#02081b", "#13275f", "#24114c"],
      glow: "rgba(61, 111, 255, 0.34)",
      beamLeft: "rgba(44, 143, 255, 1)",
      beamRight: "rgba(145, 82, 255, 1)",
      accent: "#ffd23f",
      shadow: "rgba(62, 108, 255, 0.58)",
    },
  },
] as const;

const THEMES_BY_ID = Object.fromEntries(
  CELEBRATION_THEMES.map((theme) => [theme.id, theme]),
) as Record<CelebrationTheme, ThemeDefinition>;

const CONFETTI_COLORS = [
  "#ffd23f",
  "#ff35e5",
  "#45a6ff",
  "#9b6bff",
  "#ffffff",
  "#22d3a5",
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

async function loadCelebrationAssets(): Promise<LoadedAssets> {
  const [photo, logo, curtainPullers, themeImages] = await Promise.all([
    loadImage("/images/birthday/birthday-sample.png"),
    loadImage("/images/logo-transparent.png"),
    Promise.all(
      Array.from({ length: 3 }, (_, index) =>
        loadImage(
          `/images/celebrations/curtain-grip-pose-${index + 1}.png`,
        ),
      ),
    ),
    Promise.all(CELEBRATION_THEMES.map((theme) => loadImage(theme.assetSrc))),
  ]);

  const characters = Object.fromEntries(
    CELEBRATION_THEMES.map((theme, index) => [theme.id, themeImages[index]]),
  ) as Record<CelebrationTheme, HTMLImageElement>;

  return {
    photo,
    logo,
    curtainPullers,
    characters,
  };
}

function seededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function createConfetti(count: number) {
  const random = seededRandom(24062026);

  return Array.from({ length: count }, (_, index): ConfettiParticle => ({
    x: random(),
    y: random(),
    speed: 0.07 + random() * 0.13,
    size: 0.004 + random() * 0.009,
    rotation: random() * Math.PI * 2,
    spin: (random() - 0.5) * 5,
    drift: (random() - 0.5) * 0.045,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    shape: index % 5 === 0 ? "circle" : "rect",
  }));
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - clamp(value), 3);
}

function easeOutBack(value: number) {
  const amount = clamp(value);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(amount - 1, 3) + c1 * Math.pow(amount - 1, 2);
}

function roundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.roundRect(x, y, width, height, safeRadius);
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  zoom: number,
) {
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceWidth = image.naturalWidth / zoom;
  let sourceHeight = image.naturalHeight / zoom;

  if (sourceRatio > targetRatio) {
    sourceWidth = sourceHeight * targetRatio;
  } else {
    sourceHeight = sourceWidth / targetRatio;
  }

  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) * 0.35;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function drawSpotlight(
  context: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  targetX: number,
  targetY: number,
  width: number,
  color: string,
  alpha: number,
) {
  const gradient = context.createLinearGradient(originX, originY, targetX, targetY);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.72, color.replace("1)", "0.18)"));
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(originX - width * 0.06, originY);
  context.lineTo(originX + width * 0.06, originY);
  context.lineTo(targetX + width / 2, targetY);
  context.lineTo(targetX - width / 2, targetY);
  context.closePath();
  context.fill();
  context.restore();
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number,
  theme: ThemeDefinition,
) {
  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, theme.colors.background[0]);
  background.addColorStop(0.48, theme.colors.background[1]);
  background.addColorStop(1, theme.colors.background[2]);
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(
    width * 0.58,
    height * 0.42,
    0,
    width * 0.58,
    height * 0.42,
    width * 0.58,
  );
  glow.addColorStop(0, theme.colors.glow);
  glow.addColorStop(0.45, theme.colors.shadow);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  const swing = Math.sin(seconds * 0.75) * width * 0.12;
  drawSpotlight(
    context,
    width * 0.16,
    -height * 0.03,
    width * 0.42 + swing,
    height * 0.94,
    width * 0.34,
    theme.colors.beamLeft,
    0.16,
  );
  drawSpotlight(
    context,
    width * 0.84,
    -height * 0.03,
    width * 0.61 - swing,
    height * 0.94,
    width * 0.38,
    theme.colors.beamRight,
    0.15,
  );

  context.save();
  context.globalAlpha = 0.24;
  for (let index = 0; index < 14; index += 1) {
    const x = ((index * 0.173 + seconds * 0.003) % 1) * width;
    const y = (0.08 + ((index * 0.241) % 0.75)) * height;
    const radius = (0.005 + (index % 4) * 0.004) * width;
    const bokeh = context.createRadialGradient(x, y, 0, x, y, radius);
    bokeh.addColorStop(0, index % 2 === 0 ? theme.colors.accent : "#ffffff");
    bokeh.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = bokeh;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();

  const floor = context.createLinearGradient(0, height * 0.72, 0, height);
  floor.addColorStop(0, "rgba(0,0,0,0)");
  floor.addColorStop(1, "rgba(0,0,0,0.78)");
  context.fillStyle = floor;
  context.fillRect(0, height * 0.7, width, height * 0.3);
}

function easeInOutCubic(value: number) {
  const amount = clamp(value);
  return amount < 0.5
    ? 4 * amount * amount * amount
    : 1 - Math.pow(-2 * amount + 2, 3) / 2;
}

function getPosterRevealProgress(seconds: number) {
  return easeOutCubic(
    (seconds - POSTER_CONTENT_START_SECONDS) /
      POSTER_CONTENT_REVEAL_SECONDS,
  );
}

function drawSparkle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  context.save();
  context.translate(x, y);
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = radius * 1.8;
  context.beginPath();
  context.moveTo(0, -radius);
  context.lineTo(radius * 0.24, -radius * 0.24);
  context.lineTo(radius, 0);
  context.lineTo(radius * 0.24, radius * 0.24);
  context.lineTo(0, radius);
  context.lineTo(-radius * 0.24, radius * 0.24);
  context.lineTo(-radius, 0);
  context.lineTo(-radius * 0.24, -radius * 0.24);
  context.closePath();
  context.fill();
  context.restore();
}

function drawCountdown(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number,
) {
  if (seconds >= COUNTDOWN_END_SECONDS) return;

  const countdownIndex = Math.min(2, Math.floor(seconds));
  const number = 3 - countdownIndex;
  const localSeconds = seconds - countdownIndex;
  const entrance = easeOutCubic(localSeconds / 0.18);
  const exit = easeInOutCubic((localSeconds - 0.74) / 0.26);
  const alpha = entrance * (1 - exit);
  const pulse = easeOutCubic(localSeconds / 0.52);
  const numberSize = Math.min(width, height) * 0.44;
  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const ringRadius = numberSize * 0.76;
  const numberScale = 1.2 - entrance * 0.2 - exit * 0.08;
  const numberY = centerY - (1 - entrance) * numberSize * 0.07;

  context.save();
  context.fillStyle = "rgba(1, 2, 14, 0.78)";
  context.fillRect(0, 0, width, height);

  const stageGlow = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    numberSize * 1.7,
  );
  stageGlow.addColorStop(0, "rgba(214, 156, 49, 0.2)");
  stageGlow.addColorStop(0.42, "rgba(104, 66, 16, 0.08)");
  stageGlow.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = stageGlow;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = alpha * 0.22;
  context.strokeStyle = "#ffffff";
  context.lineWidth = Math.max(2, numberSize * 0.012);
  context.beginPath();
  context.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
  context.stroke();
  context.restore();

  const progressStroke = context.createLinearGradient(
    centerX - ringRadius,
    centerY - ringRadius,
    centerX + ringRadius,
    centerY + ringRadius,
  );
  progressStroke.addColorStop(0, "#ffffff");
  progressStroke.addColorStop(0.42, "#f4cf72");
  progressStroke.addColorStop(1, "#d69c31");

  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = progressStroke;
  context.lineWidth = Math.max(4, numberSize * 0.026);
  context.lineCap = "round";
  context.shadowColor = "rgba(214, 156, 49, 0.72)";
  context.shadowBlur = numberSize * 0.07;
  context.beginPath();
  context.arc(
    centerX,
    centerY,
    ringRadius,
    -Math.PI / 2,
    -Math.PI / 2 + Math.PI * 2 * (1 - localSeconds),
  );
  context.stroke();
  context.restore();

  context.save();
  context.globalAlpha = (1 - pulse) * 0.42;
  context.strokeStyle = "#d69c31";
  context.lineWidth = Math.max(2, numberSize * 0.012);
  context.beginPath();
  context.arc(
    centerX,
    centerY,
    ringRadius * (0.9 + pulse * 0.34),
    0,
    Math.PI * 2,
  );
  context.stroke();
  context.restore();

  context.save();
  context.globalAlpha = alpha * 0.78;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `700 ${Math.max(18, numberSize * 0.075)}px Arial, Helvetica, sans-serif`;
  context.fillStyle = "#ffffff";
  context.shadowColor = "rgba(214, 156, 49, 0.62)";
  context.shadowBlur = numberSize * 0.045;
  context.fillText(
    "GET READY",
    centerX,
    centerY - ringRadius - numberSize * 0.16,
  );
  context.restore();

  context.save();
  context.globalAlpha = alpha;
  context.translate(centerX, numberY);
  context.scale(numberScale, numberScale);
  context.translate(-centerX, -numberY);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${numberSize}px Arial Black, Arial, Helvetica, sans-serif`;
  context.lineJoin = "round";
  context.lineWidth = numberSize * 0.032;
  context.strokeStyle = "rgba(5, 6, 28, 0.94)";
  context.shadowColor = "rgba(214, 156, 49, 0.72)";
  context.shadowBlur = numberSize * 0.12;
  context.strokeText(String(number), centerX, numberY);

  const numberGradient = context.createLinearGradient(
    0,
    numberY - numberSize * 0.52,
    0,
    numberY + numberSize * 0.48,
  );
  numberGradient.addColorStop(0, "#ffffff");
  numberGradient.addColorStop(0.46, "#ffffff");
  numberGradient.addColorStop(1, "#f2c45f");
  context.fillStyle = numberGradient;
  context.fillText(String(number), centerX, numberY);
  context.restore();

  context.save();
  context.globalAlpha = alpha * 0.82;
  const dotGap = numberSize * 0.1;
  const dotY = centerY + ringRadius + numberSize * 0.16;
  for (let dotIndex = 0; dotIndex < 3; dotIndex += 1) {
    context.beginPath();
    context.arc(
      centerX + (dotIndex - 1) * dotGap,
      dotY,
      numberSize * (dotIndex === countdownIndex ? 0.014 : 0.009),
      0,
      Math.PI * 2,
    );
    context.fillStyle =
      dotIndex === countdownIndex ? "#d69c31" : "rgba(255,255,255,0.36)";
    context.fill();
  }
  context.restore();

  context.restore();
}

function getCurtainPhysicsProgress(value: number) {
  const time = clamp(value);
  const base = easeInOutCubic(time);
  const settling =
    time > 0.7
      ? Math.sin((time - 0.7) * Math.PI * 7) *
        Math.exp(-(time - 0.7) * 8) *
        0.035
      : 0;

  return clamp(base + settling);
}

function getCubicValue(
  start: number,
  controlOne: number,
  controlTwo: number,
  end: number,
  time: number,
) {
  const inverse = 1 - time;

  return (
    inverse ** 3 * start +
    3 * inverse ** 2 * time * controlOne +
    3 * inverse * time ** 2 * controlTwo +
    time ** 3 * end
  );
}

function getCubicTimeForValue(
  start: number,
  controlOne: number,
  controlTwo: number,
  end: number,
  target: number,
) {
  let minimum = 0;
  let maximum = 1;

  for (let iteration = 0; iteration < 14; iteration += 1) {
    const midpoint = (minimum + maximum) * 0.5;
    const value = getCubicValue(
      start,
      controlOne,
      controlTwo,
      end,
      midpoint,
    );

    if (value < target) {
      minimum = midpoint;
    } else {
      maximum = midpoint;
    }
  }

  return (minimum + maximum) * 0.5;
}

function getCurtainInnerEdgeAtY(
  width: number,
  height: number,
  openProgress: number,
  side: "left" | "right",
  seconds: number,
  targetY: number,
) {
  const direction = side === "left" ? -1 : 1;
  const centerX = width * 0.5;
  const maximumPull = width * 0.39;
  const fabricSway =
    Math.sin(seconds * 2.15 + (side === "left" ? 0 : 1.2)) *
    width *
    0.004 *
    openProgress;
  const topInner =
    centerX + direction * maximumPull * openProgress * 0.92 + fabricSway;
  const shoulderInner =
    centerX + direction * maximumPull * openProgress * 1.04 - fabricSway;
  const gatheredInner =
    centerX + direction * maximumPull * openProgress * 1.12 +
    fabricSway * 0.4;
  const bottomInner =
    centerX + direction * maximumPull * openProgress * 0.88 -
    fabricSway * 0.7;
  const normalizedY = clamp(targetY / height);

  if (normalizedY <= 0.42) {
    const time = getCubicTimeForValue(0, 0.14, 0.34, 0.42, normalizedY);
    return getCubicValue(
      topInner,
      topInner + direction * width * 0.012,
      shoulderInner - direction * width * 0.018,
      shoulderInner,
      time,
    );
  }

  if (normalizedY <= 0.66) {
    const time = getCubicTimeForValue(
      0.42,
      0.49,
      0.6,
      0.66,
      normalizedY,
    );
    return getCubicValue(
      shoulderInner,
      gatheredInner + fabricSway,
      gatheredInner - fabricSway,
      gatheredInner,
      time,
    );
  }

  const time = getCubicTimeForValue(0.66, 0.77, 0.91, 1, normalizedY);
  return getCubicValue(
    gatheredInner,
    gatheredInner - direction * width * 0.025,
    bottomInner + direction * width * 0.035,
    bottomInner,
    time,
  );
}

function drawCurtainHalf(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  openProgress: number,
  side: "left" | "right",
  seconds: number,
) {
  const direction = side === "left" ? -1 : 1;
  const outerEdge = side === "left" ? 0 : width;
  const centerX = width * 0.5;
  const maximumPull = width * 0.39;
  const fabricSway =
    Math.sin(seconds * 2.15 + (side === "left" ? 0 : 1.2)) *
    width *
    0.004 *
    openProgress;
  const topInner =
    centerX + direction * maximumPull * openProgress * 0.92 + fabricSway;
  const shoulderInner =
    centerX + direction * maximumPull * openProgress * 1.04 - fabricSway;
  const gatheredInner =
    centerX + direction * maximumPull * openProgress * 1.12 +
    fabricSway * 0.4;
  const bottomInner =
    centerX + direction * maximumPull * openProgress * 0.88 -
    fabricSway * 0.7;
  const visibleWidth = Math.max(
    width * 0.1,
    Math.abs(gatheredInner - outerEdge),
  );
  const curtain = context.createLinearGradient(
    outerEdge,
    0,
    gatheredInner,
    0,
  );
  curtain.addColorStop(0, "#170000");
  curtain.addColorStop(0.18, "#340105");
  curtain.addColorStop(0.42, "#50060b");
  curtain.addColorStop(0.63, "#290003");
  curtain.addColorStop(0.82, "#8f151f");
  curtain.addColorStop(1, "#340105");

  context.save();
  context.shadowColor = "rgba(0,0,0,0.65)";
  context.shadowBlur = width * 0.045;
  context.beginPath();
  context.moveTo(outerEdge, 0);
  context.lineTo(topInner, 0);
  context.bezierCurveTo(
    topInner + direction * width * 0.012,
    height * 0.14,
    shoulderInner - direction * width * 0.018,
    height * 0.34,
    shoulderInner,
    height * 0.42,
  );
  context.bezierCurveTo(
    gatheredInner + fabricSway,
    height * 0.49,
    gatheredInner - fabricSway,
    height * 0.6,
    gatheredInner,
    height * 0.66,
  );
  context.bezierCurveTo(
    gatheredInner - direction * width * 0.025,
    height * 0.77,
    bottomInner + direction * width * 0.035,
    height * 0.91,
    bottomInner,
    height,
  );
  context.lineTo(outerEdge, height);
  context.closePath();
  context.fillStyle = curtain;
  context.fill();
  context.clip();

  for (let foldIndex = 0; foldIndex < 12; foldIndex += 1) {
    const foldPosition = (foldIndex + 0.5) / 12;
    const foldX =
      side === "left"
        ? outerEdge + visibleWidth * foldPosition
        : outerEdge - visibleWidth * foldPosition;
    const foldWidth = visibleWidth * (0.055 + (foldIndex % 3) * 0.012);
    const fold = context.createLinearGradient(
      foldX - foldWidth,
      0,
      foldX + foldWidth,
      0,
    );
    fold.addColorStop(0, "rgba(255,255,255,0)");
    fold.addColorStop(0.34, "rgba(143,21,31,0.08)");
    fold.addColorStop(0.5, "rgba(177,31,42,0.34)");
    fold.addColorStop(0.68, "rgba(12,0,2,0.62)");
    fold.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = fold;
    context.fillRect(foldX - foldWidth, 0, foldWidth * 2, height);
  }

  const verticalShade = context.createLinearGradient(0, 0, 0, height);
  verticalShade.addColorStop(0, "rgba(255,214,206,0.1)");
  verticalShade.addColorStop(0.24, "rgba(255,255,255,0)");
  verticalShade.addColorStop(0.66, "rgba(20,0,3,0.18)");
  verticalShade.addColorStop(1, "rgba(0,0,0,0.56)");
  context.fillStyle = verticalShade;
  context.fillRect(0, 0, width, height);
  context.restore();

  context.save();
  context.shadowColor = "rgba(214,156,49,0.48)";
  context.shadowBlur = width * 0.012;
  context.strokeStyle = "#d69c31";
  context.lineWidth = Math.max(3, width * 0.005);
  context.beginPath();
  context.moveTo(topInner, 0);
  context.bezierCurveTo(
    shoulderInner,
    height * 0.28,
    gatheredInner,
    height * 0.52,
    gatheredInner,
    height * 0.66,
  );
  context.bezierCurveTo(
    gatheredInner,
    height * 0.78,
    bottomInner,
    height * 0.91,
    bottomInner,
    height,
  );
  context.stroke();

  if (openProgress > 0.35) {
    context.globalAlpha *= clamp((openProgress - 0.35) / 0.35);
    context.fillStyle = "#d69c31";
    context.shadowColor = "rgba(0,0,0,0.5)";
    context.shadowBlur = width * 0.008;
    context.beginPath();
    context.ellipse(
      gatheredInner,
      height * 0.6,
      width * 0.018,
      height * 0.035,
      direction * 0.28,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.restore();
}

function drawCurtainValance(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const valanceHeight = height * 0.105;
  const scallopDepth = height * 0.055;
  const valance = context.createLinearGradient(0, 0, 0, valanceHeight);
  valance.addColorStop(0, "#170000");
  valance.addColorStop(0.35, "#50060b");
  valance.addColorStop(0.7, "#340105");
  valance.addColorStop(1, "#1f0002");

  context.save();
  context.fillStyle = valance;
  context.shadowColor = "rgba(0,0,0,0.7)";
  context.shadowBlur = width * 0.025;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(width, 0);
  context.lineTo(width, valanceHeight);
  for (let scallop = 8; scallop > 0; scallop -= 1) {
    const right = (scallop / 8) * width;
    const left = ((scallop - 1) / 8) * width;
    context.bezierCurveTo(
      right - width * 0.025,
      valanceHeight + scallopDepth,
      left + width * 0.025,
      valanceHeight + scallopDepth,
      left,
      valanceHeight,
    );
  }
  context.closePath();
  context.fill();
  context.save();
  context.clip();

  for (let fold = 0; fold < 8; fold += 1) {
    const foldX = ((fold + 0.5) / 8) * width;
    const foldGlow = context.createLinearGradient(
      foldX - width * 0.045,
      0,
      foldX + width * 0.045,
      0,
    );
    foldGlow.addColorStop(0, "rgba(255,255,255,0)");
    foldGlow.addColorStop(0.5, "rgba(177,31,42,0.28)");
    foldGlow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = foldGlow;
    context.fillRect(
      foldX - width * 0.045,
      0,
      width * 0.09,
      valanceHeight + scallopDepth,
    );
  }
  context.restore();

  context.strokeStyle = "#d69c31";
  context.lineWidth = Math.max(3, width * 0.006);
  context.beginPath();
  context.moveTo(0, valanceHeight + height * 0.006);
  for (let scallop = 0; scallop < 8; scallop += 1) {
    const left = (scallop / 8) * width;
    const right = ((scallop + 1) / 8) * width;
    context.bezierCurveTo(
      left + width * 0.025,
      valanceHeight + scallopDepth,
      right - width * 0.025,
      valanceHeight + scallopDepth,
      right,
      valanceHeight + height * 0.006,
    );
  }
  context.stroke();
  context.restore();
}

function getCurtainPullFrameIndex(value: number) {
  return Math.min(
    CURTAIN_SEQUENCE_FRAME_COUNT - 1,
    Math.floor(clamp(value) * (CURTAIN_SEQUENCE_FRAME_COUNT - 1)),
  );
}

function drawCurtainLogoBurst(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  localSeconds: number,
  curtainAlpha: number,
) {
  const blastSeconds = localSeconds - CURTAIN_REVEAL_SECONDS * 0.34;
  if (blastSeconds <= 0) return;

  const expansion = easeOutCubic(blastSeconds / 0.82);
  const burstAlpha =
    clamp(blastSeconds / 0.08) *
    (1 - clamp((blastSeconds - 0.34) / 0.82));
  const burstRadius = width * (0.045 + expansion * 0.27);

  context.save();
  context.globalAlpha = curtainAlpha * burstAlpha;
  context.globalCompositeOperation = "screen";

  const flash = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    burstRadius,
  );
  flash.addColorStop(0, "rgba(255,255,255,0.98)");
  flash.addColorStop(0.16, "rgba(255,225,145,0.9)");
  flash.addColorStop(0.48, "rgba(214,156,49,0.34)");
  flash.addColorStop(1, "rgba(214,156,49,0)");
  context.fillStyle = flash;
  context.fillRect(0, 0, width, height);

  context.translate(centerX, centerY);
  context.shadowColor = "rgba(214,156,49,0.86)";
  context.shadowBlur = width * 0.018;

  for (let rayIndex = 0; rayIndex < 24; rayIndex += 1) {
    const angle = (rayIndex / 24) * Math.PI * 2 + rayIndex * 0.11;
    const inner = width * (0.04 + expansion * 0.07);
    const outer =
      width * (0.12 + expansion * (0.13 + (rayIndex % 4) * 0.018));
    context.strokeStyle = rayIndex % 3 === 0 ? "#ffffff" : "#e1ad45";
    context.lineWidth = Math.max(
      1.5,
      width * (rayIndex % 4 === 0 ? 0.004 : 0.002),
    );
    context.beginPath();
    context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    context.stroke();
  }

  context.strokeStyle = "#f4cf72";
  context.lineWidth = Math.max(2, width * 0.004 * (1 - expansion * 0.48));
  context.beginPath();
  context.arc(0, 0, width * (0.035 + expansion * 0.22), 0, Math.PI * 2);
  context.stroke();

  context.globalAlpha = curtainAlpha * burstAlpha * 0.7;
  context.strokeStyle = "#ffffff";
  context.lineWidth = Math.max(1.5, width * 0.0025);
  context.beginPath();
  context.arc(0, 0, width * (0.025 + expansion * 0.17), 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawCurtainReveal(
  context: CanvasRenderingContext2D,
  assets: LoadedAssets,
  width: number,
  height: number,
  format: VideoFormat,
  seconds: number,
) {
  if (
    seconds < COUNTDOWN_END_SECONDS ||
    seconds > POSTER_REVEAL_SECONDS + CURTAIN_FADE_SECONDS
  ) {
    return;
  }

  const portrait = format === "portrait";
  const localSeconds = seconds - COUNTDOWN_END_SECONDS;
  const curtainTimeline = clamp(localSeconds / CURTAIN_REVEAL_SECONDS);
  const openProgress = getCurtainPhysicsProgress(curtainTimeline);
  const curtainAlpha =
    1 -
    easeInOutCubic(
      (seconds - POSTER_REVEAL_SECONDS) / CURTAIN_FADE_SECONDS,
    );
  const centerX = width * 0.5;

  context.save();
  context.globalAlpha = curtainAlpha;

  const stageGlow = context.createRadialGradient(
    centerX,
    height * 0.46,
    0,
    centerX,
    height * 0.46,
    Math.max(width, height) * 0.54,
  );
  stageGlow.addColorStop(0, "rgba(72, 53, 20, 0.92)");
  stageGlow.addColorStop(0.24, "rgba(28, 24, 17, 0.98)");
  stageGlow.addColorStop(0.58, "rgba(7, 8, 9, 0.99)");
  stageGlow.addColorStop(1, "rgba(0,0,0,1)");
  context.fillStyle = stageGlow;
  context.fillRect(0, 0, width, height);

  const revealLogoWidth = width * (portrait ? 0.68 : 0.44);
  const revealLogoHeight =
    revealLogoWidth * (assets.logo.naturalHeight / assets.logo.naturalWidth);
  const revealLogoX = centerX - revealLogoWidth / 2;
  const revealLogoCenterY = height * 0.45;
  const revealLogoY = revealLogoCenterY - revealLogoHeight / 2;
  const logoBlastSeconds = localSeconds - CURTAIN_REVEAL_SECONDS * 0.34;
  const logoEntrance = easeOutBack(logoBlastSeconds / 0.72);
  const logoAlpha = easeOutCubic(logoBlastSeconds / 0.24);
  const logoScale = 0.42 + logoEntrance * 0.58;

  drawCurtainLogoBurst(
    context,
    width,
    height,
    centerX,
    revealLogoCenterY,
    localSeconds,
    curtainAlpha,
  );

  context.save();
  context.globalAlpha = curtainAlpha * logoAlpha;
  context.translate(centerX, revealLogoCenterY);
  context.scale(
    Math.max(0.001, logoScale),
    Math.max(0.001, logoScale),
  );
  context.translate(-centerX, -revealLogoCenterY);
  context.shadowColor = "rgba(214,156,49,0.82)";
  context.shadowBlur = width * 0.055;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    assets.logo,
    revealLogoX,
    revealLogoY,
    revealLogoWidth,
    revealLogoHeight,
  );
  context.restore();

  drawCurtainHalf(context, width, height, openProgress, "left", seconds);
  drawCurtainHalf(context, width, height, openProgress, "right", seconds);
  drawCurtainValance(context, width, height);

  const animationFrameIndex = getCurtainPullFrameIndex(curtainTimeline);
  const poseIndex = CURTAIN_PULL_POSE_FOR_FRAME[animationFrameIndex];
  const curtainPuller = assets.curtainPullers[poseIndex];
  const poseMetadata = CURTAIN_PULL_POSE_METADATA[poseIndex];
  const assistantWidth = width * (portrait ? 0.3 : 0.17);
  const assistantHeight =
    assistantWidth *
    (curtainPuller.naturalHeight / curtainPuller.naturalWidth);
  const assistantY = height - assistantHeight * poseMetadata.footY;
  const assistantHandY = assistantY + assistantHeight * poseMetadata.handY;
  const curtainEdgeX = getCurtainInnerEdgeAtY(
    width,
    height,
    openProgress,
    "right",
    seconds,
    assistantHandY,
  );
  const assistantBaseX =
    curtainEdgeX - assistantWidth * poseMetadata.curtainEdgeX;
  const assistantExit = easeInOutCubic(
    (seconds - CURTAIN_OPEN_END_SECONDS) / ASSISTANT_EXIT_SECONDS,
  );
  const assistantX =
    assistantBaseX + assistantExit * (assistantWidth + width * 0.12);
  const assistantAlpha =
    clamp((localSeconds - 0.05) / 0.4) *
    (1 - clamp(assistantExit * 1.15));
  const exitBob = Math.sin(assistantExit * Math.PI * 3) * height * 0.012;

  context.save();
  context.globalAlpha = curtainAlpha * assistantAlpha;
  context.translate(
    assistantX + assistantWidth * 0.5,
    assistantY + assistantHeight * 0.5 + exitBob,
  );
  context.rotate(assistantExit * 0.08);
  context.translate(
    -(assistantX + assistantWidth * 0.5),
    -(assistantY + assistantHeight * 0.5 + exitBob),
  );
  context.shadowColor = "rgba(0,0,0,0.55)";
  context.shadowBlur = width * 0.02;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    curtainPuller,
    assistantX,
    assistantY + exitBob,
    assistantWidth,
    assistantHeight,
  );
  context.restore();
  context.restore();
}

function drawPhoto(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  format: VideoFormat,
  seconds: number,
  theme: ThemeDefinition,
) {
  const reveal = getPosterRevealProgress(seconds);
  const entrance = 0.93 + easeOutBack(reveal) * 0.07;
  const portrait = format === "portrait";
  const photoWidth = portrait ? width * 0.68 : width * 0.35;
  const photoHeight = portrait ? height * 0.48 : height * 0.75;
  const baseX = portrait ? width * 0.16 : width * 0.49;
  const baseY = portrait ? height * 0.17 : height * 0.12;
  const scale = Math.max(0.001, entrance);
  const bob = Math.sin(seconds * 1.6) * height * 0.004;
  const photoX = baseX + (photoWidth * (1 - scale)) / 2;
  const photoY = baseY + (photoHeight * (1 - scale)) / 2 + bob;
  const renderedWidth = photoWidth * scale;
  const renderedHeight = photoHeight * scale;
  const radius = width * 0.025;

  context.save();
  context.globalAlpha = reveal;
  context.shadowColor = theme.colors.shadow;
  context.shadowBlur = width * 0.035;
  roundedRectPath(
    context,
    photoX - width * 0.008,
    photoY - width * 0.008,
    renderedWidth + width * 0.016,
    renderedHeight + width * 0.016,
    radius,
  );
  const frame = context.createLinearGradient(photoX, photoY, photoX + renderedWidth, photoY + renderedHeight);
  frame.addColorStop(0, theme.colors.accent);
  frame.addColorStop(0.45, "#ffffff");
  frame.addColorStop(1, "#9b6bff");
  context.fillStyle = frame;
  context.fill();
  context.restore();

  context.save();
  context.globalAlpha = reveal;
  roundedRectPath(context, photoX, photoY, renderedWidth, renderedHeight, radius * 0.78);
  context.clip();
  drawImageCover(
    context,
    image,
    photoX,
    photoY,
    renderedWidth,
    renderedHeight,
    1 + clamp(seconds / 10) * 0.06,
  );
  const shade = context.createLinearGradient(0, photoY, 0, photoY + renderedHeight);
  shade.addColorStop(0.55, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(6,4,24,0.22)");
  context.fillStyle = shade;
  context.fillRect(photoX, photoY, renderedWidth, renderedHeight);
  context.restore();
}

function drawTitle(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  format: VideoFormat,
  seconds: number,
  theme: ThemeDefinition,
) {
  const portrait = format === "portrait";
  const reveal = getPosterRevealProgress(seconds);
  const titleScale = 0.93 + easeOutBack(reveal) * 0.07;
  const fontSize = portrait ? width * 0.115 : width * 0.073;
  const centerX = portrait ? width * 0.5 : width * 0.26;
  const firstY = portrait ? height * 0.69 : height * 0.41;
  const lineGap = fontSize * 1.02;
  const maxTitleWidth = portrait ? width * 0.88 : width * 0.42;

  context.save();
  context.globalAlpha = reveal;
  context.translate(centerX, firstY + lineGap * 0.5);
  context.scale(titleScale, titleScale);
  context.translate(-centerX, -(firstY + lineGap * 0.5));
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;

  context.shadowColor = theme.colors.beamLeft;
  context.shadowBlur = width * 0.018;
  context.fillStyle = "#ffffff";
  context.fillText(theme.title[0], centerX, firstY, maxTitleWidth);

  context.font = `900 ${fontSize * theme.titleScale}px Arial, Helvetica, sans-serif`;
  context.shadowColor = theme.colors.accent;
  context.fillStyle = theme.colors.accent;
  context.fillText(theme.title[1], centerX, firstY + lineGap, maxTitleWidth);

  const underlineWidth =
    Math.min(maxTitleWidth * 0.92, fontSize * 4.1) *
    easeOutCubic((seconds - POSTER_CONTENT_START_SECONDS - 0.42) / 0.55);
  const underline = context.createLinearGradient(
    centerX - underlineWidth / 2,
    0,
    centerX + underlineWidth / 2,
    0,
  );
  underline.addColorStop(0, "rgba(255,255,255,0)");
  underline.addColorStop(0.5, theme.colors.accent);
  underline.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = underline;
  context.fillRect(
    centerX - underlineWidth / 2,
    firstY + lineGap * 1.58,
    underlineWidth,
    Math.max(3, width * 0.004),
  );
  context.restore();
}

function drawConfetti(
  context: CanvasRenderingContext2D,
  particles: ConfettiParticle[],
  width: number,
  height: number,
  seconds: number,
) {
  const localSeconds = Math.max(0, seconds - CELEBRATION_BURST_SECONDS);
  const fadeIn = clamp(localSeconds / 0.18);

  context.save();
  context.globalAlpha = fadeIn;
  for (const particle of particles) {
    const x = (particle.x + Math.sin(localSeconds * 2 + particle.y * 7) * particle.drift) * width;
    const y = ((particle.y + localSeconds * particle.speed) % 1.16 - 0.08) * height;
    const size = particle.size * width;

    context.save();
    context.translate(x, y);
    context.rotate(particle.rotation + localSeconds * particle.spin);
    context.fillStyle = particle.color;
    if (particle.shape === "circle") {
      context.beginPath();
      context.arc(0, 0, size * 0.52, 0, Math.PI * 2);
      context.fill();
    } else {
      context.fillRect(-size / 2, -size * 0.24, size, size * 0.48);
    }
    context.restore();
  }
  context.restore();
}

function drawCelebrationBurst(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number,
  theme: ThemeDefinition,
) {
  const localSeconds = seconds - CELEBRATION_BURST_SECONDS;
  if (localSeconds < 0 || localSeconds > 1.15) return;

  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const expansion = easeOutCubic(localSeconds / 0.72);
  const alpha = 1 - clamp((localSeconds - 0.28) / 0.87);
  const ringRadius = Math.max(width, height) * 0.48 * expansion;

  context.save();
  context.globalAlpha = alpha;
  context.globalCompositeOperation = "screen";

  const core = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    Math.max(width, height) * (0.08 + expansion * 0.32),
  );
  core.addColorStop(0, "rgba(255,255,255,0.98)");
  core.addColorStop(0.16, "rgba(255,225,116,0.88)");
  core.addColorStop(0.5, "rgba(255,122,64,0.28)");
  core.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = core;
  context.fillRect(0, 0, width, height);

  context.translate(centerX, centerY);
  context.strokeStyle = theme.colors.accent;
  context.lineWidth = Math.max(3, width * 0.006 * (1 - expansion * 0.45));
  context.shadowColor = theme.colors.accent;
  context.shadowBlur = width * 0.025;
  context.beginPath();
  context.arc(0, 0, ringRadius, 0, Math.PI * 2);
  context.stroke();

  for (let rayIndex = 0; rayIndex < 32; rayIndex += 1) {
    const angle = (rayIndex / 32) * Math.PI * 2 + rayIndex * 0.17;
    const inner = ringRadius * (0.48 + (rayIndex % 4) * 0.035);
    const outer = ringRadius * (0.98 + (rayIndex % 3) * 0.12);
    context.strokeStyle = rayIndex % 2 === 0 ? "#ffffff" : theme.colors.accent;
    context.lineWidth = Math.max(1.5, width * (rayIndex % 3 === 0 ? 0.005 : 0.0025));
    context.beginPath();
    context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    context.stroke();
  }

  for (let sparkleIndex = 0; sparkleIndex < 16; sparkleIndex += 1) {
    const angle = sparkleIndex * 2.399 + localSeconds * 1.4;
    const distance = ringRadius * (0.5 + (sparkleIndex % 5) * 0.12);
    drawSparkle(
      context,
      Math.cos(angle) * distance,
      Math.sin(angle) * distance,
      width * (0.006 + (sparkleIndex % 3) * 0.003),
      sparkleIndex % 2 === 0 ? "#ffffff" : theme.colors.accent,
    );
  }

  context.restore();
}

function getCharacterMotion(
  motion: CharacterMotion,
  seconds: number,
  height: number,
) {
  switch (motion) {
    case "romantic-sway":
      return {
        y: Math.sin(seconds * 2.1) * height * 0.005,
        rotation: Math.sin(seconds * 2.1) * 0.012,
        scale: 1 + Math.sin(seconds * 2.1) * 0.008,
      };
    case "petal-hop":
      return {
        y: -Math.abs(Math.sin(seconds * 4.3)) * height * 0.012,
        rotation: Math.sin(seconds * 4.3) * 0.015,
        scale: 1 + Math.abs(Math.sin(seconds * 4.3)) * 0.012,
      };
    case "high-five":
      return {
        y: -Math.abs(Math.sin(seconds * 3.8)) * height * 0.01,
        rotation: Math.sin(seconds * 3.8) * 0.01,
        scale: 1 + Math.abs(Math.sin(seconds * 3.8)) * 0.009,
      };
    case "gentle-float":
      return {
        y: Math.sin(seconds * 1.65) * height * 0.008,
        rotation: Math.sin(seconds * 1.4) * 0.006,
        scale: 1 + Math.sin(seconds * 1.65) * 0.006,
      };
    case "victory-jump":
      return {
        y: -Math.abs(Math.sin(seconds * 4.6)) * height * 0.016,
        rotation: Math.sin(seconds * 4.6) * 0.014,
        scale: 1 + Math.abs(Math.sin(seconds * 4.6)) * 0.012,
      };
    case "party-bounce":
    default:
      return {
        y: Math.sin(seconds * 5) * height * 0.009,
        rotation: Math.sin(seconds * 7) * 0.012,
        scale: 1,
      };
  }
}

function drawCelebrationCharacters(
  context: CanvasRenderingContext2D,
  assets: LoadedAssets,
  width: number,
  height: number,
  format: VideoFormat,
  seconds: number,
  theme: ThemeDefinition,
) {
  const portrait = format === "portrait";
  const characterImage = assets.characters[theme.id];
  const widthRatio = portrait
    ? theme.characterWidth.portrait
    : theme.characterWidth.landscape;
  const cartoonWidth = width * widthRatio;
  const cartoonHeight =
    cartoonWidth * (characterImage.naturalHeight / characterImage.naturalWidth);
  const cartoonX = width - cartoonWidth - width * 0.018;
  const motion = getCharacterMotion(theme.motion, seconds, height);
  const cartoonY = height - cartoonHeight * 0.92 + motion.y;
  const reveal = getPosterRevealProgress(seconds);
  const cartoonReveal = 0.93 + easeOutBack(reveal) * 0.07;

  context.save();
  context.globalAlpha = reveal;
  context.translate(cartoonX + cartoonWidth / 2, cartoonY + cartoonHeight / 2);
  context.rotate(motion.rotation);
  context.scale(
    Math.max(0.001, cartoonReveal * motion.scale),
    Math.max(0.001, cartoonReveal * motion.scale),
  );
  context.translate(-(cartoonX + cartoonWidth / 2), -(cartoonY + cartoonHeight / 2));
  context.shadowColor = theme.colors.shadow;
  context.shadowBlur = width * 0.018;
  context.drawImage(
    characterImage,
    cartoonX,
    cartoonY,
    cartoonWidth,
    cartoonHeight,
  );
  context.restore();
}

function drawLogo(
  context: CanvasRenderingContext2D,
  assets: LoadedAssets,
  width: number,
  height: number,
  format: VideoFormat,
  seconds: number,
  theme: ThemeDefinition,
) {
  const portrait = format === "portrait";
  const logoWidth = portrait ? width * 0.2 : width * 0.13;
  const logoHeight = logoWidth * (assets.logo.naturalHeight / assets.logo.naturalWidth);
  const logoX = portrait ? width * 0.03 : width * 0.028;
  const logoY = portrait ? height * 0.016 : height * 0.025;
  const reveal = getPosterRevealProgress(seconds);

  context.save();
  context.globalAlpha = reveal;
  context.shadowColor = theme.colors.shadow;
  context.shadowBlur = width * 0.016;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(assets.logo, logoX, logoY, logoWidth, logoHeight);
  context.restore();
}

function drawVideoFrame(
  context: CanvasRenderingContext2D,
  assets: LoadedAssets,
  particles: ConfettiParticle[],
  format: VideoFormat,
  theme: ThemeDefinition,
  elapsedMs: number,
) {
  const { width, height } = FORMAT_SIZE[format];
  const seconds = Math.max(0, elapsedMs) / 1000;

  context.clearRect(0, 0, width, height);
  drawBackground(context, width, height, seconds, theme);
  drawPhoto(context, assets.photo, width, height, format, seconds, theme);
  drawCelebrationCharacters(context, assets, width, height, format, seconds, theme);
  drawTitle(context, width, height, format, seconds, theme);
  drawCountdown(context, width, height, seconds);
  drawCurtainReveal(context, assets, width, height, format, seconds);
  drawConfetti(context, particles, width, height, seconds);
  drawCelebrationBurst(context, width, height, seconds, theme);

  const flashStart = POSTER_REVEAL_SECONDS - 0.08;
  const flashLocalSeconds = seconds - flashStart;
  if (flashLocalSeconds >= 0 && flashLocalSeconds < 0.5) {
    const revealBurst =
      flashLocalSeconds < 0.08
        ? easeOutCubic(flashLocalSeconds / 0.08)
        : 1 - easeOutCubic((flashLocalSeconds - 0.08) / 0.42);
    const revealFlash = context.createRadialGradient(
      width * 0.5,
      height * 0.48,
      0,
      width * 0.5,
      height * 0.48,
      Math.max(width, height) * 0.72,
    );
    revealFlash.addColorStop(0, `rgba(255,255,255,${revealBurst * 0.62})`);
    revealFlash.addColorStop(
      0.3,
      `rgba(255,210,63,${revealBurst * 0.38})`,
    );
    revealFlash.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = revealFlash;
    context.fillRect(0, 0, width, height);
  }

  drawLogo(context, assets, width, height, format, seconds, theme);
}

function getRecorderSettings() {
  const candidates = [
    { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", extension: "mp4" },
    { mimeType: "video/webm;codecs=vp9,opus", extension: "webm" },
    { mimeType: "video/webm;codecs=vp8,opus", extension: "webm" },
    { mimeType: "video/webm", extension: "webm" },
  ];

  return candidates.find(({ mimeType }) => MediaRecorder.isTypeSupported(mimeType));
}

function scheduleNoiseBurst(
  context: AudioContext,
  output: AudioNode,
  startTime: number,
  duration: number,
  peakGain: number,
  filterType: BiquadFilterType,
  frequency: number,
) {
  const sampleCount = Math.ceil(context.sampleRate * duration);
  const noiseBuffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const samples = noiseBuffer.getChannelData(0);

  for (let index = 0; index < samples.length; index += 1) {
    const decay = 1 - index / samples.length;
    samples[index] = (Math.random() * 2 - 1) * decay;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = noiseBuffer;
  filter.type = filterType;
  filter.frequency.setValueAtTime(frequency, startTime);
  filter.Q.setValueAtTime(filterType === "bandpass" ? 0.85 : 0.5, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(output);
  source.start(startTime);
  source.stop(startTime + duration);
}

async function createCelebrationAudio(
  themeId: CelebrationTheme,
  audible = false,
): Promise<AudioRecording | null> {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return null;

  const context = new AudioContextConstructor();
  await context.resume();
  const destination = context.createMediaStreamDestination();
  const master = context.createGain();
  const compressor = context.createDynamicsCompressor();
  master.gain.setValueAtTime(0.72, context.currentTime);
  compressor.threshold.setValueAtTime(-12, context.currentTime);
  compressor.knee.setValueAtTime(20, context.currentTime);
  compressor.ratio.setValueAtTime(8, context.currentTime);
  compressor.attack.setValueAtTime(0.003, context.currentTime);
  compressor.release.setValueAtTime(0.25, context.currentTime);
  master.connect(compressor);
  compressor.connect(destination);
  if (audible) compressor.connect(context.destination);

  const countdownBuffers = await Promise.all(
    ["three", "two", "one"].map(async (word) => {
      const response = await fetch(`/audio/celebrations/${word}.mp3`);
      if (!response.ok) throw new Error(`Could not load the ${word} countdown voice.`);
      return context.decodeAudioData(await response.arrayBuffer());
    }),
  );
  const birthdayMusicBuffer =
    themeId === "birthday"
      ? await fetch("/audio/celebrations/telugu-birthday-song.mp3").then(
          async (response) => {
            if (!response.ok) throw new Error("Could not load the birthday song.");
            return context.decodeAudioData(await response.arrayBuffer());
          },
        )
      : null;
  const cheerBuffer =
    themeId === "birthday"
      ? await fetch("/audio/celebrations/cheer.mp3").then(
          async (response) => {
            if (!response.ok) throw new Error("Could not load the cheering audio.");
            return context.decodeAudioData(await response.arrayBuffer());
          },
        )
      : null;
  const start = context.currentTime + 0.05;

  countdownBuffers.forEach((buffer, index) => {
    const voice = context.createBufferSource();
    const voiceGain = context.createGain();
    voice.buffer = buffer;
    voiceGain.gain.setValueAtTime(1, start + index);
    voice.connect(voiceGain);
    voiceGain.connect(master);
    voice.start(start + index + 0.08);
  });

  if (birthdayMusicBuffer) {
    const birthdayMusic = context.createBufferSource();
    const birthdayMusicGain = context.createGain();
    const musicStart = start + BIRTHDAY_SONG_START_SECONDS;
    const musicEnd = musicStart + birthdayMusicBuffer.duration;
    birthdayMusic.buffer = birthdayMusicBuffer;
    birthdayMusicGain.gain.setValueAtTime(0, musicStart);
    birthdayMusicGain.gain.linearRampToValueAtTime(0.62, musicStart + 0.42);
    birthdayMusicGain.gain.setValueAtTime(0.62, musicEnd - 0.5);
    birthdayMusicGain.gain.linearRampToValueAtTime(0, musicEnd);
    birthdayMusic.connect(birthdayMusicGain);
    birthdayMusicGain.connect(master);
    birthdayMusic.start(musicStart);
    birthdayMusic.stop(musicEnd);
  }

  if (cheerBuffer) {
    const cheer = context.createBufferSource();
    const cheerGain = context.createGain();
    const cheerStart = start + CELEBRATION_BURST_SECONDS;
    const cheerSettled = cheerStart + CHEER_SETTLE_SECONDS;
    const cheerEnd = cheerStart + cheerBuffer.duration;
    cheer.buffer = cheerBuffer;
    cheerGain.gain.setValueAtTime(0, cheerStart);
    cheerGain.gain.linearRampToValueAtTime(1, cheerStart + 0.06);
    cheerGain.gain.setValueAtTime(1, cheerStart + 0.3);
    cheerGain.gain.linearRampToValueAtTime(0.2, cheerSettled);
    cheerGain.gain.setValueAtTime(0.2, cheerEnd - 0.35);
    cheerGain.gain.linearRampToValueAtTime(0, cheerEnd);
    cheer.connect(cheerGain);
    cheerGain.connect(master);
    cheer.start(cheerStart);
    cheer.stop(cheerEnd);
  }

  [0.08, 1.08, 2.08].forEach((offset, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = start + offset;
    const duration = 0.55;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(110 + index * 28, noteStart);
    oscillator.frequency.exponentialRampToValueAtTime(
      72 + index * 18,
      noteStart + duration,
    );
    gain.gain.setValueAtTime(0, noteStart);
    gain.gain.linearRampToValueAtTime(0.19, noteStart + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + duration + 0.05);
  });

  const posterRevealTime = start + CELEBRATION_BURST_SECONDS;
  const revealImpact = context.createOscillator();
  const revealImpactGain = context.createGain();
  revealImpact.type = "sine";
  revealImpact.frequency.setValueAtTime(165, posterRevealTime);
  revealImpact.frequency.exponentialRampToValueAtTime(58, posterRevealTime + 0.72);
  revealImpactGain.gain.setValueAtTime(0, posterRevealTime);
  revealImpactGain.gain.linearRampToValueAtTime(0.16, posterRevealTime + 0.025);
  revealImpactGain.gain.exponentialRampToValueAtTime(0.001, posterRevealTime + 0.78);
  revealImpact.connect(revealImpactGain);
  revealImpactGain.connect(master);
  revealImpact.start(posterRevealTime);
  revealImpact.stop(posterRevealTime + 0.82);

  scheduleNoiseBurst(
    context,
    master,
    posterRevealTime,
    0.58,
    0.3,
    "lowpass",
    1_250,
  );

  [0.08, 0.2, 0.32, 0.44, 0.54].forEach((offset, index) => {
    scheduleNoiseBurst(
      context,
      master,
      posterRevealTime + offset,
      0.09 + (index % 2) * 0.025,
      0.1 + (index % 3) * 0.018,
      "bandpass",
      1_550 + index * 110,
    );
  });

  const [track] = destination.stream.getAudioTracks();
  return track ? { context, track } : null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function BirthdayVideoMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineStartRef = useRef(0);
  const uploadedUrlRef = useRef<string | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const fullscreenAudioRef = useRef<AudioRecording | null>(null);
  const fullscreenAudioTimerRef = useRef<number | null>(null);
  const [format, setFormat] = useState<VideoFormat>("landscape");
  const [themeId, setThemeId] = useState<CelebrationTheme>("birthday");
  const [assets, setAssets] = useState<LoadedAssets | null>(null);
  const [photoName, setPhotoName] = useState("Sample guest portrait");
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Upload a guest photo or try the sample.");
  const [error, setError] = useState<string | null>(null);
  const particlesRef = useRef(createConfetti(150));

  useEffect(() => {
    let cancelled = false;

    loadCelebrationAssets()
      .then((loadedAssets) => {
        if (cancelled) return;
        setAssets(loadedAssets);
        timelineStartRef.current = performance.now();
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(getErrorMessage(loadError));
      });

    return () => {
      cancelled = true;
      if (uploadedUrlRef.current) URL.revokeObjectURL(uploadedUrlRef.current);
      if (recordingTimerRef.current !== null) window.clearTimeout(recordingTimerRef.current);
      if (fullscreenAudioTimerRef.current !== null) {
        window.clearTimeout(fullscreenAudioTimerRef.current);
      }
      if (fullscreenAudioRef.current) {
        fullscreenAudioRef.current.track.stop();
        void fullscreenAudioRef.current.context.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!assets) return;
    let frameId = 0;

    const render = (now: number) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          const elapsed = now - timelineStartRef.current;
          drawVideoFrame(
            context,
            assets,
            particlesRef.current,
            format,
            THEMES_BY_ID[themeId],
            elapsed,
          );
        }
      }
      frameId = window.requestAnimationFrame(render);
    };

    timelineStartRef.current = performance.now();
    frameId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frameId);
  }, [assets, format, themeId]);

  const applyPhoto = useCallback(
    async (file: File) => {
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("Please choose a JPG, PNG, or WebP photo.");
        return;
      }
      if (file.size > MAX_PHOTO_SIZE) {
        setError("That photo is larger than 15 MB. Please choose a smaller file.");
        return;
      }

      try {
        const nextUrl = URL.createObjectURL(file);
        const nextPhoto = await loadImage(nextUrl);
        if (uploadedUrlRef.current) URL.revokeObjectURL(uploadedUrlRef.current);
        uploadedUrlRef.current = nextUrl;
        setAssets((current) => (current ? { ...current, photo: nextPhoto } : current));
        setPhotoName(file.name);
        setStatus("Photo ready. Preview, play full screen, or create the video.");
        timelineStartRef.current = performance.now();
      } catch (photoError: unknown) {
        setError(getErrorMessage(photoError));
      }
    },
    [],
  );

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);
    if (file) void applyPhoto(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const [file] = Array.from(event.dataTransfer.files);
    if (file) void applyPhoto(file);
  };

  const restartPreview = () => {
    timelineStartRef.current = performance.now();
    setStatus("Preview restarted from the opening spotlight.");
  };

  const playFullscreen = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const playbackDurationMs = getVideoDurationMs(themeId);
    setError(null);
    try {
      await canvas.requestFullscreen();
      if (fullscreenAudioRef.current) {
        fullscreenAudioRef.current.track.stop();
        await fullscreenAudioRef.current.context.close();
      }
      if (fullscreenAudioTimerRef.current !== null) {
        window.clearTimeout(fullscreenAudioTimerRef.current);
      }

      const fullscreenAudio = await createCelebrationAudio(themeId, true);
      timelineStartRef.current = performance.now();
      fullscreenAudioRef.current = fullscreenAudio;
      fullscreenAudioTimerRef.current = window.setTimeout(() => {
        if (fullscreenAudioRef.current) {
          fullscreenAudioRef.current.track.stop();
          void fullscreenAudioRef.current.context.close();
          fullscreenAudioRef.current = null;
        }
        fullscreenAudioTimerRef.current = null;
      }, playbackDurationMs);
      setStatus(
        themeId === "birthday"
          ? "Playing the full cinematic reveal and complete birthday song. Press Esc to leave full screen."
          : "Playing the full cinematic celebration. Press Esc to leave full screen.",
      );
    } catch (fullscreenError: unknown) {
      setError(getErrorMessage(fullscreenError));
    }
  };

  const createVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !assets || isRecording) return;
    setError(null);

    if (!("captureStream" in canvas) || typeof MediaRecorder === "undefined") {
      setError("This browser cannot record the animation. Please use the latest Chrome, Edge, or Safari.");
      return;
    }

    const recorderSettings = getRecorderSettings();
    if (!recorderSettings) {
      setError("This browser does not provide a compatible video recorder.");
      return;
    }

    try {
      setIsRecording(true);
      const videoDurationMs = getVideoDurationMs(themeId);
      const videoDurationSeconds = Math.ceil(videoDurationMs / 1000);
      setStatus(
        `Creating your ${videoDurationSeconds}-second video… keep this tab open.`,
      );

      const videoStream = canvas.captureStream(VIDEO_FPS);
      const audioRecording = await createCelebrationAudio(themeId);
      const stream = new MediaStream(videoStream.getVideoTracks());
      if (audioRecording) stream.addTrack(audioRecording.track);

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, {
        mimeType: recorderSettings.mimeType,
        videoBitsPerSecond: format === "landscape" ? 8_000_000 : 7_000_000,
        audioBitsPerSecond: 160_000,
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onerror = () => {
        setError("The recording stopped unexpectedly. Please try again.");
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorderSettings.mimeType });
        const downloadUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = `${THEMES_BY_ID[themeId].fileStem}-${format}.${recorderSettings.extension}`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 2_000);
        stream.getTracks().forEach((track) => track.stop());
        if (audioRecording) void audioRecording.context.close();
        setIsRecording(false);
        setStatus("Video downloaded. You can reuse the maker for the next guest.");
      };

      timelineStartRef.current = performance.now();
      recorder.start(250);
      recordingTimerRef.current = window.setTimeout(() => {
        if (recorder.state !== "inactive") recorder.stop();
        recordingTimerRef.current = null;
      }, videoDurationMs);
    } catch (recordingError: unknown) {
      setIsRecording(false);
      setError(getErrorMessage(recordingError));
    }
  };

  const { width, height } = FORMAT_SIZE[format];
  const selectedTheme = THEMES_BY_ID[themeId];
  const videoDurationSeconds = Math.ceil(getVideoDurationMs(themeId) / 1000);

  return (
    <main className={styles.pageShell}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <header className={styles.topBar}>
        <Link className={styles.brandLink} href="/">
          <span className={styles.brandMark}>G</span>
          <span>
            <strong>Game Show</strong>
            <small>Celebration studio</small>
          </span>
        </Link>
        <div className={styles.privateBadge}>
          <ShieldCheck size={16} aria-hidden="true" />
          Photos stay on this device
        </div>
      </header>

      <section className={styles.intro}>
        <div className={styles.eyebrow}>
          <Sparkles size={16} aria-hidden="true" />
          Reusable show tool
        </div>
        <h1>Create every celebration in one click.</h1>
        <p>
          Choose an occasion, add the guest photo, then play the personalized cinematic moment on your show screen or download it.
        </p>
      </section>

      <section className={styles.studioGrid}>
        <aside className={styles.controlPanel}>
          <div className={styles.stepHeading}>
            <span>1</span>
            <div>
              <h2>Choose the celebration</h2>
              <p>Every theme has its own cartoons, colors, title, and motion.</p>
            </div>
          </div>

          <div className={styles.themePicker}>
            {CELEBRATION_THEMES.map((theme) => (
              <button
                key={theme.id}
                className={themeId === theme.id ? styles.themeActive : ""}
                type="button"
                onClick={() => {
                  setThemeId(theme.id);
                  timelineStartRef.current = performance.now();
                  setStatus(`${theme.label} theme ready.`);
                }}
                disabled={isRecording}
              >
                <span aria-hidden="true">{theme.icon}</span>
                {theme.label}
              </button>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.stepHeading}>
            <span>2</span>
            <div>
              <h2>Add the guest photo</h2>
              <p>Portrait photos with the face near the center work best.</p>
            </div>
          </div>

          <label
            className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ""}`}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} />
            <ImagePlus size={28} aria-hidden="true" />
            <span>Choose photo</span>
            <small>or drag it here · max 15 MB</small>
          </label>

          <div className={styles.fileStatus}>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span title={photoName}>{photoName}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.stepHeading}>
            <span>3</span>
            <div>
              <h2>Choose the screen</h2>
              <p>Use 16:9 for the game room display.</p>
            </div>
          </div>

          <div className={styles.formatPicker}>
            <button
              className={format === "landscape" ? styles.formatActive : ""}
              type="button"
              onClick={() => setFormat("landscape")}
            >
              <span className={styles.landscapeIcon} />
              Show screen
              <small>16:9</small>
            </button>
            <button
              className={format === "portrait" ? styles.formatActive : ""}
              type="button"
              onClick={() => setFormat("portrait")}
            >
              <span className={styles.portraitIcon} />
              Social story
              <small>9:16</small>
            </button>
          </div>

          <div className={styles.divider} />

          <div className={styles.stepHeading}>
            <span>4</span>
            <div>
              <h2>Play or download</h2>
              <p>Includes the countdown, curtain reveal, applause blast, and occasion audio.</p>
            </div>
          </div>

          <button className={styles.primaryButton} type="button" onClick={createVideo} disabled={isRecording || !assets}>
            {isRecording ? <LoaderCircle className={styles.spinner} size={20} /> : <Download size={20} />}
            {isRecording ? "Creating video…" : "Create & download video"}
          </button>
          <button className={styles.secondaryButton} type="button" onClick={playFullscreen} disabled={!assets}>
            <Expand size={19} aria-hidden="true" />
            Play continuously full screen
          </button>

          <p className={styles.statusMessage} aria-live="polite">
            {error ? <span className={styles.errorMessage}>{error}</span> : status}
          </p>
        </aside>

        <div className={styles.previewPanel}>
          <div className={styles.previewHeader}>
            <div>
              <span className={styles.liveDot} />
              Live preview
            </div>
            <button type="button" onClick={restartPreview}>
              <RotateCcw size={15} aria-hidden="true" />
              Restart
            </button>
          </div>

          <div className={`${styles.canvasStage} ${format === "portrait" ? styles.canvasStagePortrait : ""}`}>
            {!assets && (
              <div className={styles.loadingPreview}>
                <LoaderCircle className={styles.spinner} size={30} />
                Loading celebration themes…
              </div>
            )}
            <canvas
              ref={canvasRef}
              className={styles.previewCanvas}
              width={width}
              height={height}
              aria-label={`Animated ${selectedTheme.label} video preview`}
            />
          </div>

          <div className={styles.previewFooter}>
            <span>
              <Film size={16} aria-hidden="true" />
              {videoDurationSeconds} seconds · {width} × {height}
            </span>
            <button type="button" onClick={restartPreview}>
              <Play size={15} fill="currentColor" aria-hidden="true" />
              Play preview
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
