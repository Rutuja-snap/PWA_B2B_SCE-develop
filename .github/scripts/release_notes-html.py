#!/usr/bin/env python3
"""
HTML Release Notes Generator
Generates beautiful HTML release notes from merged pull requests
"""

import subprocess
import re
import os
import sys
from datetime import datetime, timezone, timedelta

# IST Timezone
IST = timezone(timedelta(hours=5, minutes=30))

try:
    import requests
except ImportError:
    print("Installing requests library...")
    subprocess.run([sys.executable, "-m", "pip", "install", "requests"], check=True)
    import requests


def run_command(cmd):
    """Execute shell command"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()


def get_merged_commits():
    """Fetch merged commits from git history"""
    print("[1/5] Fetching merged commits...")
    
    cmd = "git log --all --oneline --merges | head -100"
    output = run_command(cmd)
    
    commits = []
    for line in output.split('\n'):
        if not line.strip():
            continue
        
        parts = line.split(' ', 1)
        commit_hash = parts[0]
        message = parts[1] if len(parts) > 1 else ''
        
        pr_match = re.search(r'#(\d+)', message)
        if pr_match:
            pr_num = int(pr_match.group(1))
            commits.append({
                'hash': commit_hash,
                'pr_num': pr_num,
                'message': message,
                'raw': line
            })
    
    print(f"   ✅ Found {len(commits)} merged PRs")
    return commits


def get_pr_details(owner, repo, pr_num, token):
    """Fetch PR details from GitHub API or git"""
    try:
        body_from_api = None
        
        if token:
            headers = {'Authorization': f'token {token}'}
            url = f'https://api.github.com/repos/{owner}/{repo}/pulls/{pr_num}'
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                pr_data = {
                    'number': pr_num,
                    'title': data.get('title', ''),
                    'body': data.get('body', ''),
                    'author': data.get('user', {}).get('login', 'Unknown'),
                    'created_at': data.get('created_at', ''),
                    'merged_at': data.get('merged_at', ''),
                    'additions': data.get('additions', 0),
                    'deletions': data.get('deletions', 0),
                    'changed_files': data.get('changed_files', 0),
                    'url': f'https://github.com/{owner}/{repo}/pull/{pr_num}',
                    'labels': [l.get('name') for l in data.get('labels', [])]
                }
                body_from_api = pr_data['body']
                
                # If API body is empty or None, try to get from git
                if not body_from_api or not body_from_api.strip():
                    pass  # Will try git fallback below
                else:
                    return pr_data
        
        # Fallback: Extract from git log - get full commit data
        cmd = f"git log --grep='#{pr_num}' --all --oneline --format=%B | head -100"
        output = run_command(cmd)
        
        if output:
            lines = output.strip().split('\n')
            
            # Parse the merge commit message to extract title and description
            title = ''
            body_lines = []
            
            for line in lines:
                # Skip merge commit line
                if line.startswith('Merge pull request'):
                    continue
                
                # Skip empty lines at start
                if not title and not line.strip():
                    continue
                
                # Skip metadata lines that might come from --format variations
                if any(line.startswith(prefix) for prefix in ['Author:', 'Date:', 'Commit:', 'commit ', 'AuthorDate:', 'CommitDate:']):
                    continue
                
                # First non-empty line is the title
                if not title and line.strip():
                    title = line.strip()
                # Subsequent lines are body
                elif title:
                    body_lines.append(line)
            
            # Clean up body - remove trailing empty lines
            body = '\n'.join(body_lines).strip() if body_lines else ''
            
            if not title:
                title = f'PR #{pr_num}'
            
            # Extract author from git
            cmd_author = f"git log --grep='#{pr_num}' --all --format=%an | head -1"
            author = run_command(cmd_author) or 'Unknown'
            
            # Extract merge date from git
            cmd_date = f"git log --grep='#{pr_num}' --all --format=%aI | head -1"
            merged_at_iso = run_command(cmd_date) or ''
            merged_at = merged_at_iso.split('T')[0] if merged_at_iso else ''
            
            return {
                'number': pr_num,
                'title': title,
                'body': body,
                'author': author,
                'created_at': '',
                'merged_at': merged_at,
                'additions': 0,
                'deletions': 0,
                'changed_files': 0,
                'url': f'https://github.com/{owner}/{repo}/pull/{pr_num}',
                'labels': []
            }
    except Exception as e:
        print(f"   ⚠️  Error fetching PR #{pr_num}: {e}")
    
    return None


def clean_description(text):
    """Clean up description text - remove excessive blank lines and normalize spacing"""
    if not text:
        return text
    
    # Split by lines
    lines = text.split('\n')
    
    # Remove excessive blank lines (keep max 1 consecutive blank line)
    cleaned_lines = []
    prev_blank = False
    
    for line in lines:
        is_blank = not line.strip()
        
        if is_blank:
            if not prev_blank:
                cleaned_lines.append(line)
            prev_blank = True
        else:
            cleaned_lines.append(line)
            prev_blank = False
    
    return '\n'.join(cleaned_lines).strip()


def generate_html(commits, prs_data):
    """Generate beautiful HTML release notes"""
    print("[4/5] Generating HTML...")
    
    timestamp = datetime.now(IST).strftime('%d-%b-%Y | %H:%M IST')
    total_add = sum(p.get('additions', 0) for p in prs_data.values() if p)
    total_del = sum(p.get('deletions', 0) for p in prs_data.values() if p)
    total_files = sum(p.get('changed_files', 0) for p in prs_data.values() if p)
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Release Notes - PWA_B2B_SCE</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        
        body {{ 
            font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
        }}
        
        .wrapper {{ max-width: 1200px; margin: 0 auto; padding: 0; }}
        
        /* Header Section */
        .header-section {{
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
        }}
        
        .header-section h1 {{
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }}
        
        .header-section .subtitle {{
            font-size: 1.3em;
            font-weight: 300;
            opacity: 0.95;
            margin-bottom: 10px;
        }}
        
        .header-section .timestamp {{
            font-size: 0.95em;
            opacity: 0.85;
        }}
        
        /* Summary Stats */
        .summary-stats {{
            background: white;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 0;
            margin: -30px 40px 0 40px;
            position: relative;
            z-index: 10;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }}
        
        .stat-card {{
            padding: 25px;
            text-align: center;
            border-right: 1px solid #eee;
            transition: all 0.3s ease;
        }}
        
        .stat-card:last-child {{
            border-right: none;
        }}
        
        .stat-card:hover {{
            background-color: #f9fafb;
        }}
        
        .stat-card .stat-number {{
            font-size: 2.5em;
            font-weight: 800;
            margin: 10px 0;
            line-height: 1;
        }}
        
        .stat-card .stat-label {{
            font-size: 0.85em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }}
        
        .stat-card.pr-count .stat-number {{ color: #2a5298; }}
        .stat-card.added .stat-number {{ color: #27ae60; }}
        .stat-card.deleted .stat-number {{ color: #e74c3c; }}
        .stat-card.files .stat-number {{ color: #3498db; }}
        
        /* Main Content */
        .main-content {{
            background: white;
            padding: 50px 40px;
            margin-top: 40px;
        }}
        
        .section-title {{
            font-size: 1.8em;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 10px;
            padding-bottom: 15px;
            border-bottom: 3px solid #2a5298;
        }}
        
        .section-description {{
            color: #666;
            margin-bottom: 40px;
            font-size: 1em;
        }}
        
        /* PR List */
        .pr-list {{
            display: grid;
            gap: 25px;
        }}
        
        .pr-item {{
            background: #f9fafb;
            border: 1px solid #e8eaed;
            border-left: 4px solid #2a5298;
            border-radius: 6px;
            padding: 25px;
            transition: all 0.3s ease;
        }}
        
        .pr-item:hover {{
            border-left-color: #1e3c72;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            background: white;
        }}
        
        /* PR Header Info */
        .pr-header {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }}
        
        .pr-title-group {{
            flex: 1;
            min-width: 300px;
        }}
        
        .pr-title {{
            font-size: 1.3em;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 8px;
            line-height: 1.4;
        }}
        
        .pr-meta {{
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            font-size: 0.9em;
        }}
        
        .pr-id {{
            background: #2a5298;
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 700;
        }}
        
        .pr-author {{
            color: #2a5298;
            font-weight: 600;
        }}
        
        .pr-date {{
            color: #999;
            font-size: 0.85em;
        }}
        
        /* PR Body/Description */
        .pr-body {{
            background: white;
            padding: 12px;
            border-radius: 4px;
            margin: 12px 0;
            font-size: 0.9em;
            color: #555;
            line-height: 1.5;
            border-left: 3px solid #3498db;
            white-space: pre-line;
            word-wrap: break-word;
            overflow-wrap: break-word;
            display: block;
            width: 100%;
            box-sizing: border-box;
        }}
        
        /* PR Changes */
        .pr-changes {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            margin: 12px 0;
        }}
        
        .change-stat {{
            background: white;
            padding: 8px 12px;
            border-radius: 4px;
            border-top: 3px solid;
            text-align: center;
        }}
        
        .change-stat.added {{
            border-top-color: #27ae60;
        }}
        
        .change-stat.deleted {{
            border-top-color: #e74c3c;
        }}
        
        .change-stat.files {{
            border-top-color: #3498db;
        }}
        
        .change-value {{
            font-size: 1.1em;
            font-weight: 800;
            margin-bottom: 4px;
        }}
        
        .change-stat.added .change-value {{ color: #27ae60; }}
        .change-stat.deleted .change-value {{ color: #e74c3c; }}
        .change-stat.files .change-value {{ color: #3498db; }}
        
        .change-label {{
            font-size: 0.75em;
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        /* PR Footer/Link */
        .pr-footer {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }}
        
        .pr-link {{
            background: linear-gradient(135deg, #2a5298 0%, #1e3c72 100%);
            color: white;
            padding: 10px 25px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 700;
            font-size: 0.9em;
            transition: all 0.3s ease;
            display: inline-block;
        }}
        
        .pr-link:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(42, 82, 152, 0.3);
        }}
        
        /* Footer */
        .page-footer {{
            background: #f5f7fa;
            padding: 30px 40px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            margin-top: 40px;
            border-top: 1px solid #e8eaed;
        }}
        
        /* Responsive Design */
        @media (max-width: 768px) {{
            .header-section {{ padding: 40px 20px; }}
            .header-section h1 {{ font-size: 2em; }}
            .summary-stats {{ margin: -20px 20px 0 20px; grid-template-columns: repeat(2, 1fr); }}
            .stat-card {{ border-right: none; border-bottom: 1px solid #eee; padding: 20px; }}
            .stat-card:nth-child(odd) {{ border-right: 1px solid #eee; }}
            .main-content {{ padding: 30px 20px; }}
            .pr-header {{ flex-direction: column; }}
            .pr-changes {{ grid-template-columns: repeat(3, 1fr); }}
        }}
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header-section">
            <h1>Release Notes</h1>
            <div class="subtitle">PWA_B2B_SCE</div>
        </div>
        
        <div class="summary-stats">
            <div class="stat-card pr-count">
                <div class="stat-number">{len(commits)}</div>
                <div class="stat-label">PRs Merged</div>
            </div>
            <div class="stat-card added">
                <div class="stat-number">+{total_add:,}</div>
                <div class="stat-label">Lines Added</div>
            </div>
            <div class="stat-card deleted">
                <div class="stat-number">−{total_del:,}</div>
                <div class="stat-label">Lines Deleted</div>
            </div>
            <div class="stat-card files">
                <div class="stat-number">{total_files}</div>
                <div class="stat-label">Files Changed</div>
            </div>
        </div>
        
        <div class="main-content">
            <h2 class="section-title">Merged Pull Requests</h2>
            <p class="section-description">Complete details of all merged pull requests in this release</p>
            <div class="pr-list">
"""
    
    if not commits:
        html += '<p style="text-align:center; color:#999; padding:40px;">No merged PRs found in the repository.</p>'
    else:
        for commit in commits:
            pr_num = commit['pr_num']
            pr_data = prs_data.get(pr_num)
            
            if pr_data:
                title = pr_data['title']
                author = pr_data['author']
                body = pr_data['body']
                additions = pr_data['additions']
                deletions = pr_data['deletions']
                files = pr_data['changed_files']
                url = pr_data['url']
                merged_date = pr_data.get('merged_at', '').split('T')[0] if pr_data.get('merged_at') else 'N/A'
                
                # Format body for display
                body_text = clean_description(body.strip()) if body else ''
                
                if body_text:
                    body_html = f'<div class="pr-body">{body_text}</div>'
                else:
                    body_html = '<div class="pr-body" style="color: #999; font-style: italic;">No detailed description provided in this PR</div>'
                
                html += f"""
                <div class="pr-item">
                    <div class="pr-header">
                        <div class="pr-title-group">
                            <div class="pr-title">{title}</div>
                            <div class="pr-meta">
                                <span class="pr-id">#{pr_num}</span>
                                <span class="pr-author">by @{author}</span>
                                <span class="pr-date">{merged_date}</span>
                            </div>
                        </div>
                    </div>
                    {body_html}
                    <div class="pr-changes">
                        <div class="change-stat added">
                            <div class="change-value">+{additions}</div>
                            <div class="change-label">Additions</div>
                        </div>
                        <div class="change-stat deleted">
                            <div class="change-value">−{deletions}</div>
                            <div class="change-label">Deletions</div>
                        </div>
                        <div class="change-stat files">
                            <div class="change-value">{files}</div>
                            <div class="change-label">Files Changed</div>
                        </div>
                    </div>
                    <div class="pr-footer">
                        <a href="{url}" target="_blank" class="pr-link">View Pull Request on GitHub</a>
                    </div>
                </div>
"""
            else:
                # Fallback when no PR data available
                html += f"""
                <div class="pr-item">
                    <div class="pr-header">
                        <div class="pr-title-group">
                            <div class="pr-title">{commit['message']}</div>
                            <div class="pr-meta">
                                <span class="pr-id">#{pr_num}</span>
                            </div>
                        </div>
                    </div>
                    <div class="pr-footer">
                        <a href="https://github.com/3in1-AppFrontEnd/PWA_B2B_SCE/pull/{pr_num}" target="_blank" class="pr-link">View Pull Request on GitHub</a>
                    </div>
                </div>
"""
    
    html += f"""
            </div>
        </div>
        
        <div class="page-footer">
            <p>3in1-AppFrontEnd/PWA_B2B_SCE • {len(commits)} Pull Requests • Generated {timestamp}</p>
        </div>
    </div>
</body>
</html>
"""
    return html


