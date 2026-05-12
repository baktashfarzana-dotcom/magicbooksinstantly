import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 3000);

const page = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MagicBooksInstantly</title>
    <style>
      :root {
        --color-background: #fbfcff;
        --color-foreground: #16202f;
        --color-card: #ffffff;
        --color-muted: #eef3f8;
        --color-muted-foreground: #667085;
        --color-border: #dbe5ef;
        --color-primary: #2786ff;
        --color-secondary: #ffd85a;
        --color-story-mint: #54d6a0;
        --font-display: "Quicksand", "Nunito", ui-rounded, system-ui, sans-serif;
        --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
        --radius-lg: 1.5rem;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        color: var(--color-foreground);
        font-family: var(--font-sans);
        background: radial-gradient(circle at top left, rgba(39, 134, 255, .14), transparent 34rem), linear-gradient(180deg, #fbfcff 0%, #f2f7fb 100%);
      }
      main { min-height: 100vh; padding: 32px 24px; }
      .wrap { max-width: 1120px; margin: 0 auto; }
      nav, .row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
      .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; }
      .mark { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 14px; color: white; background: var(--color-primary); }
      .hero { display: grid; gap: 42px; align-items: center; padding: 80px 0 28px; grid-template-columns: 1.08fr .92fr; }
      h1 { margin: 0; max-width: 780px; font-size: clamp(46px, 8vw, 86px); line-height: .95; letter-spacing: 0; }
      h2 { margin: 0; font-size: 24px; letter-spacing: 0; }
      p { color: var(--color-muted-foreground); line-height: 1.65; }
      .pill { display: inline-flex; align-items: center; gap: 8px; border-radius: 12px; padding: 8px 12px; background: var(--color-secondary); color: #352900; font-weight: 800; font-size: 14px; }
      .buttons { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
      .button { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; border-radius: var(--radius-lg); padding: 0 22px; font-weight: 800; text-decoration: none; color: white; background: var(--color-primary); border: 0; }
      .button.secondary { color: #352900; background: var(--color-secondary); }
      .panel { border: 1px solid var(--color-border); background: var(--color-card); border-radius: var(--radius-lg); padding: 22px; box-shadow: 0 14px 45px rgba(16, 24, 40, .08); }
      .mock { border-radius: var(--radius-lg); background: var(--color-muted); padding: 22px; }
      .bar { height: 12px; width: 112px; border-radius: 999px; background: var(--color-primary); margin-bottom: 28px; }
      .skel { height: 68px; border-radius: 18px; background: white; margin-top: 12px; }
      .skel.tall { height: 128px; }
      .grid { display: grid; gap: 16px; grid-template-columns: repeat(3, 1fr); margin-top: 28px; }
      .card { border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: white; padding: 20px; }
      .kid { margin-top: 28px; border: 4px solid white; border-radius: 32px; padding: 28px; background: linear-gradient(135deg, #eef7ff, #fff8dd); font-family: var(--font-display); }
      .kid h2 { font-size: 34px; }
      @media (max-width: 820px) {
        .hero, .grid { grid-template-columns: 1fr; }
        main { padding: 22px 16px; }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="wrap">
        <nav>
          <div class="brand"><span class="mark">MB</span>MagicBooksInstantly</div>
          <a class="button" href="#dashboard">Enter</a>
        </nav>
        <section class="hero">
          <div>
            <span class="pill">Phase 1 foundation</span>
            <h1>MagicBooksInstantly</h1>
            <p>A secure command center for parents and a soft, touch-first gateway for every child profile.</p>
            <div class="buttons">
              <a class="button" href="#dashboard">Create account</a>
              <a class="button secondary" href="#child">Child gateway</a>
            </div>
          </div>
          <div class="panel">
            <div class="mock">
              <div class="bar"></div>
              <div class="skel"></div>
              <div class="skel"></div>
              <div class="skel tall"></div>
            </div>
          </div>
        </section>
        <section id="dashboard">
          <span class="pill">Parent Command Center</span>
          <div class="grid">
            <div class="card"><h2>Account</h2><p>Trial status and authenticated parent identity.</p></div>
            <div class="card"><h2>Library</h2><p>Stories created in Phase 1: 0.</p></div>
            <div class="card"><h2>Kitchen</h2><p>AI workflow infrastructure ready.</p></div>
          </div>
        </section>
        <section id="child" class="kid">
          <span class="pill">Hero gateway</span>
          <h2>Waiting for your first story!</h2>
          <p>Your bookshelf is ready. A grown-up can bake the first adventure from the Command Center.</p>
        </section>
      </div>
    </main>
  </body>
</html>`;

const server = createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(page);
});

server.listen(port, () => {
  console.log(`MagicBooksInstantly preview running at http://localhost:${port}`);
});
