"""Save to scripts/update-openai-model.py — auto-pick latest gpt-5.X model and redeploy scan-image."""
import os, re, json, subprocess, urllib.request

# Reads .env in project root for OPENAI_API_KEY and SUPABASE_ACCESS_TOKEN
PROJECT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV = {}
for line in open(os.path.join(PROJECT, '.env')):
    if '=' in line and not line.startswith('#'):
        k, v = line.strip().split('=', 1)
        ENV[k] = v

OPENAI_KEY = ENV['OPENAI_API_KEY']
SUPABASE_TOKEN = ENV.get('SUPABASE_ACCESS_TOKEN', '')
PROJECT_REF = ENV.get('SUPABASE_PROJECT_REF', 'fxggqnlicjuvzfqzbqfm')
FN_PATH = os.path.join(PROJECT, 'supabase', 'functions', 'scan-image', 'index.ts')

# Probe likely GPT-5.X variants. /v1/models doesn't list all dated aliases,
# but POST /v1/chat/completions with a base name returns the resolved variant.
CANDIDATES = ['gpt-5', 'gpt-5.1', 'gpt-5.2', 'gpt-5.3', 'gpt-5.4',
              'gpt-5.5', 'gpt-5.6', 'gpt-5.7', 'gpt-5.8', 'gpt-5.9', 'gpt-6']


def probe(model: str):
    """Return resolved-model-id (e.g. 'gpt-5.5-2026-04-23') or None if unsupported."""
    body = json.dumps({"model": model, "messages": [{"role": "user", "content": "hi"}]}).encode()
    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=body,
        headers={'Authorization': f'Bearer {OPENAI_KEY}', 'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        r = urllib.request.urlopen(req, timeout=15)
        d = json.loads(r.read())
        return d.get('model')
    except urllib.error.HTTPError as e:
        return None
    except Exception:
        return None


def latest_dated(probes):
    """Pick the entry with newest YYYY-MM-DD suffix."""
    def key(item):
        # 'gpt-5.5-2026-04-23' → '2026-04-23'
        m = re.search(r'(\d{4}-\d{2}-\d{2})$', item['resolved'] or '')
        return m.group(1) if m else '0'
    return sorted(probes, key=key, reverse=True)[0] if probes else None


def main():
    print(f"[update-openai-model] probing {len(CANDIDATES)} candidate names…")
    probed = []
    for m in CANDIDATES:
        resolved = probe(m)
        status = resolved if resolved else 'not_found'
        print(f"  {m:12} → {status}")
        if resolved:
            probed.append({'base': m, 'resolved': resolved})

    if not probed:
        print("[!] no model resolved — OpenAI key invalid?")
        raise SystemExit(1)

    pick = latest_dated(probed)
    chosen_base = pick['base']
    chosen_resolved = pick['resolved']
    print(f"\nLatest by date: {chosen_base} (resolved: {chosen_resolved})")

    src = open(FN_PATH).read()
    m = re.search(r"const MODEL = '([^']+)'", src)
    if not m:
        print(f"[!] couldn't find MODEL constant in {FN_PATH}")
        raise SystemExit(1)
    current = m.group(1)
    if current == chosen_base:
        print(f"[=] already using {current}, no change needed")
        return

    print(f"\nUpdating MODEL: '{current}' → '{chosen_base}' in {FN_PATH}")
    src2 = src.replace(f"const MODEL = '{current}'", f"const MODEL = '{chosen_base}'")
    open(FN_PATH, 'w').write(src2)

    print("Redeploying via supabase CLI…")
    r = subprocess.run(
        ['npx', '-y', 'supabase', 'functions', 'deploy', 'scan-image',
         '--project-ref', PROJECT_REF, '--no-verify-jwt'],
        cwd=PROJECT,
        env={**os.environ, 'SUPABASE_ACCESS_TOKEN': SUPABASE_TOKEN, 'PATH': '/opt/homebrew/bin:' + os.environ.get('PATH', '')},
        capture_output=True, text=True, timeout=180,
    )
    print(r.stdout.strip().splitlines()[-3:] if r.stdout else '')
    if r.returncode != 0:
        print(f"[!] deploy failed: {r.stderr[:500]}")
        raise SystemExit(1)
    print(f"[✓] scan-image deployed with model={chosen_base}")


if __name__ == '__main__':
    main()
