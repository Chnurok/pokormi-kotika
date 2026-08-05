import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the complete pet-care game", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Мои зверята<\/title>/);
  assert.match(html, /Рыжик/);
  assert.match(html, /Звёздочка/);
  assert.match(html, /Выбрать питомца/);
  assert.match(html, /Уложить питомца спать/);
  assert.match(html, /Погладить питомца/);
  assert.match(html, /Выключить звук/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships an installable, offline-safe, ad-free product", async () => {
  const root = new URL("../", import.meta.url);
  const [page, layout, manifestText, serviceWorker, icon192, icon512, cover, catArt, horseArt] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("public/manifest.webmanifest", root), "utf8"),
    readFile(new URL("public/sw.js", root), "utf8"),
    stat(new URL("public/icon-192.png", root)),
    stat(new URL("public/icon-512.png", root)),
    stat(new URL("public/og.png", root)),
    stat(new URL("public/ryzhik-scene-v2.jpg", root)),
    stat(new URL("public/zvezdochka-scene-v2.jpg", root)),
  ]);

  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.name, "Мои зверята");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.icons.length, 2);

  assert.match(page, /serviceWorker\.register/);
  assert.match(page, /function petAnimal/);
  assert.match(page, /function toggleSleep/);
  assert.match(page, /soundEnabled/);
  assert.match(page, /flightTimerRef/);
  assert.match(page, /reactionTimerRef/);
  assert.match(page, /feedingFrame/);
  assert.match(page, /showFeedingFrame\(1, 210\)/);
  assert.match(page, /showFeedingFrame\(3, 850\)/);
  assert.match(page, /is-reaching/);
  assert.match(page, /bite-effect/);
  assert.match(page, /toggleGrooming/);
  assert.match(page, /beginBrush/);
  assert.match(page, /completeBrushStroke/);
  assert.match(page, /brushProgress/);
  assert.match(page, /Расчесать питомца/);
  assert.doesNotMatch(page, /onAnimationEnd=/);
  assert.match(serviceWorker, /caches\.open/);
  assert.match(serviceWorker, /self\.registration\.scope/);
  assert.match(serviceWorker, /event\.request\.mode === "navigate"/);
  assert.match(page, /updateViaCache: "none"/);
  assert.match(layout, /og\.png/);
  assert.match(layout, /manifest\.webmanifest/);
  assert.ok(icon192.size > 50_000);
  assert.ok(icon512.size > 200_000);
  assert.ok(cover.size > 1_000_000);
  assert.ok(catArt.size > 100_000);
  assert.ok(horseArt.size > 100_000);
  assert.match(page, /ryzhik-scene-v2\.jpg/);
  assert.match(page, /zvezdochka-scene-v2\.jpg/);
  assert.match(serviceWorker, /ryzhik-scene-v2\.jpg/);
  assert.match(serviceWorker, /zvezdochka-scene-v2\.jpg/);
  assert.match(page, /ryzhik-eat-1\.jpg/);
  assert.match(page, /zvezdochka-eat-4\.jpg/);
  assert.match(serviceWorker, /ryzhik-eat-4\.jpg/);
  assert.match(serviceWorker, /zvezdochka-eat-4\.jpg/);

  const productSource = `${page}\n${layout}`;
  assert.doesNotMatch(productSource, /google-analytics|doubleclick|advertising|payment|purchase|stripe\.com/i);
  assert.doesNotMatch(page, /href=|window\.open/);

  await Promise.all([
    access(new URL("public/icon-192.png", root)),
    access(new URL("public/icon-512.png", root)),
    access(new URL("public/og.png", root)),
    access(new URL("public/ryzhik-scene-v2.jpg", root)),
    access(new URL("public/zvezdochka-scene-v2.jpg", root)),
    ...["ryzhik", "zvezdochka"].flatMap((animal) => [1, 2, 3, 4].map((frame) =>
      access(new URL(`public/${animal}-eat-${frame}.jpg`, root)),
    )),
  ]);
});
