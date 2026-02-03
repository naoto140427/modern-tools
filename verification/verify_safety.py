from playwright.sync_api import Page, expect, sync_playwright
import os

def test_safety(page: Page):
    # Test 404
    print("Testing 404 Page...")
    page.goto("http://localhost:3007/ja/this-page-does-not-exist-12345")

    # Check for 404 title
    expect(page.get_by_role("heading", name="404 - Lost in Space")).to_be_visible(timeout=30000)

    # Check for Return button
    expect(page.get_by_role("link", name="ミッションコントロールへ帰還")).to_be_visible()

    # Visual Check
    print("Taking 404 screenshot...")
    page.screenshot(path="verification/safety_404.png")

    # Offline Indicator Test
    # This is tricky in Playwright without network emulation in context, but we can try setting offline.
    # Note: `context.setOffline(true)` is needed, usually available on browser context.
    # In this simple script, `page.context` should work.

    print("Testing Offline Indicator...")
    page.context.set_offline(True)

    # Expect Indicator to appear
    # Message: "Offline Mode Active"
    expect(page.get_by_text("Offline Mode Active")).to_be_visible(timeout=5000)

    print("Taking offline screenshot...")
    page.screenshot(path="verification/safety_offline.png")

    # Restore online
    page.context.set_offline(False)
    # Indicator should disappear
    expect(page.get_by_text("Offline Mode Active")).to_be_hidden(timeout=5000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create context to enable offline testing
        context = browser.new_context()
        page = context.new_page()
        try:
            test_safety(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            context.close()
            browser.close()
