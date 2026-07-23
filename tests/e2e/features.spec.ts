import { expect, test } from "@playwright/test";

const mobileWidths = [320, 375, 390, 430];

test("fixture odds comparison identifies Demo Data and best odds", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Compare Odds" }).click();
  await expect(page.getByText("Demo Data")).toBeVisible();
  await expect(page.getByText("Anthony Edwards Over 28.5 Points")).toBeVisible();
  await expect(page.getByText("Best available")).toBeVisible();
  await expect(page.getByText("Stale", { exact: true })).toBeVisible();
  await expect(page.getByText("Odds change. Results are not guaranteed. Taxes not included. Sports betting involves risk.")).toBeVisible();
});

test("calculator updates negative and positive odds", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Profit Calculator" }).click();
  await page.getByLabel("Wager Amount").fill("100");
  await page.getByLabel("American Odds").fill("+150");
  await page.getByLabel("Expected Win %").fill("45");
  await page.getByLabel("Number of Bets").fill("20");
  await expect(page.getByText("$150.00", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "-110", exact: true }).click();
  await expect(page.getByText("52.38%", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Every Bet Wins" }).click();
  await expect(page.getByText(/Hypothetical only/)).toBeVisible();
});

for (const width of mobileWidths) {
  test(`features do not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const tab of ["Compare Odds", "Profit Calculator"]) {
      await page.getByRole("tab", { name: tab }).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
    }
  });
}
