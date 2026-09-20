
from app.skills.asset_query import asset_query
from app.skills.inventory_analysis import inventory_analysis
from app.skills.asset_condition import asset_condition
from app.skills.repair_replacement import repair_replacement
from app.skills.inventory_report import get_inventory_report_data


print("================================")
print("TEST ASSET QUERY")
print("================================")

result = asset_query()

print("Tổng tài sản:", result["total"])


print("\n================================")
print("TEST INVENTORY ANALYSIS")
print("================================")

result = inventory_analysis()

print(result)


print("\n================================")
print("TEST ASSET CONDITION")
print("================================")

result = asset_condition()

print(result["by_status"])


print("\n================================")
print("TEST REPAIR & REPLACEMENT")
print("================================")

result = repair_replacement()

print("Số tài sản cần xử lý:", len(result))


print("\n================================")
print("TEST INVENTORY REPORT")
print("================================")

result = get_inventory_report_data()

print("Tổng:", result["total"])
print("Thiếu:", len(result["missing"]))
print("Hỏng:", len(result["broken"]))
print("Đang sửa:", len(result["repairing"]))

