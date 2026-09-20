import requests
import subprocess
import sys
import uuid
from datetime import datetime
from pathlib import Path


TEST_RESULTS = {}


def run_test(test_path: str | None = None) -> dict:
    """
    Chạy test backend bằng pytest.

    Nếu test_path được cung cấp:
        Chạy test cụ thể.

    Nếu test_path không được cung cấp:
        Chạy toàn bộ thư mục tests.

    Status:
    - PASS: tất cả test pass
    - FAIL: có test fail hoặc pytest gặp lỗi
    - NOT EXECUTED: không thể thực thi test
    """

    test_id = str(uuid.uuid4())

    backend_dir = Path(__file__).resolve().parents[2]
    tests_dir = backend_dir / "tests"

    if not tests_dir.exists():
        result = {
            "test_id": test_id,
            "test_name": test_path or "all tests",
            "test_path": str(tests_dir),
            "status": "NOT EXECUTED",
            "exit_code": None,
            "stdout": "",
            "stderr": f"Tests directory not found: {tests_dir}",
            "executed_at": datetime.now().isoformat(),
        }

        TEST_RESULTS[test_id] = result
        return result

    if test_path:
        test_file = backend_dir / test_path

        if not test_file.exists():
            result = {
                "test_id": test_id,
                "test_name": test_path,
                "test_path": str(test_file),
                "status": "NOT EXECUTED",
                "exit_code": None,
                "stdout": "",
                "stderr": f"Test file not found: {test_file}",
                "executed_at": datetime.now().isoformat(),
            }

            TEST_RESULTS[test_id] = result
            return result

        target = str(test_file)
        test_name = test_path

    else:
        target = str(tests_dir)
        test_name = "all tests"

    try:
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "pytest",
                target,
                "-v",
            ],
            cwd=str(backend_dir),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )

        if result.returncode == 0:
            status = "PASS"
        else:
            status = "FAIL"

        test_result = {
            "test_id": test_id,
            "test_name": test_name,
            "test_path": target,
            "status": status,
            "exit_code": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "executed_at": datetime.now().isoformat(),
        }

        TEST_RESULTS[test_id] = test_result

        return test_result

    except Exception as e:
        test_result = {
            "test_id": test_id,
            "test_name": test_name,
            "test_path": target,
            "status": "NOT EXECUTED",
            "exit_code": None,
            "stdout": "",
            "stderr": str(e),
            "executed_at": datetime.now().isoformat(),
        }

        TEST_RESULTS[test_id] = test_result

        return test_result


def get_test_result(test_id: str) -> dict:
    """
    Lấy lại kết quả của một lần chạy test.
    """

    result = TEST_RESULTS.get(test_id)

    if result is None:
        return {
            "test_id": test_id,
            "status": "NOT EXECUTED",
            "error": "Không tìm thấy kết quả test.",
        }

    return result

def run_api_test(
    method: str,
    url: str,
    expected_status: int = 200,
    json_data: dict | None = None,
    headers: dict | None = None,
) -> dict:
    """
    Thực thi API test.

    Status:
    - PASS: HTTP status thực tế đúng expected_status
    - FAIL: API trả status khác expected_status
    - NOT EXECUTED: không thể gửi request
    """

    test_id = str(uuid.uuid4())

    try:
        method = method.upper()

        response = requests.request(
            method=method,
            url=url,
            json=json_data,
            headers=headers,
            timeout=10,
        )

        actual_status = response.status_code

        if actual_status == expected_status:
            status = "PASS"
        else:
            status = "FAIL"

        result = {
            "test_id": test_id,
            "test_name": f"{method} {url}",
            "test_type": "API",
            "method": method,
            "url": url,
            "expected_status": expected_status,
            "actual_status": actual_status,
            "status": status,
            "response": response.text,
            "executed_at": datetime.now().isoformat(),
        }

        TEST_RESULTS[test_id] = result

        return result

    except requests.RequestException as e:
        result = {
            "test_id": test_id,
            "test_name": f"{method} {url}",
            "test_type": "API",
            "method": method,
            "url": url,
            "expected_status": expected_status,
            "actual_status": None,
            "status": "NOT EXECUTED",
            "response": "",
            "error": str(e),
            "executed_at": datetime.now().isoformat(),
        }

        TEST_RESULTS[test_id] = result

        return result

    except Exception as e:
        result = {
            "test_id": test_id,
            "test_name": f"{method} {url}",
            "test_type": "API",
            "method": method,
            "url": url,
            "expected_status": expected_status,
            "actual_status": None,
            "status": "NOT EXECUTED",
            "response": "",
            "error": str(e),
            "executed_at": datetime.now().isoformat(),
        }

        TEST_RESULTS[test_id] = result

        return result