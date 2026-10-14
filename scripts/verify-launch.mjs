const BASE_URL = "http://localhost:3000";

async function runLaunchAudit() {
  console.log("\n=======================================================");
  console.log(" 🚀 COMPREHENSIVE PRE-LAUNCH AUDIT & SECURITY SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = "") {
    if (condition) {
      console.log(` ✅ PASS: ${testName} ${detail ? `(${detail})` : ""}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  // 1. Check Homepage
  try {
    const homeRes = await fetch(`${BASE_URL}/`);
    const homeHtml = await homeRes.text();
    assert(homeRes.status === 200, "Homepage Status 200 OK");
    assert(homeHtml.includes("Ria Verma"), "Homepage Brand Metadata Present", "Found 'Ria Verma'");
    assert(homeHtml.includes("Design Engineer"), "Headline Role Present", "Found 'Design Engineer'");
  } catch (err) {
    assert(false, "Homepage fetch failed", err.message);
  }

  // 2. Check Robots.txt
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsRes.text();
    assert(robotsRes.status === 200, "Robots.txt Status 200 OK");
    assert(robotsText.includes("Disallow: /admin"), "Robots.txt Protects /admin", "Admin protected from scrapers");
    assert(robotsText.includes("sitemap.xml"), "Robots.txt Links Sitemap", "Sitemap URL defined");
  } catch (err) {
    assert(false, "Robots.txt check failed", err.message);
  }

  // 3. Check Sitemap.xml
  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    assert(sitemapRes.status === 200, "Sitemap.xml Status 200 OK");
    assert(sitemapText.includes("<urlset"), "Sitemap Valid XML Format");
  } catch (err) {
    assert(false, "Sitemap fetch failed", err.message);
  }

  // 4. Check Database Telemetry
  try {
    const statusRes = await fetch(`${BASE_URL}/api/portfolio/status`);
    const statusJson = await statusRes.json();
    assert(statusRes.status === 200, "Portfolio Status API 200 OK");
    assert(statusJson.mongoConfigured === true, "MongoDB Atlas Configured", "true");
    assert(statusJson.mongoConnected === true, "MongoDB Atlas Connected", "true");
    assert(statusJson.storageSource === "mongodb", "Live Storage Source is MongoDB Atlas", statusJson.storageSource);
    assert(statusJson.stats?.projectsCount > 0, "Projects Stored", `${statusJson.stats?.projectsCount} projects`);
  } catch (err) {
    assert(false, "Status API fetch failed", err.message);
  }

  // 5. Test Auth: Rejection of Invalid Password
  try {
    const badLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrongpassword123" }),
    });
    const badLoginJson = await badLoginRes.json();
    assert(badLoginRes.status === 401, "Invalid Password Blocked (HTTP 401)", badLoginJson.error);
    assert(badLoginJson.success === false, "Bad Login Rejected");
  } catch (err) {
    assert(false, "Bad login check failed", err.message);
  }

  // 6. Test Auth: Login with Configured Password
  let sessionCookie = "";
  const adminTestPassword = process.env.ADMIN_PASSWORD || "test_password_placeholder";
  try {
    const goodLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminTestPassword }),
    });
    const goodLoginJson = await goodLoginRes.json();
    assert(goodLoginRes.status === 200, "Configured Password Accepted", goodLoginJson.message);
    assert(goodLoginJson.success === true, "Login Succeeded");

    const setCookie = goodLoginRes.headers.get("set-cookie");
    if (setCookie) {
      sessionCookie = setCookie.split(";")[0];
      assert(sessionCookie.includes("ria_admin_session="), "HTTP-Only Session Cookie Issued", sessionCookie.slice(0, 30) + "...");
    } else {
      assert(false, "Session cookie header present in response");
    }
  } catch (err) {
    assert(false, "Good login check failed", err.message);
  }

  // 7. Verify Authenticated Session
  try {
    const sessionRes = await fetch(`${BASE_URL}/api/admin/session`, {
      headers: { Cookie: sessionCookie },
    });
    const sessionJson = await sessionRes.json();
    assert(sessionRes.status === 200, "Session Verification API 200 OK");
    assert(sessionJson.authenticated === true, "Admin Session Authenticated", "true");
  } catch (err) {
    assert(false, "Session check failed", err.message);
  }

  // 8. Test Mutation Guard: Reject Unauthorized PUT /api/portfolio
  try {
    const unauthPut = await fetch(`${BASE_URL}/api/portfolio`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: {}, projects: [] }),
    });
    const unauthJson = await unauthPut.json();
    assert(unauthPut.status === 401, "Unauthorized Mutation Guard (HTTP 401)", unauthJson.error);
  } catch (err) {
    assert(false, "Mutation guard check failed", err.message);
  }

  // 9. Test Mutation Guard: Allow Authorized PUT /api/portfolio with Cookie
  try {
    // Fetch current data first
    const currentRes = await fetch(`${BASE_URL}/api/portfolio`);
    const currentJson = await currentRes.json();

    const authPut = await fetch(`${BASE_URL}/api/portfolio`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify(currentJson.data),
    });
    const authPutJson = await authPut.json();
    assert(authPut.status === 200, "Authorized Mutation Allowed with Valid Cookie", authPutJson.message);
    assert(authPutJson.savedToMongo === true, "Persisted Directly to MongoDB Atlas", "savedToMongo: true");
  } catch (err) {
    assert(false, "Authorized mutation check failed", err.message);
  }

  // 10. Test Logout
  try {
    const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });
    assert(logoutRes.status === 200, "Logout Succeeded (Session Destroyed)");

    // Recheck session after logout
    const checkAfterLogout = await fetch(`${BASE_URL}/api/admin/session`);
    const checkAfterLogoutJson = await checkAfterLogout.json();
    assert(checkAfterLogoutJson.authenticated === false, "Session Revocation Verified", "authenticated: false");
  } catch (err) {
    assert(false, "Logout check failed", err.message);
  }

  console.log("\n=======================================================");
  console.log(` 🏁 AUDIT SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runLaunchAudit().catch(console.error);
