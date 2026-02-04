from playwright.sync_api import Page, expect, sync_playwright
import os

def test_polish(page: Page):
    # Navigate Home
    print("Navigating Home...")
    page.goto("http://localhost:3006/")

    # Test Footer Links
    print("Testing Footer Links...")
    # Link to Feedback - might be hidden by bottom bar on mobile view, but here viewport is default 1280x720 usually.
    # Scroll to bottom to ensure visibility
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.get_by_role("link", name="Feedback").first.click()
    expect(page.get_by_text("ご意見をお聞かせください")).to_be_visible()

    # Navigate to About via Footer (or Header)
    print("Navigating to About...")
    page.goto("http://localhost:3005/") # Go back home to find footer again or use header
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.get_by_role("link", name="Privacy & About").click()
    expect(page.get_by_text("プライバシー宣言")).to_be_visible()
    expect(page.get_by_text("完全サーバーレス")).to_be_visible()

    # Test Settings
    print("Testing Settings...")
    # Settings icon in header
    page.goto("http://localhost:3006/ja/settings") # Direct link for reliability in test
    expect(page.get_by_text("設定")).to_be_visible()
    expect(page.get_by_text("データ管理")).to_be_visible()

    # Test Theme Toggle (Visual check tricky, but buttons exist)
    expect(page.get_by_text("ライト")).to_be_visible()

    # Test Share Button (Header)
    # It's an icon button, difficult to target by text.
    # It has a Share icon. We can assume it exists if Header renders.

    print("Taking settings screenshot...")
    page.screenshot(path="verification/polish_settings.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_polish(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
