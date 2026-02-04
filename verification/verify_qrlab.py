from playwright.sync_api import Page, expect, sync_playwright
import os

def test_qrlab(page: Page):
    print("Navigating to QR Lab...")
    page.goto("http://localhost:3002/ja/tools/qr")

    print("Checking for title...")
    expect(page.get_by_role("heading", name="QRマスター")).to_be_visible(timeout=30000)

    print("Taking initial screenshot...")
    page.screenshot(path="verification/qrlab_initial.png")

    # Check Controls
    expect(page.get_by_text("Content")).to_be_visible()
    expect(page.get_by_text("コードの色")).to_be_visible()
    expect(page.get_by_text("背景色")).to_be_visible()
    # "ロゴを追加" matches both label and button, so we make it specific
    expect(page.get_by_role("button", name="ロゴを追加")).to_be_visible()

    # Enter Text
    print("Entering text...")
    page.get_by_placeholder("URLまたはテキストを入力...").fill("https://lumina.studio/qrmaster")

    # Check if QR Code updates (we can't easily check canvas content, but we can check if SVG exists)
    # The component uses QRCodeSVG
    # We target the SVG that has the role="img" which qrcode.react sets
    expect(page.locator("svg[role='img']")).to_be_visible()

    print("Taking active screenshot...")
    page.screenshot(path="verification/qrlab_active.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_qrlab(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
