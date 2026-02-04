from playwright.sync_api import Page, expect, sync_playwright

def test_landing_hero(page: Page):
    print("Navigating to Home...")
    page.goto("http://localhost:3000/ja")

    print("Checking for Hero text...")
    expect(page.get_by_text("Your Creative Studio. In the Browser.")).to_be_visible()

    print("Checking for Dashboard Grid...")
    expect(page.get_by_text("Lumina Image Lab")).to_be_visible()

    print("Taking screenshot...")
    page.screenshot(path="verification/landing_hero.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_landing_hero(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