def main():
    print("="*70)
    print("🎨 HTML RELEASE NOTES GENERATOR")
    print("="*70 + "\n")
    
    github_token = os.getenv('GITHUB_TOKEN', '')
    repo_owner = os.getenv('REPO_OWNER', '3in1-AppFrontEnd')
    repo_name = os.getenv('REPO_NAME', 'PWA_B2B_SCE')
    output_dir = os.getenv('OUTPUT_DIR', './docs/release-notes')
    
    print(f"Repository: {repo_owner}/{repo_name}")
    print(f"Output Directory: {output_dir}")
    print(f"Token: {'✅ Available' if github_token else '❌ Not available'}")
    print()
    
    # Get merged commits
    commits = get_merged_commits()
    
    if not commits:
        print("[WARNING] No merged PRs found - creating empty report")
        commits = []
    
    # Fetch PR details
    print("[2/5] Fetching PR details from GitHub API...")
    prs_data = {}
    if commits:
        for i, commit in enumerate(commits, 1):
            pr_num = commit['pr_num']
            
            # Always try API first
            pr_data = get_pr_details(repo_owner, repo_name, pr_num, github_token)
            
            # If API fails or no token, fall back to git extraction
            if not pr_data:
                pr_data = get_pr_details(repo_owner, repo_name, pr_num, None)
            
            prs_data[pr_num] = pr_data
            
            if pr_data:
                print(f"   ✅ PR #{pr_num}: {pr_data['title'][:50]}...")
            else:
                print(f"   ⚠️  PR #{pr_num}: Git data only")
    
    # Generate HTML
    html_content = generate_html(commits, prs_data)
    
    # Write to file
    print("[5/5] Writing output files...")
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, "RELEASE_NOTES.html")
    with open(output_file, 'w') as f:
        f.write(html_content)
    
    print(f"   ✅ {output_file}")
    
    print("\n" + "="*70)
    print("✅ HTML RELEASE NOTES GENERATED SUCCESSFULLY")
    print("="*70 + "\n")
    
    return True


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
