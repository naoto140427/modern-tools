from playwright.sync_api import Page, expect, sync_playwright
import os

def test_adaptive_ui(page: Page):
    # Test Desktop (Floating Dock)
    print("Testing Desktop View...")
    page.set_viewport_size({"width": 1280, "height": 800})
    page.goto("http://localhost:3004/ja")

    # Dock should be visible
    # We look for the Floating Dock container
    expect(page.locator(".fixed.bottom-6")).to_be_visible()

    # Command Palette Test
    print("Testing Command Palette...")
    page.keyboard.press("Control+k") # Meta might not work in headless
    expect(page.get_by_placeholder("Type a command or search...")).to_be_visible()
    # Close it
    page.keyboard.press("Escape")

    # Test Mobile (Bottom Tab Bar)
    print("Testing Mobile View...")
    page.set_viewport_size({"width": 375, "height": 812})

    # Bottom Tab Bar should be visible (lg:hidden)
    expect(page.locator(".fixed.bottom-0")).to_be_visible()

    # Drawer / Shelf Test
    print("Testing Mobile Shelf Drawer...")
    # Click Shelf button (middle button in bottom bar)
    # It has text "Shelf" - target specifically inside bottom bar to avoid ambiguity with hidden dock
    page.locator(".fixed.bottom-0").get_by_text("Shelf").click()

    # Check for drawer content "Global File Shelf"
    expect(page.get_by_text("Global File Shelf")).to_be_visible()

    print("Taking mobile screenshot...")
    page.screenshot(path="verification/mobile_ui.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_adaptive_ui(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
