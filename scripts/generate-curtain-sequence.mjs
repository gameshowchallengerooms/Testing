import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const imageDirectory = path.join(
  repositoryRoot,
  "public/images/celebrations",
);

const formats = [
  { name: "landscape", width: 1280, height: 720, characterWidth: 0.17 },
  { name: "portrait", width: 720, height: 1280, characterWidth: 0.3 },
];

const frameProgress = [0, 0.16, 0.36, 0.62, 0.62, 0.81, 1];
const poseForFrame = [0, 1, 2, 2, 0, 1, 2];
const poseMetadata = [
  { curtainEdgeX: 0.51, handY: 0.283, footY: 0.925 },
  { curtainEdgeX: 0.463, handY: 0.273, footY: 0.915 },
  { curtainEdgeX: 0.48, handY: 0.28, footY: 0.925 },
];

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function cubicValue(start, controlOne, controlTwo, end, time) {
  const inverse = 1 - time;
  return (
    inverse ** 3 * start +
    3 * inverse ** 2 * time * controlOne +
    3 * inverse * time ** 2 * controlTwo +
    time ** 3 * end
  );
}

function cubicTimeForValue(start, controlOne, controlTwo, end, target) {
  let minimum = 0;
  let maximum = 1;

  for (let iteration = 0; iteration < 14; iteration += 1) {
    const midpoint = (minimum + maximum) * 0.5;
    const value = cubicValue(
      start,
      controlOne,
      controlTwo,
      end,
      midpoint,
    );
    if (value < target) minimum = midpoint;
    else maximum = midpoint;
  }

  return (minimum + maximum) * 0.5;
}

function getCurtainGeometry(width, height, progress, side) {
  const direction = side === "left" ? -1 : 1;
  const outerEdge = side === "left" ? 0 : width;
  const centerX = width * 0.5;
  const maximumPull = width * 0.39;
  const topInner = centerX + direction * maximumPull * progress * 0.92;
  const shoulderInner = centerX + direction * maximumPull * progress * 1.04;
  const gatheredInner = centerX + direction * maximumPull * progress * 1.12;
  const bottomInner = centerX + direction * maximumPull * progress * 0.88;

  const shape = [
    `M ${outerEdge} 0`,
    `L ${topInner} 0`,
    `C ${topInner + direction * width * 0.012} ${height * 0.14}`,
    `${shoulderInner - direction * width * 0.018} ${height * 0.34}`,
    `${shoulderInner} ${height * 0.42}`,
    `C ${gatheredInner} ${height * 0.49}`,
    `${gatheredInner} ${height * 0.6}`,
    `${gatheredInner} ${height * 0.66}`,
    `C ${gatheredInner - direction * width * 0.025} ${height * 0.77}`,
    `${bottomInner + direction * width * 0.035} ${height * 0.91}`,
    `${bottomInner} ${height}`,
    `L ${outerEdge} ${height}`,
    "Z",
  ].join(" ");

  const border = [
    `M ${topInner} 0`,
    `C ${shoulderInner} ${height * 0.28}`,
    `${gatheredInner} ${height * 0.52}`,
    `${gatheredInner} ${height * 0.66}`,
    `C ${gatheredInner} ${height * 0.78}`,
    `${bottomInner} ${height * 0.91}`,
    `${bottomInner} ${height}`,
  ].join(" ");

  return {
    border,
    bottomInner,
    direction,
    gatheredInner,
    outerEdge,
    shape,
    shoulderInner,
    topInner,
  };
}

function getCurtainEdgeAtY(width, height, progress, side, targetY) {
  const geometry = getCurtainGeometry(width, height, progress, side);
  const normalizedY = clamp(targetY / height);

  if (normalizedY <= 0.42) {
    const time = cubicTimeForValue(0, 0.14, 0.34, 0.42, normalizedY);
    return cubicValue(
      geometry.topInner,
      geometry.topInner + geometry.direction * width * 0.012,
      geometry.shoulderInner - geometry.direction * width * 0.018,
      geometry.shoulderInner,
      time,
    );
  }

  if (normalizedY <= 0.66) {
    const time = cubicTimeForValue(
      0.42,
      0.49,
      0.6,
      0.66,
      normalizedY,
    );
    return cubicValue(
      geometry.shoulderInner,
      geometry.gatheredInner,
      geometry.gatheredInner,
      geometry.gatheredInner,
      time,
    );
  }

  const time = cubicTimeForValue(
    0.66,
    0.77,
    0.91,
    1,
    normalizedY,
  );
  return cubicValue(
    geometry.gatheredInner,
    geometry.gatheredInner - geometry.direction * width * 0.025,
    geometry.bottomInner + geometry.direction * width * 0.035,
    geometry.bottomInner,
    time,
  );
}

function getValancePath(width, height) {
  const valanceHeight = height * 0.105;
  const scallopDepth = height * 0.055;
  const segments = [`M 0 0`, `L ${width} 0`, `L ${width} ${valanceHeight}`];

  for (let scallop = 8; scallop > 0; scallop -= 1) {
    const right = (scallop / 8) * width;
    const left = ((scallop - 1) / 8) * width;
    segments.push(
      `C ${right - width * 0.025} ${valanceHeight + scallopDepth}`,
      `${left + width * 0.025} ${valanceHeight + scallopDepth}`,
      `${left} ${valanceHeight}`,
    );
  }

  segments.push("Z");
  return segments.join(" ");
}

