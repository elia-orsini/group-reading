/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const xml2js = require("xml2js");
const { parseString } = xml2js;

const SKIP_INITIAL_CHAPTERS = 5;

async function processEPUB(epubPath, outputPath) {
  try {
    // Read the EPUB file
    const data = await fs.promises.readFile(epubPath);
    const zip = await JSZip.loadAsync(data);

    // Find the container file to locate the OPF
    const container = await zip.file("META-INF/container.xml").async("text");
    const containerData = await parseXml(container);
    const opfPath = containerData.container.rootfiles[0].rootfile[0].$["full-path"];

    // Parse the OPF file to get the manifest and spine
    const opfDir = path.dirname(opfPath);
    const opfContent = await zip.file(opfPath).async("text");
    const opfData = await parseXml(opfContent);

    // Extract chapters from spine
    const manifest = opfData.package.manifest[0].item;
    const spine = opfData.package.spine[0].itemref;

    const chapters = spine.slice(SKIP_INITIAL_CHAPTERS, spine.length).map((item) => {
      const id = item.$["idref"];
      const manifestItem = manifest.find((m) => m.$["id"] === id);
      return {
        id,
        href: path.join(opfDir, manifestItem.$["href"]),
        title: manifestItem.$["id"], // You might want to extract better titles
      };
    });

    // Create reading schedule starting from today
    const schedule = {};
    const oneDay = 24 * 60 * 60 * 1000;
    let currentDate = new Date();

    for (const chapter of chapters) {
      const dateStr = currentDate.toISOString().split("T")[0];
      schedule[dateStr] = chapter;

      // Read chapter content
      const chapterContent = await zip.file(chapter.href).async("text");
      schedule[dateStr].content = cleanHtml(chapterContent);

      currentDate = new Date(currentDate.getTime() + oneDay);
    }

    // Save the schedule
    await fs.promises.writeFile(outputPath, JSON.stringify(schedule, null, 2));
    console.log(`Schedule created at ${outputPath}`);
  } catch (error) {
    console.error("Error processing EPUB:", error);
  }
}

function cleanHtml(html) {
  // First, replace paragraph tags with a special marker
  let text = html
    .replace(/<p[^>]*>/gi, "\n") // Replace opening <p> tags with newline
    .replace(/<\/p>/gi, "\n") // Replace closing </p> tags with newline
    .replace(/<br[^>]*\/?>/gi, "\n") // Replace <br> tags with newline

    // Remove all other HTML tags
    .replace(/<[^>]+>/g, " ")

    // Collapse multiple newlines into single newlines
    .replace(/\n+/g, "\n")

    // Collapse multiple spaces into single space
    .replace(/[ ]+/g, " ")

    // Trim whitespace from start and end
    .trim();

  // Remove first 4 words (adjust the number if needed)
  text = text.replace(/^(\S+\s+){2}/, "");

  return text;
}

function parseXml(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// Usage: node epub-to-schedule.js input.epub output.json
const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.log("Usage: node epub-to-schedule.js <input.epub> <output.json>");
  process.exit(1);
}

processEPUB(input, output);
