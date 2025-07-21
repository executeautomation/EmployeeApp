import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Input username and password, then click login button
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('password')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Employee List' link to navigate to employee list page
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/header/div/div[2]/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Enter partial text 'Test' in search input to filter employee list
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[3]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test')
        

        # Clear the search input to verify full employee list is restored
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[3]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        # Enter full match text 'TestEMployee' in search input to verify filtering accuracy
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[3]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestEMployee')
        

        # Assertion: Verify displayed employee list is filtered to matching records in real-time for partial text 'Test'
        frame = context.pages[-1]
        employee_rows = await frame.locator('xpath=//div[contains(@class, "employee_table")]//tr').all()
        # There should be at least one row matching 'Test' in Name or Position
        assert any('Test' in (await row.locator('td').nth(1).inner_text()) or 'Test' in (await row.locator('td').nth(3).inner_text()) for row in employee_rows), "No employee rows match partial search 'Test'"
          
        # Assertion: Verify full employee list is restored after clearing search input
        await frame.locator('xpath=html/body/div/div/div/div/div/div[3]/div/div/input').fill('')
        await page.wait_for_timeout(1000)
        employee_rows_after_clear = await frame.locator('xpath=//div[contains(@class, "employee_table")]//tr').all()
        assert len(employee_rows_after_clear) > 0, "Employee list should be restored after clearing search input"
          
        # Assertion: Verify displayed employee list is filtered to matching records in real-time for full match 'TestEMployee'
        await frame.locator('xpath=html/body/div/div/div/div/div/div[3]/div/div/input').fill('TestEMployee')
        await page.wait_for_timeout(1000)
        employee_rows_full_match = await frame.locator('xpath=//div[contains(@class, "employee_table")]//tr').all()
        assert all('TestEMployee' in (await row.locator('td').nth(1).inner_text()) or 'TestEMployee' in (await row.locator('td').nth(3).inner_text()) for row in employee_rows_full_match), "Not all employee rows match full search 'TestEMployee'"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    