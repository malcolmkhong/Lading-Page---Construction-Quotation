from playwright.sync_api import sync_playwright

def verify_quotation_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 1. Start at Client Info
            page.goto("http://localhost:8080/quotation/client")
            page.wait_for_load_state("networkidle")

            # Verify we are on the client page
            if not page.get_by_role("heading", name="Client & Project Information").is_visible():
                print("Failed to load Client Information page")
                return

            # Fill in the form
            page.get_by_placeholder("Enter client name").fill("John Doe")
            page.get_by_placeholder("client@example.com").fill("john@example.com")
            page.get_by_placeholder("Enter project name").fill("Kitchen Renovation")
            page.get_by_placeholder("Project location").fill("123 Main St")
            page.get_by_placeholder("Describe the construction project").fill("Full kitchen renovation including cabinets and flooring.")

            # Submit form
            page.get_by_role("button", name="Continue to Line Items").click()

            # 2. Verify we are on Line Items page
            page.wait_for_url("**/quotation/items")
            page.wait_for_load_state("networkidle")

            # Use a more specific selector
            if not page.get_by_role("heading", name="Line Items").is_visible():
                print("Failed to navigate to Line Items page")
                return

            # Add an item
            page.get_by_role("button", name="Add Item").click()

            # Edit the item
            # We will use simple inputs as selectors based on their type/placeholder
            page.get_by_placeholder("Enter description").fill("Kitchen Cabinets")

            # Quantity input (first number input in the row)
            # The structure is TableRow -> TableCell -> Input
            # We can find the input with type number and value 1 (default)
            # Or just select by index

            # Assuming there is only one row since we cleared everything
            quantity_input = page.locator("input[type='number']").nth(0)
            quantity_input.fill("2")

            # Unit Price input (second number input, but wait, tax rate and discount are also number inputs later)
            # The tax rate inputs are in the summary section.
            # So the inputs in the table are the first ones.
            # Quantity is nth(0), Price is nth(1).
            price_input = page.locator("input[type='number']").nth(1)
            price_input.fill("1500")

            # Save the item (Finish editing)
            # The check button is the first button in the actions cell.
            # We can target it by the SVG icon name if accessible, or just the class.
            # Let's try to click the button that contains the check icon.
            # In the code: <CheckCircle className="h-4 w-4" />
            # We can select by the button inside the last cell.
            page.locator("tr").last.locator("button").first.click()

            # Take a screenshot of the items page with the calculated total.
            page.screenshot(path="verification/quotation_items.png")
            print("Screenshot saved to verification/quotation_items.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_quotation_flow()
