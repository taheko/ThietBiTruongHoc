from typing import Any


TEST_RESULTS: dict[str, dict[str, Any]] = {}


def run_test(
    test_id: str,
    expected_result: str,
    actual_result: str,
) -> dict[str, Any]:
    """
    So sánh Expected Result với Actual Result.
    Không tự tạo Actual Result.
    """

    if not test_id:
        return {
            "success": False,
            "error": "test_id is required",
        }

    if actual_result is None:
        status = "NOT EXECUTED"
    elif actual_result.strip() == "":
        status = "NOT EXECUTED"
    elif actual_result.strip().lower() == expected_result.strip().lower():
        status = "PASS"
    else:
        status = "FAIL"

    result = {
        "test_id": test_id,
        "expected": expected_result,
        "actual": actual_result,
        "status": status,
    }

    TEST_RESULTS[test_id] = result

    return result


def run_api_test(
    test_id: str,
    method: str,
    endpoint: str,
    expected_status: int,
    actual_status: int | None = None,
    expected_body: str | None = None,
    actual_body: str | None = None,
) -> dict[str, Any]:
    """
    Phân tích kết quả API test đã được cung cấp.

    Tool này chưa tự gọi HTTP.
    actual_status và actual_body phải đến từ hệ thống test/API.
    """

    if actual_status is None:
        result = {
            "test_id": test_id,
            "method": method,
            "endpoint": endpoint,
            "expected_status": expected_status,
            "actual_status": None,
            "status": "NOT EXECUTED",
        }

        TEST_RESULTS[test_id] = result

        return result

    status = "PASS"

    if actual_status != expected_status:
        status = "FAIL"

    if expected_body is not None and actual_body is not None:
        if expected_body not in actual_body:
            status = "FAIL"

    result = {
        "test_id": test_id,
        "method": method,
        "endpoint": endpoint,
        "expected_status": expected_status,
        "actual_status": actual_status,
        "expected_body": expected_body,
        "actual_body": actual_body,
        "status": status,
    }

    TEST_RESULTS[test_id] = result

    return result


def get_test_result(test_id: str | None = None):
    """
    Lấy kết quả test đã thực hiện.
    """

    if test_id:
        return TEST_RESULTS.get(test_id)

    return list(TEST_RESULTS.values())