const { chromium } = require('playwright');

const FAKE_SESSION = {
  access_token: 'fake-token',
  refresh_token: 'fake-refresh',
  token_type: 'bearer',
  user: {
    id: 'demo',
    email: 'nutri@nutricare.com',
    phone: null,
    app_metadata: {},
    user_metadata: {}
  }
};

const PROFILE_RESPONSE = {
  profile: { id: 'demo', email: 'nutri@nutricare.com', role: 'nutritionist', username: 'Dra. Ana Silva', phone: '(11) 99999-9999', avatar_url: null, is_active: true, created_at: null, updated_at: null },
  nutritionist_profile: { profile_id: 'demo', crn: 'CRN-3 12345', specialty: 'Nutrição Esportiva', bio: null, created_at: null, updated_at: null },
  patient_profile: null
};

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  await context.addInitScript((session) => {
    localStorage.setItem('nutri.auth.session', JSON.stringify(session));
  }, FAKE_SESSION);

  // Route all backend calls: profile → 200, others → 404
  await context.route('http://127.0.0.1:8000/**', route => {
    if (route.request().url().includes('/profile/me/details')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(PROFILE_RESPONSE)
      });
    }
    return route.fulfill({ status: 404, body: '{}' });
  });

  const page = await context.newPage();
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('response', res => {
    if (res.url().includes('127.0.0.1')) {
      console.log('  API', res.status(), res.url());
    }
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'ss_home.png', fullPage: true });
  console.log('home done');

  await page.goto('http://localhost:5173/app');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'ss_dashboard.png', fullPage: true });
  console.log('dashboard done');

  await page.goto('http://localhost:5173/app/dietas');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ss_dietplans.png', fullPage: true });
  console.log('dietplans done');

  await page.goto('http://localhost:5173/app/dietas/nova');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ss_dietcreate.png', fullPage: true });
  console.log('dietcreate done');

  await page.goto('http://localhost:5173/app/minha-dieta');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ss_mydiet.png', fullPage: true });
  console.log('mydiet done');

  await page.goto('http://localhost:5173/app/lista-de-compras');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ss_shoplist.png', fullPage: true });
  console.log('shoplist done');

  await browser.close();
})();
