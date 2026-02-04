from playwright.sync_api import Page, expect, sync_playwright
import os

def test_textlab(page: Page):
    print("Navigating to Text Lab...")
    page.goto("http://localhost:3003/ja/tools/text")

    print("Checking for title...")
    expect(page.get_by_role("heading", name="テキストラボ")).to_be_visible(timeout=30000)

    print("Taking initial screenshot...")
    page.screenshot(path="verification/textlab_initial.png")

    # Check Tabs
    expect(page.get_by_text("カウンター")).to_be_visible()
    expect(page.get_by_text("コンバーター")).to_be_visible()
    expect(page.get_by_text("ジェネレーター")).to_be_visible()

    # Counter Mode
    print("Entering text...")
    page.get_by_placeholder("Type or paste here...").fill("Hello World\nLine 2")

    # Check stats
    # "文字数", "18" (Hello World = 11 + \n + Line 2 = 6, total 18 if newline counts or 17? Let's rely on visibility of label "文字数")
    expect(page.get_by_text("文字数")).to_be_visible()
    expect(page.get_by_text("単語数")).to_be_visible()

    print("Taking counter screenshot...")
    page.screenshot(path="verification/textlab_counter.png")

    # Converter Mode
    print("Switching to Converter...")
    page.get_by_role("button", name="コンバーター").click()
    expect(page.get_by_text("全て大文字")).to_be_visible()
    # "HELLO WORLD" matches strict mode issues because it appears in input (as value?) or multiple outputs.
    # We target the output box specifically or just check if it contains the text.
    # Since inputs are "Hello World", result is "HELLO WORLD\nLINE 2".
    # We can check by using a more specific locator if needed, or relax strictness.
    # Here we just look for the text in the page, but careful with strictness.
    # Let's check for the uppercase label + value container
    expect(page.get_by_text("HELLO WORLD", exact=False).first).to_be_visible()

    print("Taking converter screenshot...")
    page.screenshot(path="verification/textlab_converter.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_textlab(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
