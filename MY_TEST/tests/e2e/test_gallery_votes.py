import os
from pathlib import Path

import pytest


BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "adminpass")
FIXTURE_PATH = Path(__file__).parent / "fixtures" / "sample.txt"


@pytest.mark.e2e
def test_gallery_like_dislike_toggle(page):
    page.goto(f"{BASE_URL}/admin/login", wait_until="networkidle")

    page.get_by_label("Почта").fill(ADMIN_EMAIL)
    page.get_by_label("Пароль").fill(ADMIN_PASSWORD)
    page.get_by_role("button", name="Войти").click()

    page.get_by_text("Админка").wait_for()

    page.set_input_files("input[type=\"file\"]", str(FIXTURE_PATH))
    page.get_by_text("sample.txt").first.wait_for()

    response = page.request.get(f"{BASE_URL}/api/files")
    response.raise_for_status()
    items = response.json().get("items", [])
    match = next((item for item in items if item.get("originalName") == "sample.txt"), None)
    assert match, "Uploaded file not found in /api/files"
    file_id = match.get("id")

    page.goto(f"{BASE_URL}/gallery", wait_until="networkidle")

    like_button = page.get_by_test_id(f"like-{file_id}")
    dislike_button = page.get_by_test_id(f"dislike-{file_id}")

    like_button.click()
    expect_like = like_button.get_by_text("1")
    expect_like.wait_for()

    dislike_button.click()
    dislike_button.get_by_text("1").wait_for()
    like_button.get_by_text("0").wait_for()

    dislike_button.click()
    dislike_button.get_by_text("0").wait_for()
