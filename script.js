:root {
    --accent: #818cf8;
    --accent2: #a855f7;
    --accent3: #ec4899;
    --accent4: #22d3ee;
    --bg1: #191733;
    --bg2: #231f38;
    --bg3: #1a1832;
    --glass: rgba(34, 31, 59, 0.93);
    --glass2: rgba(39, 38, 66, 0.97);
    --glass3: rgba(60, 55, 125, 0.13);
    --shadow: 0 4px 48px 0 rgba(45, 32, 102, 0.23);
    --shadow2: 0 4px 24px 0 rgba(99, 102, 241, 0.10);
    --border: 1px solid #28234b;
}
body {
    font-family: 'Inter', 'JetBrains Mono', monospace, sans-serif;
    background: #18152e linear-gradient(135deg, #23204c 0%, #1c1a38 56%, #18152e 100%);
    color: #f3f3fa;
    margin: 0;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    font-size: 17px;
    transition: background 0.5s cubic-bezier(.4,0,.2,1);
    letter-spacing: 0.01em;
}
.noise-bg,
.squares-bg {
    display: none !important;
}
.styled-oauth {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
    align-items: center;
    margin: 1.4rem 0 1.8rem 0;
}
.oauth-btn {
    display: flex;
    align-items: center;
    gap: 0.6em;
    font-size: 1.10rem;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    border: none;
    outline: none;
    border-radius: 0.85em;
    padding: 0.85em 2.1em 0.85em 1.4em;
    box-shadow: 0 2px 14px 0 rgba(0,0,0,0.04), 0 1.5px 6px 0 rgba(130,130,200,0.07);
    transition: transform 0.13s, box-shadow 0.13s, background 0.16s;
    cursor: pointer;
    background: rgba(36,30,60,0.66);
    color: #fff;
    border: 1.2px solid #35324f;
    letter-spacing: 0.01em;
}
.oauth-btn .oauth-label {
    font-weight: 800;
    font-size: 1.07em;
    letter-spacing: 0.01em;
}
.oauth-btn .oauth-icon {
    display: flex;
    align-items: center;
    margin-right: 0.49em;
}
.oauth-btn.discord {
    background: linear-gradient(90deg, #5865F2 60%, #5865F2 100%);
    color: #fff;
    border: 1.5px solid #5865F2;
}
.oauth-btn.discord:hover {
    background: linear-gradient(90deg, #434ec8 60%, #5865F2 100%);
    border-color: #434ec8;
    transform: translateY(-2px) scale(1.04);
}
.oauth-btn.github {
    background: linear-gradient(90deg, #18181B 80%, #23272F 100%);
    color: #fff;
    border: 1.5px solid #23272F;
}
.oauth-btn.github:hover {
    background: linear-gradient(90deg, #23272F 60%, #18181B 100%);
    border-color: #23272F;
    transform: translateY(-2px) scale(1.04);
}
.oauth-btn:active {
    transform: scale(0.98);
}
.navbar {
    width: 92vw;
    max-width: 1260px;
    margin: 2.1rem auto 0 auto;
    border-radius: 1.5rem 1.5rem 2.2rem 2.2rem;
    box-shadow: var(--shadow);
    border-bottom: var(--border);
    background: linear-gradient(90deg, var(--glass), var(--glass2));
    position: relative;
    z-index: 10;
    animation: navfade 0.7s cubic-bezier(.4,0,.2,1);
}
@keyframes navfade {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
.nav-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.1rem 2.2rem;
}
.nav-links {
    display: flex;
    gap: 2.5rem;
}
.nav-link {
    text-decoration: none;
    color: #f3f3fa;
    font-weight: 700;
    font-size: 1.19rem;
    letter-spacing: 0.03em;
    transition: color 0.17s, border-bottom 0.16s;
    position: relative;
    padding-bottom: 0.11em;
    border: none;
    outline: none;
    background: none;
}
.nav-link.active, .nav-link:hover {
    color: var(--accent2);
}
.nav-link.active::after, .nav-link:hover::after {
    content: '';
    display: block;
    position: absolute;
    left: 33%;
    width: 34%;
    height: 2px;
    background: linear-gradient(90deg, var(--accent2), var(--accent3));
    bottom: -2px;
    border-radius: 3px;
    transition: width 0.22s cubic-bezier(.4,0,.2,1);
}
.nav-account-group {
    display: flex;
    align-items: center;
    gap: 1.3rem;
}
.welcome-user {
    font-size: 1.08rem;
    font-weight: 800;
    color: var(--accent2);
    background: rgba(39,38,66,0.47);
    padding: 0.37em 1.5em 0.37em 1.5em;
    border-radius: 1.2em;
    margin-right: 0.2em;
    min-width: 100px;
    min-height: 1.3em;
    letter-spacing: 0.02em;
    transition: background 0.21s, color 0.21s;
    text-align: center;
    will-change: opacity, background;
    opacity: 0;
    pointer-events: none;
    animation: fadeWelcome 0.7s cubic-bezier(.4,0,.2,1) 0.1s forwards;
}
.welcome-user.show {
    opacity: 1;
    pointer-events: auto;
}
@keyframes fadeWelcome {
    from { opacity: 0; }
    to { opacity: 1; }
}
.cta-btn {
    background: linear-gradient(90deg, var(--accent), var(--accent3) 65%);
    color: #fff;
    font-weight: 700;
    font-size: 1rem;
    border: none;
    border-radius: 1.6em;
    padding: 0.8em 2em;
    cursor: pointer;
    box-shadow: var(--shadow2);
    transition: background 0.14s, box-shadow 0.10s, transform 0.11s;
    outline: none;
}
.cta-btn:active {
    transform: scale(0.97);
}
.cta-btn:hover {
    background: linear-gradient(90deg, var(--accent3) 70%, var(--accent));
    box-shadow: 0 4px 22px 0 var(--accent3), var(--shadow2);
    transform: translateY(-2px) scale(1.03);
}
.cta-btn.secondary {
    background: linear-gradient(90deg, #64748b, #818cf8);
    color: #fff;
}
.cta-btn.hidden { display: none !important; }
.main-content {
    min-height: 80vh;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
    z-index: 2;
    position: relative;
    animation: mainfade 0.7s cubic-bezier(.4,0,.2,1);
}
@keyframes mainfade {
    from { opacity: 0; transform: translateY(40px);}
    to { opacity: 1; transform: none;}
}
.hero {
    margin-top: 3.6rem;
    margin-bottom: 2.1rem;
    text-align: center;
    animation: fadein 0.8s cubic-bezier(.4,0,.2,1);
}
.hero-title {
    font-size: 3.2rem;
    font-weight: 900;
    letter-spacing: -0.04em;
    margin-bottom: 0.5rem;
    line-height: 1.08;
    font-family: 'Inter', 'JetBrains Mono', monospace, sans-serif;
}
.gradient-text {
    background: linear-gradient(90deg, var(--accent3) 11%, var(--accent2) 44%, var(--accent) 73%, var(--accent4) 99%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
}
.subtitle {
    color: #b3b8da;
    margin-bottom: 2.4rem;
    font-size: 1.15rem;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
}
.vault-container {
    background: var(--glass2);
    border-radius: 2.2rem;
    box-shadow: var(--shadow2);
    padding: 2.2rem 1.8rem 2.2rem 1.8rem;
    max-width: 740px;
    margin: 0 auto 3.1rem auto;
    border: var(--border);
    position: relative;
    z-index: 1;
    animation: fadein 0.95s cubic-bezier(.4,0,.2,1);
}
.vault-form {
    display: flex;
    flex-direction: column;
    gap: 1.3rem;
    margin-bottom: 2.1rem;
}
.input-lg, .input-md, .textarea-lg {
    width: 100%;
    box-sizing: border-box;
    border-radius: 1.05rem;
    background: var(--bg2);
    color: #f3f3fa;
    font-size: 1.14rem;
    padding: 1.07rem;
    border: 1.3px solid var(--accent3);
    margin-bottom: 0.2rem;
    font-family: 'JetBrains Mono', monospace;
    transition: border 0.18s, box-shadow 0.18s;
    outline: none;
}
.input-lg:focus, .input-md:focus, .textarea-lg:focus {
    border-color: var(--accent2);
    box-shadow: 0 0 0 2px var(--accent2);
}
.input-lg, .textarea-lg {
    margin-top: 0.19rem;
    margin-bottom: 0.19rem;
    padding-left: 1.21rem;
    padding-right: 1.21rem;
}
.input-md {
    font-size: 1.05rem;
    padding: 0.75rem 1rem;
    border-radius: 0.7rem;
    border: 1.3px solid var(--accent2);
}
.textarea-lg {
    height: 6.2rem;
    resize: vertical;
    min-height: 5.1rem;
    max-height: 22rem;
}
.form-btn {
    background: linear-gradient(90deg, var(--accent), var(--accent3) 70%);
    color: #fff;
    font-weight: 700;
    font-size: 1.08rem;
    border: none;
    border-radius: 0.95rem;
    padding: 0.95rem;
    cursor: pointer;
    box-shadow: var(--shadow2);
    transition: background 0.14s, box-shadow 0.12s, transform 0.13s;
    outline: none;
}
.form-btn.secondary {
    background: linear-gradient(90deg, #64748b, #818cf8);
    color: #fff;
}
.form-btn:active {
    transform: scale(0.98);
}
.form-btn:hover {
    background: linear-gradient(90deg, var(--accent3) 75%, var(--accent));
    box-shadow: 0 4px 22px 0 var(--accent3), var(--shadow2);
    transform: translateY(-2px) scale(1.04);
}
.vault-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin-bottom: 1rem;
    animation: fadein 1.1s cubic-bezier(.4,0,.2,1);
}
@media (min-width: 768px) {
    .vault-list {
        grid-template-columns: 1fr 1fr;
    }
}
@media (min-width: 1120px) {
    .vault-list {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
.script-card {
    background: var(--glass3);
    border-radius: 1.18rem;
    box-shadow: var(--shadow);
    padding: 1.47rem 1.1rem 1.05rem 1.1rem;
    border: 1.3px solid var(--accent2);
    transition: box-shadow 0.18s, transform 0.13s;
    position: relative;
    overflow: hidden;
    animation: cardfade 0.7s cubic-bezier(.4,0,.2,1);
}
@keyframes cardfade {
    from { opacity: 0; transform: translateY(23px);}
    to { opacity: 1; transform: none;}
}
.script-card:hover {
    box-shadow: 0 8px 48px 0 var(--accent2), var(--shadow2);
    transform: translateY(-3px) scale(1.03);
    border-color: var(--accent3);
    z-index: 2;
}
.script-card h3 {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.13rem;
    margin: 0 0 0.7rem 0;
    background: linear-gradient(90deg, var(--accent), var(--accent3));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
}
.script-actions {
    display: flex;
    gap: 0.7rem;
    margin-top: 0.7rem;
    justify-content: flex-end;
}
.script-actions button {
    background: linear-gradient(90deg, var(--accent2), var(--accent3));
    color: #fff;
    font-size: 0.97rem;
    border: none;
    border-radius: 0.6em;
    padding: 0.39em 1.1em;
    cursor: pointer;
    font-weight: 700;
    transition: background 0.13s;
}
.script-actions button:hover {
    background: linear-gradient(90deg, var(--accent3), var(--accent2));
}
pre {
    background: var(--bg1);
    border-radius: 0.80rem;
    padding: 1rem 1.05rem;
    font-size: 0.97rem;
    color: #b9c0e2;
    margin: 0;
    font-family: 'JetBrains Mono', monospace;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    transition: background 0.18s;
}
.script-card:hover pre {
    background: #28234b;
}
.modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(20, 21, 34, 0.90);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.21s cubic-bezier(.4,0,.2,1);
}
.modal {
    background: var(--glass2);
    border-radius: 1.4rem;
    padding: 2.1rem 1.7rem 1.7rem 1.7rem;
    min-width: 330px;
    max-width: 400px;
    box-shadow: var(--shadow);
    border: var(--border);
    position: relative;
    z-index: 2;
    animation: fadein 0.21s cubic-bezier(.4,0,.2,1);
}
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.2rem;
}
.modal-title {
    font-size: 1.73rem;
    font-weight: 900;
}
.close-btn {
    background: none;
    color: #b3b8da;
    font-size: 2rem;
    border: none;
    cursor: pointer;
    font-weight: 900;
    line-height: 1;
    margin-left: 0.6rem;
    transition: color 0.13s;
}
.close-btn:hover {
    color: var(--accent);
}
.modal-body {
    display: flex;
    flex-direction: column;
    gap: 1.05rem;
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.47rem;
}
.form-group label {
    font-size: 1rem;
    color: #b3b8da;
    font-weight: 600;
    margin-bottom: 0.24rem;
    letter-spacing: 0.01em;
}
.auth-tabs {
    display: flex;
    gap: 1.1rem;
    margin-bottom: 1.02rem;
    justify-content: center;
}
.tab-btn {
    background: none;
    border: none;
    font-weight: 800;
    font-size: 1.04rem;
    color: #c7d2fe;
    padding: 0.37em 1em;
    border-radius: 1.1em;
    transition: background 0.14s, color 0.13s;
    cursor: pointer;
}
.tab-btn.active, .tab-btn:hover {
    background: linear-gradient(90deg,var(--accent2),var(--accent3));
    color: #fff;
}
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin-bottom: 0.16rem;
    animation: fadein 0.19s cubic-bezier(.4,0,.2,1);
}
.auth-form.hidden {
    display: none;
}
.announce-list {
    max-width: 650px;
    margin: 2.1rem auto 1.3rem auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}
.announce-card {
    border-radius: 1.3rem;
    background: var(--glass2);
    box-shadow: var(--shadow2);
    border: 1.2px solid var(--accent);
    padding: 1.75rem 1.75rem 1.3rem 1.75rem;
    position: relative;
    overflow: hidden;
}
.announce-title {
    font-size: 1.2rem;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 0.65rem;
}
.announce-body {
    color: #b3b8da;
    font-size: 1.01rem;
    font-weight: 500;
    margin: 0;
}
body.light {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 60%, #f3f4f6 100%);
    color: #18132a;
}
body.light .navbar, body.light .vault-container, body.light .modal, body.light .announce-card {
    background: rgba(255,255,255,0.98);
    box-shadow: 0 4px 28px 0 rgba(99, 102, 241, 0.07);
    border: 1.2px solid #c7d2fe;
}
body.light .nav-link, body.light .cta-btn, body.light .form-btn, body.light .modal-title, body.light .hero-title {
    color: #18132a;
}
body.light .gradient-text {
    background: linear-gradient(90deg, #6366f1 10%, #a21caf 58%, #ec4899 85%, #06b6d4 99%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
}
body.light .input-lg, body.light .input-md, body.light .textarea-lg {
    background: #f3f4f6;
    color: #18132a;
    border: 1.2px solid #c7d2fe;
}
body.light pre {
    background: #e0e7ff;
    color: #18132a;
}
body.light .script-card {
    background: rgba(245, 245, 255, 0.75);
    border: 1.2px solid #a5b4fc;
}
body.light .welcome-user {
    background: rgba(228,228,255,0.75);
    color: #a855f7;
}
body.light .tab-btn.active, body.light .tab-btn:hover {
    background: linear-gradient(90deg,#818cf8,#a855f7);
    color: #fff;
}
@media (max-width: 700px) {
    .navbar { width: 99vw; padding: 0 0.2rem;}
    .nav-inner { padding: 0.7rem 0.35rem;}
    .vault-container { padding: 0.8rem 0.35rem;}
    .modal { padding: 0.8rem 0.6rem;}
    .hero-title { font-size: 1.7rem;}
    .welcome-user { padding: 0.31em 0.7em;}
    .styled-oauth { flex-direction: column; gap: 1.1rem;}
}
@media (max-width: 500px) {
    .navbar { max-width: 99vw; }
    .nav-account-group { gap: 0.55rem; }
    .welcome-user { min-width: 65px; font-size: 0.89rem; }
}
.hidden { display: none !important; }
