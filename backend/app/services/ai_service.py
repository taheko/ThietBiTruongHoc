import os
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.ai.tools import AVAILABLE_TOOLS


load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "Không tìm thấy GEMINI_API_KEY trong file .env"
    )


client = genai.Client(
    api_key=api_key
)


SYSTEM_PROMPT = """
Bạn là AI Testing Agent cho hệ thống quản lý tài sản trường học.

Nhiệm vụ của bạn là phân tích yêu cầu kiểm thử, tạo Test Case,
thực thi test thông qua Tool được cung cấp và phân tích kết quả.

CÁC TOOL KIỂM THỬ:

1. run_test
Dùng để chạy test backend bằng pytest.

Khi người dùng yêu cầu:
- chạy test backend
- chạy pytest
- kiểm tra test backend
- regression test
- chạy một test file

phải sử dụng run_test.

Ví dụ:
run_test("tests/test_backend.py")

Nếu người dùng yêu cầu chạy toàn bộ test backend,
có thể gọi run_test().

2. run_api_test
Dùng để kiểm thử API backend.

Khi người dùng yêu cầu:
- kiểm thử API
- gọi API để kiểm tra
- test endpoint
- kiểm tra HTTP API

phải sử dụng run_api_test.

Tool nhận:
- method
- url
- expected_status
- json_data nếu cần
- headers nếu cần

3. get_test_result
Dùng để lấy lại kết quả của một lần test
khi đã có test_id.

Không tự tạo test_id.

QUY TẮC KIỂM THỬ:

1. Không được tự tạo kết quả test.

2. Nếu chưa thực thi test:
   status phải là NOT EXECUTED.

3. Không được nói PASS hoặc FAIL nếu chưa có
   kết quả thực thi từ Tool.

4. Với backend test:
   phải sử dụng run_test.

5. Với API test:
   phải sử dụng run_api_test.

6. Nếu Tool trả về test_id và người dùng yêu cầu
   xem lại kết quả test, sử dụng get_test_result.

7. Khi phân tích FAIL phải dựa trên:
   - Expected Result
   - Actual Result
   - Error
   - stdout
   - stderr
   - HTTP status nếu là API test.

8. Không được tự tạo số liệu tài sản.

9. Không được tự tạo dữ liệu database.

10. Không được tự sửa database.

11. Không được tự sửa source code.

12. Nếu test file không tồn tại hoặc không thể thực thi,
    kết quả phải được trình bày là NOT EXECUTED.

13. Nếu pytest chạy và có test thất bại,
    kết quả là FAIL.

14. Nếu pytest chạy và tất cả test thành công,
    kết quả là PASS.

15. HTTP 200 không tự động có nghĩa là API đúng.
    Nếu có response body, cần phân tích nội dung response
    khi yêu cầu kiểm thử yêu cầu kiểm tra nội dung.

KHI NGƯỜI DÙNG YÊU CẦU TẠO TEST CASE:

- Phân tích requirement.
- Xác định Test Scenario.
- Tạo Test Case.
- Xác định Test Data.
- Xác định Expected Result.
- Nếu chưa thực thi thì ghi NOT EXECUTED.

KHI NGƯỜI DÙNG YÊU CẦU CHẠY TEST:

- Không chỉ mô tả cách chạy.
- Phải sử dụng Tool thích hợp.
- Trả về kết quả thực tế từ Tool.

KHI NGƯỜI DÙNG YÊU CẦU PHÂN TÍCH KẾT QUẢ:

- Nếu có test_id, sử dụng get_test_result.
- Không tự đoán kết quả.

KẾT QUẢ CUỐI CÙNG NÊN CÓ:

- Test ID.
- Test name.
- Status.
- Expected.
- Actual.
- Error nếu có.
- Evidence nếu có.
- Nhận xét.

Status hợp lệ:

PASS
FAIL
NOT EXECUTED
"""


def _build_tool_map():
    return {
        tool.__name__: tool
        for tool in AVAILABLE_TOOLS
    }


def _convert_tool_result(result):
    """
    Chuyển kết quả Python thành dữ liệu mà Gemini có thể nhận.
    """

    if isinstance(result, str):
        return result

    try:
        return json.dumps(
            result,
            ensure_ascii=False,
            default=str,
        )
    except Exception:
        return str(result)


def ask_ai(message: str):

    tool_map = _build_tool_map()

    chat = client.chats.create(
        model="gemini-3-flash-preview",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            tools=AVAILABLE_TOOLS,
        ),
    )

    response = chat.send_message(message)

    max_tool_calls = 10
    tool_call_count = 0

    while tool_call_count < max_tool_calls:

        function_calls = getattr(
            response,
            "function_calls",
            None,
        )

        if not function_calls:
            return response.text

        tool_responses = []

        for function_call in function_calls:

            tool_name = function_call.name
            tool_args = dict(function_call.args or {})

            tool = tool_map.get(tool_name)

            if tool is None:
                tool_result = {
                    "status": "NOT EXECUTED",
                    "error": f"Tool không tồn tại: {tool_name}",
                }

            else:
                try:
                    tool_result = tool(**tool_args)

                except Exception as e:
                    tool_result = {
                        "status": "NOT EXECUTED",
                        "error": str(e),
                    }

            tool_responses.append(
                types.Part.from_function_response(
                    name=tool_name,
                    response={
                        "result": tool_result,
                    },
                )
            )

        tool_call_count += len(function_calls)

        response = chat.send_message(
            tool_responses
        )

    return (
        "NOT EXECUTED: AI vượt quá giới hạn số lần gọi Tool."
    )