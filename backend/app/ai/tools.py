from app.tools.asset_tools import (
    get_assets,
    get_asset_status_summary,
    get_assets_needing_action,
    get_repair_history,
    get_inventory_report_data,
)

from app.tools.test_tools import (
    run_test,
    get_test_result,
    run_api_test,
)


AVAILABLE_TOOLS = [
    get_assets,
    get_asset_status_summary,
    get_assets_needing_action,
    get_repair_history,
    get_inventory_report_data,
    run_test,
    get_test_result,
    run_api_test,
]