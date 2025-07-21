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
        # Input username and password, then click login button to navigate to main page (employee list)
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('password')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Locate and click the theme toggle button in the navigation menu
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/header/div/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Toggle theme back to light mode by clicking the theme toggle button again
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/header/div/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert UI theme switches from light to dark mode after first toggle
        frame = context.pages[-1]
        body = frame.locator('body')
        await page.wait_for_timeout(1000)  # wait for theme transition
        dark_mode_class = await body.get_attribute('class')
        assert 'dark-mode' in dark_mode_class, 'Dark mode class not applied after toggle'
        # Assert UI theme reverts to light mode after second toggle
        await page.wait_for_timeout(1000)  # wait for theme transition
        light_mode_class = await body.get_attribute('class')
        assert 'dark-mode' not in light_mode_class, 'Dark mode class still present after toggling back to light mode'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    