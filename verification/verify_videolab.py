from playwright.sync_api import Page, expect, sync_playwright
import os

def test_videolab(page: Page):
    print("Navigating to Video Lab...")
    page.goto("http://localhost:3000/ja/tools/video")

    print("Checking for title...")
    expect(page.get_by_role("heading", name="動画ラボ")).to_be_visible(timeout=30000)

    print("Taking initial screenshot...")
    page.screenshot(path="verification/videolab_initial.png")

    # We can't easily upload a real video and convert it without a valid FFmpeg loading from CDN
    # and a real video file, which might be too large or complex for this environment.
    # So we will verify the UI elements are present in the initial state.

    # Check Dropzone is visible
    expect(page.get_by_text("ここに動画をドロップ")).to_be_visible()

    # Create dummy MP4 file (0 bytes is fine for UI test, dropzone might accept it)
    dummy_path = os.path.abspath("verification/test.mp4")
    with open(dummy_path, "wb") as f:
        f.write(b"dummy video content")

    print(f"Uploading file: {dummy_path}")
    page.set_input_files("input[type='file']", dummy_path)

    # Check if editor appears (should show file name)
    print("Waiting for editor...")
    expect(page.get_by_text("test.mp4")).to_be_visible(timeout=10000)

    # Check controls
    expect(page.get_by_text("出力フォーマット")).to_be_visible()

    print("Taking editor screenshot...")
    page.screenshot(path="verification/videolab_editor.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_videolab(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