function getCurtainSvg(width, height, progress) {
  const left = getCurtainGeometry(width, height, progress, "left");
  const right = getCurtainGeometry(width, height, progress, "right");
  const valancePath = getValancePath(width, height);
  const goldWidth = Math.max(3, width * 0.005);
  const tieOpacity = progress > 0.35 ? clamp((progress - 0.35) / 0.35) : 0;

  const [leftFolds, rightFolds] = [left, right].map(
    (curtain, curtainIndex) => {
      const visibleWidth = Math.max(
        width * 0.1,
        Math.abs(curtain.gatheredInner - curtain.outerEdge),
      );
      return Array.from({ length: 12 }, (_, foldIndex) => {
        const position = (foldIndex + 0.5) / 12;
        const x =
          curtainIndex === 0
            ? curtain.outerEdge + visibleWidth * position
            : curtain.outerEdge - visibleWidth * position;
        const light = foldIndex % 3 === 1;
        return `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${
          light ? "#8f151f" : "#090001"
        }" stroke-opacity="${light ? 0.34 : 0.48}" stroke-width="${Math.max(
          4,
          visibleWidth * (light ? 0.07 : 0.045),
        )}" />`;
      }).join("");
    },
  );

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="leftVelvet" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#170000" />
          <stop offset="0.2" stop-color="#340105" />
          <stop offset="0.46" stop-color="#50060b" />
          <stop offset="0.68" stop-color="#290003" />
          <stop offset="0.86" stop-color="#8f151f" />
          <stop offset="1" stop-color="#340105" />
        </linearGradient>
        <linearGradient id="rightVelvet" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stop-color="#170000" />
          <stop offset="0.2" stop-color="#340105" />
          <stop offset="0.46" stop-color="#50060b" />
          <stop offset="0.68" stop-color="#290003" />
          <stop offset="0.86" stop-color="#8f151f" />
          <stop offset="1" stop-color="#340105" />
        </linearGradient>
        <linearGradient id="valanceVelvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#170000" />
          <stop offset="0.35" stop-color="#50060b" />
          <stop offset="0.7" stop-color="#340105" />
          <stop offset="1" stop-color="#1f0002" />
        </linearGradient>
        <clipPath id="leftClip"><path d="${left.shape}" /></clipPath>
        <clipPath id="rightClip"><path d="${right.shape}" /></clipPath>
      </defs>
      <path d="${left.shape}" fill="url(#leftVelvet)" />
      <path d="${right.shape}" fill="url(#rightVelvet)" />
      <g clip-path="url(#leftClip)">${leftFolds}</g>
      <g clip-path="url(#rightClip)">${rightFolds}</g>
      <path d="${left.border}" fill="none" stroke="#d69c31" stroke-width="${goldWidth}" />
      <path d="${right.border}" fill="none" stroke="#d69c31" stroke-width="${goldWidth}" />
      <ellipse cx="${left.gatheredInner}" cy="${height * 0.6}" rx="${
        width * 0.018
      }" ry="${height * 0.035}" fill="#d69c31" opacity="${tieOpacity}" />
      <ellipse cx="${right.gatheredInner}" cy="${height * 0.6}" rx="${
        width * 0.018
      }" ry="${height * 0.035}" fill="#d69c31" opacity="${tieOpacity}" />
      <path d="${valancePath}" fill="url(#valanceVelvet)" stroke="#d69c31" stroke-width="${
        goldWidth * 1.2
      }" />
    </svg>
  `;
}

for (const format of formats) {
  for (let frameIndex = 0; frameIndex < frameProgress.length; frameIndex += 1) {
    const progress = frameProgress[frameIndex];
    const poseIndex = poseForFrame[frameIndex];
    const metadata = poseMetadata[poseIndex];
    const characterWidth = Math.round(format.width * format.characterWidth);
    const characterHeight = Math.round(characterWidth * 1.5);
    const characterTop = Math.round(
      format.height - characterHeight * metadata.footY,
    );
    const handY = characterTop + characterHeight * metadata.handY;
    const curtainEdgeX = getCurtainEdgeAtY(
      format.width,
      format.height,
      progress,
      "right",
      handY,
    );
    const characterLeft = Math.round(
      curtainEdgeX - characterWidth * metadata.curtainEdgeX,
    );
    const character = await sharp(
      path.join(
        imageDirectory,
        `curtain-grip-pose-${poseIndex + 1}.png`,
      ),
    )
      .resize(characterWidth, characterHeight)
      .png()
      .toBuffer();
    const outputPath = path.join(
      imageDirectory,
      `curtain-scene-${format.name}-${frameIndex + 1}.png`,
    );

    await sharp(Buffer.from(getCurtainSvg(format.width, format.height, progress)))
      .composite([
        {
          input: character,
          left: characterLeft,
          top: characterTop,
        },
      ])
      .png()
      .toFile(outputPath);

    console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
  }
}
