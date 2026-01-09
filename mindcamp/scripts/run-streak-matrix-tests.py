import json
import os
import sys
import time
from http.cookiejar import CookieJar
from urllib.parse import urlencode
from urllib.request import Request, build_opener, HTTPCookieProcessor
from urllib.error import HTTPError

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000").rstrip("/")
EMAIL = os.environ.get("TEST_EMAIL")
PASSWORD = os.environ.get("TEST_PASSWORD")

if not EMAIL or not PASSWORD:
    print("Missing TEST_EMAIL or TEST_PASSWORD env vars")
    sys.exit(2)

jar = CookieJar()
opener = build_opener(HTTPCookieProcessor(jar))


def request_json(method, path, data=None, headers=None):
    url = f"{BASE_URL}{path}"
    body = None
    final_headers = {"Accept": "application/json"}
    if headers:
        final_headers.update(headers)
    if data is not None:
        if final_headers.get("Content-Type") == "application/x-www-form-urlencoded":
            body = urlencode(data).encode("utf-8")
        else:
            final_headers.setdefault("Content-Type", "application/json")
            body = json.dumps(data).encode("utf-8")
    req = Request(url, data=body, headers=final_headers, method=method)
    try:
        resp = opener.open(req)
        content = resp.read()
        if not content:
            return {}, resp.status
        return json.loads(content.decode("utf-8")), resp.status
    except HTTPError as error:
        content = error.read()
        if not content:
            return {}, error.code
        try:
            return json.loads(content.decode("utf-8")), error.code
        except json.JSONDecodeError:
            return {}, error.code


def wait_for_server(timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            _, status = request_json("GET", "/api/auth/csrf")
            if status == 200:
                return True
        except Exception:
            time.sleep(1)
    return False


def ensure_test_user():
    data, status = request_json(
        "POST",
        "/api/auth/signup",
        data={"email": EMAIL, "password": PASSWORD, "name": "Rank Test"},
    )
    if status in (200, 201):
        return True
    if status == 409:
        return True
    print("Signup failed", data)
    return False


def login():
    csrf, status = request_json("GET", "/api/auth/csrf")
    if status != 200 or "csrfToken" not in csrf:
        print("Failed to get CSRF token")
        return False

    form = {
        "csrfToken": csrf["csrfToken"],
        "email": EMAIL,
        "password": PASSWORD,
        "callbackUrl": f"{BASE_URL}/today",
        "json": "true",
    }
    _, status = request_json(
        "POST",
        "/api/auth/callback/credentials",
        data=form,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    if status not in (200, 302):
        print("Login failed")
        return False
    session, _ = request_json("GET", "/api/auth/session")
    return bool(session.get("user"))


def reset_user():
    data, status = request_json("POST", "/api/debug/reset-user")
    if status != 200 or not data.get("success"):
        print("Reset failed", data)
        return False
    return True


def expected_rank(streak):
    if streak >= 64:
        return "master"
    if streak >= 57:
        return "finalweek"
    if streak >= 31:
        return "veteran"
    if streak >= 15:
        return "regular"
    if streak >= 4:
        return "member"
    return "guest"


def expected_next_rank_info(streak):
    if streak >= 64:
        return None
    if streak >= 57:
        return {"nextRank": "Master", "daysNeeded": 64 - streak}
    if streak >= 31:
        return {"nextRank": "Final Week", "daysNeeded": 57 - streak}
    if streak >= 15:
        return {"nextRank": "Veteran", "daysNeeded": 31 - streak}
    if streak >= 4:
        return {"nextRank": "Regular", "daysNeeded": 15 - streak}
    return {"nextRank": "Member", "daysNeeded": 4 - streak}


def run_tests():
    failures = 0
    for streak in range(0, 65):
        sim, status = request_json("POST", "/api/debug/simulate-streak", data={"streak": streak})
        if status != 200 or not sim.get("success"):
            print(f"FAIL simulate-streak {streak}")
            failures += 1
            continue

        progress, status = request_json("GET", "/api/progress")
        if status != 200:
            print(f"FAIL progress fetch for streak {streak}")
            failures += 1
            continue

        exp_rank = expected_rank(streak)
        exp_next = expected_next_rank_info(streak)

        if progress.get("streakCount") != streak:
            print(f"FAIL streakCount for streak {streak}: got {progress.get('streakCount')}")
            failures += 1
        if progress.get("currentRank") != exp_rank:
            print(f"FAIL rank for streak {streak}: got {progress.get('currentRank')} expected {exp_rank}")
            failures += 1
        if progress.get("totalCompletedDays") != streak:
            print(f"FAIL totalCompletedDays for streak {streak}: got {progress.get('totalCompletedDays')}")
            failures += 1
        if progress.get("currentDay") != streak:
            print(f"FAIL currentDay for streak {streak}: got {progress.get('currentDay')}")
            failures += 1
        if exp_next is None:
            if progress.get("nextRankInfo") is not None:
                print(f"FAIL nextRankInfo for streak {streak}: expected null")
                failures += 1
        else:
            next_info = progress.get("nextRankInfo") or {}
            if next_info.get("nextRank") != exp_next["nextRank"] or next_info.get("daysNeeded") != exp_next["daysNeeded"]:
                print(f"FAIL nextRankInfo for streak {streak}: got {next_info} expected {exp_next}")
                failures += 1

    return failures


def run_grace_test():
    failures = 0
    # Create a gap: entries for today and two days ago, skip yesterday.
    sim, status = request_json(
        "POST",
        "/api/debug/simulate-streak",
        data={"streak": 3, "skipOffsets": [1]},
    )
    if status != 200 or not sim.get("success"):
        print("FAIL simulate-streak gap")
        return 1

    progress, status = request_json("GET", "/api/progress")
    if status != 200:
        print("FAIL progress fetch for grace test (pre)")
        return 1

    if progress.get("streakCount") != 1:
        print("FAIL grace pre-check streakCount", progress.get("streakCount"))
        failures += 1

    yesterday = time.strftime("%Y-%m-%d", time.gmtime(time.time() - 86400))
    _, status = request_json("POST", "/api/progress", data={"date": yesterday})
    if status != 200:
        print("FAIL grace token apply")
        failures += 1

    progress, status = request_json("GET", "/api/progress")
    if status != 200:
        print("FAIL progress fetch for grace test (post)")
        return failures + 1

    if progress.get("streakCount") != 3:
        print("FAIL grace post-check streakCount", progress.get("streakCount"))
        failures += 1
    if progress.get("currentRank") != "guest":
        print("FAIL grace post-check rank", progress.get("currentRank"))
        failures += 1
    if progress.get("totalCompletedDays") != 2:
        print("FAIL grace post-check totalCompletedDays", progress.get("totalCompletedDays"))
        failures += 1

    return failures


def main():
    if not wait_for_server():
        print("Server did not start")
        sys.exit(1)

    if not ensure_test_user():
        sys.exit(1)

    if not login():
        print("Login failed")
        sys.exit(1)

    if not reset_user():
        print("Reset user failed")
        sys.exit(1)

    failures = run_tests()
    failures += run_grace_test()
    if failures:
        print(f"\nMechanics tests failed: {failures}")
        sys.exit(1)
    print("Mechanics tests passed (streak 0-64).")


if __name__ == "__main__":
    main()
