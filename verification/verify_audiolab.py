from playwright.sync_api import Page, expect, sync_playwright
import os

def test_audiolab(page: Page):
    print("Navigating to Audio Lab...")
    page.goto("http://localhost:3001/ja/tools/audio")

    print("Checking for title...")
    expect(page.get_by_role("heading", name="オーディオラボ")).to_be_visible(timeout=30000)

    print("Taking initial screenshot...")
    page.screenshot(path="verification/audiolab_initial.png")

    # Check Dropzone is visible
    expect(page.get_by_text("ここに音声をドロップ")).to_be_visible()

    # Create dummy MP3 file
    dummy_path = os.path.abspath("verification/test.mp3")
    with open(dummy_path, "wb") as f:
        f.write(b"dummy audio content")

    print(f"Uploading file: {dummy_path}")
    page.set_input_files("input[type='file']", dummy_path)

    # Check if editor appears (should show file name)
    print("Waiting for editor...")
    expect(page.get_by_text("test.mp3")).to_be_visible(timeout=10000)

    # Check controls
    expect(page.get_by_text("出力フォーマット")).to_be_visible()
    expect(page.get_by_role("button", name="変換を開始")).to_be_visible()

    print("Taking editor screenshot...")
    page.screenshot(path="verification/audiolab_editor.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_audiolab(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
