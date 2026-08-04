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

const VIDEO_DURATION_MS = 10_000;
const VIDEO_FPS = 30;
const MAX_PHOTO_SIZE = 15 * 1024 * 1024;

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
  const [photo, logo, ...themeImages] = await Promise.all([
    loadImage("/images/birthday/birthday-sample.png"),
    loadImage("/images/logo-transparent.png"),
    ...CELEBRATION_THEMES.map((theme) => loadImage(theme.assetSrc)),
  ]);

  const characters = Object.fromEntries(
    CELEBRATION_THEMES.map((theme, index) => [theme.id, themeImages[index]]),
  ) as Record<CelebrationTheme, HTMLImageElement>;

  return { photo, logo, characters };
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

function drawPhoto(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  format: VideoFormat,
  seconds: number,
  theme: ThemeDefinition,
) {
  const entrance = easeOutBack((seconds - 0.35) / 1.1);
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
  const reveal = easeOutBack((seconds - 1.15) / 0.9);
  const alpha = clamp((seconds - 1) / 0.55);
  const fontSize = portrait ? width * 0.115 : width * 0.073;
  const centerX = portrait ? width * 0.5 : width * 0.26;
  const firstY = portrait ? height * 0.69 : height * 0.41;
  const lineGap = fontSize * 1.02;
  const maxTitleWidth = portrait ? width * 0.88 : width * 0.42;

  context.save();
  context.globalAlpha = alpha;
  context.translate(centerX, firstY + lineGap * 0.5);
  context.scale(Math.max(0.001, reveal), Math.max(0.001, reveal));
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
    easeOutCubic((seconds - 1.75) / 0.8);
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
  const localSeconds = Math.max(0, seconds - 1.8);
  const fadeIn = clamp(localSeconds / 0.6);

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
  const cartoonReveal = easeOutBack((seconds - 1.7) / 0.8);

  context.save();
  context.globalAlpha = clamp((seconds - 1.55) / 0.5);
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
  const reveal = clamp(seconds / 0.75);

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
  drawConfetti(context, particles, width, height, seconds);
  drawLogo(context, assets, width, height, format, seconds, theme);

  const flashTime = (seconds + 0.15) % 2.35;
  const flash = seconds > 2.1 ? clamp(1 - flashTime / 0.12) : 0;
  context.fillStyle = `rgba(255,255,255,${flash * 0.16})`;
  context.fillRect(0, 0, width, height);
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

async function createCelebrationAudio(): Promise<AudioRecording | null> {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return null;

  const context = new AudioContextConstructor();
  await context.resume();
  const destination = context.createMediaStreamDestination();
  const master = context.createGain();
  master.gain.setValueAtTime(0.72, context.currentTime);
  master.connect(destination);

  const start = context.currentTime + 0.05;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const noteTimes = [0.18, 0.5, 0.82, 1.14, 6.9, 7.22, 7.54, 7.86];

  noteTimes.forEach((offset, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = start + offset;
    const duration = index < 4 ? 0.48 : 0.62;

    oscillator.type = index % 2 === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(notes[index % notes.length], noteStart);
    gain.gain.setValueAtTime(0, noteStart);
    gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + duration + 0.05);
  });

  const chordStart = start + 2.15;
  [261.63, 329.63, 392].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, chordStart);
    gain.gain.setValueAtTime(0, chordStart);
    gain.gain.linearRampToValueAtTime(0.018, chordStart + 0.4 + index * 0.08);
    gain.gain.setValueAtTime(0.018, start + 7.2);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 8.7);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(chordStart);
    oscillator.stop(start + 8.8);
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
    setError(null);
    timelineStartRef.current = performance.now();
    try {
      await canvas.requestFullscreen();
      setStatus("Playing continuously. Press Esc whenever you are ready to stop.");
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
      setStatus("Creating your 10-second video… keep this tab open.");

      const videoStream = canvas.captureStream(VIDEO_FPS);
      const audioRecording = await createCelebrationAudio();
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
      }, VIDEO_DURATION_MS);
    } catch (recordingError: unknown) {
      setIsRecording(false);
      setError(getErrorMessage(recordingError));
    }
  };

  const { width, height } = FORMAT_SIZE[format];
  const selectedTheme = THEMES_BY_ID[themeId];

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
          Choose an occasion, add the guest photo, then play the personalized 10-second moment on your show screen or download it.
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
              <p>The video includes its own original celebration chime.</p>
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
              10 seconds · {width} × {height}
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
