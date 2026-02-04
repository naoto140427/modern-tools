from playwright.sync_api import Page, expect, sync_playwright

def test_ailab(page: Page):
    print("Navigating to AI Lab...")
    page.goto("http://localhost:3000/ja/tools/ai")

    print("Checking for title...")
    expect(page.get_by_role("heading", name="AI Magic")).to_be_visible(timeout=30000)

    # Check if dashboard card exists
    print("Checking Dashboard link...")
    page.goto("http://localhost:3000/ja")
    expect(page.get_by_role("link", name="Lumina AI Magic")).to_be_visible()

    print("Taking screenshot...")
    page.screenshot(path="verification/ailab_ui.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_ailab(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
