import { expect, test, type Page } from "@playwright/test";

const mobileWidths = [320, 375, 390, 430];
const singleSlip = "Anthony Edwards Over 28.5 Points\nStake: $25\nOdds: -115";
const parlaySlip = "Lakers -4.5\nChiefs Moneyline\nStake: $40\nCombined Odds: +450";

async function analyze(page: Page, slip: string) {
  await page.getByLabel("Paste your bet slip").fill(slip);
  await page.getByRole("button", { name: "Analyze Bet" }).click();
  await expect(page.getByText("PREMIUM ACTIONS")).toBeVisible({ timeout: 5_000 });
}

test("Premium single-bet analysis populates both contextual tools", async ({ page }) => {
  await page.goto("/");
  await analyze(page, singleSlip);
  await page.getByRole("button", { name: /Compare Sportsbook Odds/ }).click();
  await expect(page.getByText("Anthony Edwards Over 28.5 Points").last()).toBeVisible();
  await expect(page.getByText("Payout comparison uses your $25.00 stake")).toBeVisible();
  await page.getByRole("button", { name: /Project Profit/ }).click();
  await expect(page.getByText("-115 · 1.87")).toBeVisible();
  await expect(page.getByText("$25.00", { exact: true }).first()).toBeVisible();
});

test("Premium parlay analysis uses combined odds and leg context", async ({ page }) => {
  await page.goto("/");
  await analyze(page, parlaySlip);
  await page.getByRole("button", { name: /Project Profit/ }).click();
  await expect(page.getByText("+450 · 5.50")).toBeVisible();
  await expect(page.getByText("2-Leg Parlay", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("2", { exact: true }).last()).toBeVisible();
  await page.getByRole("button", { name: /Compare Sportsbook Odds/ }).click();
  await expect(page.getByText("2-Leg Parlay", { exact: true }).last()).toBeVisible();
});

test("free account opens centralized upgrade flow and cannot execute tools", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/");
  await analyze(page, singleSlip);
  await page.getByRole("button", { name: /Compare Sportsbook Odds/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Compare Sportsbook Odds");
  await expect(page.getByText("Sportsbook Odds Comparison")).toHaveCount(0);
  await page.getByRole("button", { name: "Not now" }).click();
  await page.getByRole("button", { name: /Project Profit/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Project Profit");
  await expect(page.getByText("Betting Profit Calculator")).toHaveCount(0);
});

for (const width of mobileWidths) {
  test(`contextual tools do not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await analyze(page, singleSlip);
    for (const action of [/Compare Sportsbook Odds/, /Project Profit/]) {
      await page.getByRole("button", { name: action }).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    }
  });
}
