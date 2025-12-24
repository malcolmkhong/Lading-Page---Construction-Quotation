from playwright.sync_api import sync_playwright, expect

def verify_full_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Starting full flow verification...")

        try:
            # 1. Client Info Page
            page.goto("http://localhost:8080/quotation/client")
            page.wait_for_load_state("networkidle")

            print("Filling Client Info...")
            page.get_by_placeholder("Enter client name").fill("Alice Builder")
            page.get_by_placeholder("Enter project name").fill("Mega Structure")
            page.get_by_placeholder("client@example.com").fill("alice@example.com")
            page.get_by_placeholder("Project location").fill("456 Construction Rd")
            page.get_by_placeholder("Describe the construction project").fill("Building a new wing.")

            page.get_by_role("button", name="Continue to Line Items").click()

            # 2. Line Items Page
            page.wait_for_url("**/quotation/items")
            print("Navigated to Line Items.")

            # 3. Add Item
            page.get_by_role("button", name="Add Item").click()
            print("Item added.")

            # 4. Select Category "Masonry"
            row = page.locator("tbody tr").last
            category_trigger = row.locator("button[role='combobox']").nth(0)
            category_trigger.click()

            # Select "Masonry" from the dropdown
            page.get_by_role("option", name="Masonry").click()
            print("Category selected: Masonry")

            # 5. Use Inline Material Selector
            db_btn = page.get_by_role("button", name="Select from Material Database")
            expect(db_btn).to_be_visible()
            db_btn.click()
            print("Material Selector Dialog opened.")

            page.wait_for_timeout(500)

            # Select "Clay Bricks"
            search_input = page.get_by_placeholder("Search materials...")
            search_input.wait_for(state="visible", timeout=5000)
            search_input.fill("Clay Bricks")

            # Click Select
            page.locator("tr").filter(has_text="Clay Bricks").get_by_role("button", name="Select").click()
            print("Material selected: Clay Bricks")

            # 6. Verify fields populated
            # Clay Bricks: Price 0.85
            unit_price_input = row.locator("input[type='number']").nth(1)
            expect(unit_price_input).to_have_value("0.85")
            print("Unit price verified: 0.85")

            # Check Description
            description = row.locator("textarea")
            expect(description).to_contain_text("Standard clay bricks")
            print("Description verified.")

            # 7. Set Quantity and Check Math
            quantity_input = row.locator("input[type='number']").nth(0)
            quantity_input.fill("1000") # 1000 bricks

            # Row total should be 0.85 * 1000 = 850
            total_cell = row.locator("td").nth(-2)
            expect(total_cell).to_contain_text("850.00")
            print("Row total verified: 850.00")

            # Finish editing
            check_button = row.locator("td").last.locator("button").first
            check_button.click()

            # 8. Verify Tax/Discount Math
            # Subtotal: 850
            expect(page.get_by_text("Subtotal:").locator("..").last).to_contain_text("850.00")

            # Tax: 10%
            page.get_by_text("Tax Rate (%):").locator("..").locator("input").fill("10")

            # Tax Amount: 850 * 0.10 = 85.00
            expect(page.get_by_text("Tax Amount:").locator("..").last).to_contain_text("85.00")

            # Discount: 5%
            page.get_by_text("Discount (%):").locator("..").locator("input").fill("5")

            # Discount Amount: 850 * 0.05 = 42.50
            expect(page.get_by_text("Discount Amount:").locator("..").last).to_contain_text("42.50")

            # Total: 850 + 85 - 42.50 = 892.50
            total_line = page.get_by_text("Total:", exact=True).locator("..")
            expect(total_line.last).to_contain_text("892.50")
            print("Math verified: 892.50")

            # 9. Verify Export Page
            page.get_by_role("button", name="Continue to Export").click()
            page.wait_for_url("**/quotation/export")

            # Verify Total persists
            expect(page.get_by_text("TOTAL").locator("..").get_by_text("RM 892.50")).to_be_visible()
            print("Export page total verified.")

            page.screenshot(path="verification/full_flow_success.png")
            print("Verification successful! Screenshot saved.")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/full_flow_failure.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_full_flow()
