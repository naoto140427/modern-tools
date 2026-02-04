from playwright.sync_api import Page, expect, sync_playwright
import os

def test_blog_flow(page: Page):
    # 1. Arrange: Go to the Blog list page.
    print("Navigating to /ja/blog")
    page.goto("http://localhost:3000/ja/blog")

    # 2. Act & Assert List Page
    print("Checking list page...")
    expect(page.get_by_role("heading", name="Lumina Blog")).to_be_visible()

    # Check for the card
    card_title = page.get_by_text("Image Labの使い方ガイド")
    expect(card_title).to_be_visible()

    # Click it
    print("Clicking article...")
    card_title.click()

    # 3. Assert Detail Page
    print("Checking detail page...")
    expect(page.get_by_role("heading", name="Image Labの使い方ガイド")).to_be_visible()
    expect(page.get_by_text("Image Labへようこそ")).to_be_visible()

    # 4. Screenshot
    print("Taking screenshot...")
    # Use relative path
    page.screenshot(path="verification/blog_detail.png")
    print("Done.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_blog_flow(page)
        finally:
            browser.close()
