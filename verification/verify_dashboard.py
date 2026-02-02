from playwright.sync_api import Page, expect, sync_playwright

def test_dashboard_ui(page: Page):
    print("Navigating to Dashboard...")
    page.goto("http://localhost:3000/ja")

    print("Checking for dashboard grid...")
    # Check for Image Lab card
    expect(page.get_by_role("link", name="Lumina Image Lab")).to_be_visible()
    expect(page.get_by_text("画像の変換・圧縮・編集")).to_be_visible()

    # Check for Video Lab card
    expect(page.get_by_role("link", name="Lumina Video Lab")).to_be_visible()
    expect(page.get_by_text("動画のフォーマット変換・処理")).to_be_visible()

    print("Taking dashboard screenshot...")
    page.screenshot(path="verification/dashboard_refresh.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_dashboard_ui(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
