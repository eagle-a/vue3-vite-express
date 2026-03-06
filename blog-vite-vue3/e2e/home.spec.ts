import { test, expect } from '@playwright/test'

test('home page loads correctly', async ({ page }) => {
  await page.goto('/')

  // Check if the page title is correct
  await expect(page).toHaveTitle(/湛明博客/)

  // Check if the navbar is present
  await expect(page.locator('.navbar')).toBeVisible()

  // Check if the main content area is present
  await expect(page.locator('.app-view')).toBeVisible()

  // Check if the back to top button is present (but not visible initially)
  const backToTopButton = page.locator('.back-to-top')
  await expect(backToTopButton).toBeVisible({ visible: false })

  // Scroll down to make the back to top button visible
  await page.mouse.wheel(0, 1000)
  await expect(backToTopButton).toBeVisible()

  // Click the back to top button
  await backToTopButton.click()

  // Verify we're back at the top of the page
  const scrollPosition = await page.evaluate(() => window.scrollY)
  expect(scrollPosition).toBeLessThan(100)
})
