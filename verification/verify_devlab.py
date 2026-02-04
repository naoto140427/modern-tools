from playwright.sync_api import Page, expect, sync_playwright
import os

def test_devlab(page: Page):
    print("Navigating to Dev Lab...")
    page.goto("http://localhost:3003/ja/tools/dev")

    print("Checking for title...")
    expect(page.get_by_role("heading", name="デブラボ")).to_be_visible(timeout=30000)

    print("Taking initial screenshot...")
    page.screenshot(path="verification/devlab_initial.png")

    # Check Tabs - use roles to avoid strict mode issues with description text
    expect(page.get_by_role("button", name="JSON")).to_be_visible()
    expect(page.get_by_role("button", name="Base64")).to_be_visible()
    expect(page.get_by_role("button", name="Password")).to_be_visible()

    # JSON Mode
    print("Entering JSON...")
    # Select the first textarea found, likely the Input one
    page.locator("textarea").first.fill('{"a":1}')
    page.get_by_role("button", name="整形 (Pretty Print)").click()

    expect(page.get_by_text("有効なJSONです")).to_be_visible()
    # Output should contain formatted JSON
    expect(page.get_by_text('"a": 1')).to_be_visible()

    print("Taking JSON screenshot...")
    page.screenshot(path="verification/devlab_json.png")

    # Password Mode
    print("Switching to Password...")
    page.get_by_role("button", name="Password").click()
    page.get_by_role("button", name="生成").click()

    # Check if output is not empty (length > 0)
    # Since we can't easily check text content length in selector, just check if Copy button appears which shows on output
    expect(page.get_by_role("button", name="Copy")).to_be_visible()

    print("Taking password screenshot...")
    page.screenshot(path="verification/devlab_password.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_devlab(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
