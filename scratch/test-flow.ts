import puppeteer from "puppeteer-core";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function main() {
  console.log("=== STARTING END-TO-END VERIFICATION TEST ===");
  console.log("Launching headful Google Chrome...");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    defaultViewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const pages = await browser.pages();
  const page = pages[0] || (await browser.newPage());
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  try {
    console.log("Navigating to local development server: http://localhost:3000");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });

    // Step 1: Handle Google Authentication
    // Check if Navbar or Scheduler shows authentication block
    console.log("Checking authentication status...");
    
    // We scroll down to the scheduler section
    await page.evaluate(() => {
      const el = document.getElementById("scheduler");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if the "Sign In with Google" button is present
    const authRequired = await page.evaluate(() => {
      return document.body.innerText.includes("Authentication Required") || 
             document.body.innerText.includes("Sign In with Google");
    });

    if (authRequired) {
      console.log("\nAuthentication is required. Clicking the 'Sign In with Google' button...");
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const signInBtn = buttons.find(btn => btn.textContent?.toLowerCase().includes("sign in with google"));
        if (signInBtn) {
          (signInBtn as HTMLButtonElement).click();
        }
      });

      console.log("\n[ACTION REQUIRED] Please select your Google Account in the opened Chrome window.");
      console.log("Waiting up to 90 seconds for Google Sign-in to complete...");

      // Wait until the authentication required screen is no longer present,
      // or we are logged in (indicated by step-node indicators or the calendar picker)
      let loggedIn = false;
      const startTime = Date.now();
      while (Date.now() - startTime < 90000) {
        loggedIn = await page.evaluate(() => {
          // Check if calendar days grid or next button is visible
          return document.querySelector(".calendar-days-grid") !== null ||
                 document.body.innerText.includes("Select Your Service:");
        });

        if (loggedIn) {
          console.log("Google Sign-In detected successfully!");
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (!loggedIn) {
        throw new Error("Google Sign-In timed out. Please run the script again and sign in promptly.");
      }
    } else {
      console.log("User is already logged in or session is active.");
    }

    // Step 2: Select a Service (Step 1 of Scheduler)
    console.log("Selecting service: Recording Session...");
    // Find all service buttons and click the one for Recording Session
    await page.waitForSelector(".service-card-btn");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll(".service-card-btn"));
      const recordingBtn = buttons.find(btn => btn.textContent?.includes("Recording Session"));
      if (recordingBtn) {
        (recordingBtn as HTMLButtonElement).click();
      } else {
        // click the first button as fallback
        (buttons[0] as HTMLButtonElement).click();
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Clicking 'Continue' to go to Date/Time Selection...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const continueBtn = buttons.find(btn => btn.textContent === "Continue");
      if (continueBtn) continueBtn.click();
    });

    // Step 3: Choose Date & Time Slot (Step 2 of Scheduler)
    await page.waitForSelector(".calendar-days-grid");
    console.log("Selecting a day in the calendar...");
    await page.evaluate(() => {
      // Find all day cell buttons that are not disabled
      const dayCells = Array.from(document.querySelectorAll(".calendar-day-cell")) as HTMLButtonElement[];
      const activeCell = dayCells.find(cell => !cell.disabled);
      if (activeCell) activeCell.click();
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Selecting a time slot...");
    await page.waitForSelector(".slot-btn");
    await page.evaluate(() => {
      const slotBtns = Array.from(document.querySelectorAll(".slot-btn")) as HTMLButtonElement[];
      if (slotBtns.length > 0) slotBtns[0].click(); // click the first time slot
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Clicking 'Continue' to go to Contact Form...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const continueBtn = buttons.find(btn => btn.textContent === "Continue");
      if (continueBtn) continueBtn.click();
    });

    // Step 4: Fill in Contact Details (Step 3 of Scheduler)
    await page.waitForSelector(".form-control");
    console.log("Filling in client contact details...");
    
    // Fill Name
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll("input.form-control")) as HTMLInputElement[];
      if (inputs.length > 0) {
        inputs[0].value = "";
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await page.type("input.form-control:nth-of-type(1)", "Puppeteer Test Client");

    // Fill Phone
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll("input.form-control")) as HTMLInputElement[];
      // The phone input is the one with type="tel" or placeholder containing numbers
      const phoneInput = inputs.find(i => i.type === "tel") || inputs[2];
      if (phoneInput) {
        phoneInput.value = "";
        phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await page.type("input[type='tel']", "(929) 371-0371");

    // Fill Notes
    await page.evaluate(() => {
      const textarea = document.querySelector("textarea.form-control") as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = "";
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await page.type("textarea.form-control", "This is an automated browser test run by Antigravity AI to verify Stripe checkout integration.");

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Clicking 'Proceed to Payment' to go to Payment Review...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const paymentBtn = buttons.find(btn => btn.textContent === "Proceed to Payment");
      if (paymentBtn) paymentBtn.click();
    });

    // Step 5: Proceed to Stripe Checkout (Step 4 of Scheduler)
    await page.waitForSelector(".pulse-glow");
    console.log("Clicking 'Proceed to secure payment' to redirect to Stripe...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const stripeBtn = buttons.find(btn => btn.textContent?.toLowerCase().includes("secure payment"));
      if (stripeBtn) stripeBtn.click();
    });

    // Step 6: Automate Stripe Checkout
    console.log("Waiting for redirection to Stripe Checkout...");
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 });

    const currentUrl = page.url();
    console.log("Redirected to URL:", currentUrl);

    if (currentUrl.includes("stripe.com")) {
      console.log("Successfully redirected to Stripe Checkout Page!");
      
      // Let's wait for Stripe Checkout to render inputs
      console.log("Filling in Stripe test credentials...");
      
      // Stripe Checkout inputs are standard IDs or roles
      await page.waitForSelector("#email", { timeout: 15000 });
      
      // Enter Email (if not pre-populated)
      const emailVal = await page.$eval("#email", el => (el as HTMLInputElement).value);
      if (!emailVal) {
        await page.type("#email", "soundlabtestclient@gmail.com");
      }
      
      // Enter Card Details
      // Card number is typically in an input with id #cardNumber
      await page.waitForSelector("#cardNumber");
      await page.type("#cardNumber", "4242");
      await new Promise(resolve => setTimeout(resolve, 100));
      await page.type("#cardNumber", "4242");
      await new Promise(resolve => setTimeout(resolve, 100));
      await page.type("#cardNumber", "4242");
      await new Promise(resolve => setTimeout(resolve, 100));
      await page.type("#cardNumber", "4242");
      
      // Card expiry
      await page.waitForSelector("#cardExpiry");
      await page.type("#cardExpiry", "12");
      await new Promise(resolve => setTimeout(resolve, 100));
      await page.type("#cardExpiry", "30");
      
      // Card CVC
      await page.waitForSelector("#cardCvc");
      await page.type("#cardCvc", "123");
      
      // Billing name
      await page.waitForSelector("#billingName");
      await page.focus("#billingName");
      // Select all and delete default value
      await page.keyboard.down('Meta');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Meta');
      await page.keyboard.press('Backspace');
      await page.type("#billingName", "Puppeteer Test Client");
      
      // Billing ZIP (if US)
      const zipPresent = await page.$("#billingPostalCode");
      if (zipPresent) {
        await page.type("#billingPostalCode", "10001");
      }
      
      console.log("Submitting test payment on Stripe...");
      await page.click(".SubmitButton");
      
      console.log("Waiting for payment processing and redirection back to local application...");
      // Wait for navigation back to localhost:3000
      await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 45000 });
      
      const redirectUrl = page.url();
      console.log("Redirected back to URL:", redirectUrl);
      
      if (redirectUrl.includes("status=success")) {
        console.log("🎉 Stripe Checkout successful! User redirected back to success screen.");
        
        // Let's capture a screenshot of the booking success screen
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("Taking screenshot of success page...");
        await page.screenshot({ path: "scratch/success-screenshot.png" });
        console.log("Screenshot saved to scratch/success-screenshot.png");
        
        // Extract session ID from redirect URL
        const urlParams = new URL(redirectUrl).searchParams;
        const stripeSessionId = urlParams.get("session_id");
        console.log("Stripe Checkout Session ID:", stripeSessionId);
        
        // Wait a few seconds for the webhook to write to the database
        console.log("Waiting 6 seconds for Stripe webhook to process and save booking to NeonDB...");
        await new Promise(resolve => setTimeout(resolve, 6000));
        
        // Verify database entry using Prisma
        console.log("Querying database for transaction record...");
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        const db = new PrismaClient({ adapter });
        
        try {
          const bookingRecord = await db.booking.findFirst({
            where: {
              clientEmail: "soundlabtestclient@gmail.com",
              transactionId: stripeSessionId || undefined,
            },
          });
          
          if (bookingRecord) {
            console.log("\n✅ DATABASE VERIFICATION SUCCESSFUL!");
            console.log("Booking Details stored in NeonDB:");
            console.log("-----------------------------------------");
            console.log(`Booking ID:      ${bookingRecord.id}`);
            console.log(`Service Name:    ${bookingRecord.serviceName}`);
            console.log(`Client Name:     ${bookingRecord.clientName}`);
            console.log(`Client Email:    ${bookingRecord.clientEmail}`);
            console.log(`Amount Paid:     ${bookingRecord.price}`);
            console.log(`Date & Slot:     ${bookingRecord.date.toDateString()} @ ${bookingRecord.timeSlot}`);
            console.log(`Status:          ${bookingRecord.status}`);
            console.log(`Transaction ID:  ${bookingRecord.transactionId}`);
            console.log("-----------------------------------------");
          } else {
            console.error("❌ DATABASE VERIFICATION FAILED: Booking not found in database.");
            console.log("Check if the Stripe CLI listener is running and forwarded to localhost:3000/api/webhooks/stripe.");
          }
        } catch (dbErr) {
          console.error("Error querying NeonDB:", dbErr);
        } finally {
          await db.$disconnect();
        }
      } else {
        console.error("❌ Payment redirection failed or redirected to wrong URL.");
      }
    } else {
      console.error("❌ Failed to redirect to Stripe Checkout page. Current URL is:", currentUrl);
    }
  } catch (error) {
    console.error("❌ Error occurred during automation:", error);
    try {
      await page.screenshot({ path: "scratch/error-screenshot.png" });
      console.log("Error screenshot saved to scratch/error-screenshot.png");
    } catch (err) {
      console.error("Could not take error screenshot:", err);
    }
  } finally {
    console.log("Closing browser...");
    await browser.close();
    console.log("=== END-TO-END VERIFICATION TEST COMPLETED ===");
  }
}

main().catch(console.error);
