from playwright.sync_api import Page, expect, sync_playwright
import os
import base64

def create_dummy_png(filepath):
    # Minimal 1x1 PNG
    png_data = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==")
    with open(filepath, "wb") as f:
        f.write(png_data)

def test_imagelab(page: Page):
    print("Navigating to Image Lab...")
    page.goto("http://localhost:3000/ja/tools/image")

    print("Checking for title...")
    expect(page.get_by_role("heading", name="画像ラボ")).to_be_visible(timeout=30000)

    print("Taking initial screenshot...")
    page.screenshot(path="verification/imagelab_initial.png")

    # Create dummy PNG
    dummy_path = os.path.abspath("verification/test.png")
    create_dummy_png(dummy_path)

    print(f"Uploading file: {dummy_path}")
    page.set_input_files("input[type='file']", dummy_path)

    print("Waiting for editor...")
    # Look for "変換フォーマット" (Convert Format)
    expect(page.get_by_text("変換フォーマット")).to_be_visible(timeout=10000)

    # Wait for preview image to load (simple check)
    expect(page.locator("img[alt='Preview']")).to_be_visible()

    print("Taking editor screenshot...")
    page.screenshot(path="verification/imagelab_editor.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_imagelab(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
