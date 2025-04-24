#!/usr/bin/env python3

import os
import sys
import json
from pathlib import Path

def print_colored(text, color_code):
    """Print colored text to the console."""
    print(f"\033[{color_code}m{text}\033[0m")

def print_success(text):
    """Print success message in green."""
    print_colored(text, "92")

def print_warning(text):
    """Print warning message in yellow."""
    print_colored(text, "93")

def print_error(text):
    """Print error message in red."""
    print_colored(text, "91")

def print_info(text):
    """Print info message in blue."""
    print_colored(text, "94")

def check_file_exists(file_path):
    """Check if a file exists."""
    if os.path.isfile(file_path):
        print_success(f"✓ Found: {file_path}")
        return True
    else:
        print_error(f"✗ Missing: {file_path}")
        return False

def check_directory_exists(dir_path):
    """Check if a directory exists."""
    if os.path.isdir(dir_path):
        print_success(f"✓ Found directory: {dir_path}")
        return True
    else:
        print_error(f"✗ Missing directory: {dir_path}")
        return False

def check_js_references(html_path):
    """Check if all JavaScript files referenced in HTML exist."""
    try:
        with open(html_path, 'r') as f:
            content = f.read()
        
        # Very simple parsing to find script tags
        script_tags = content.split('<script src="')
        script_tags.pop(0)  # Remove the part before the first script tag
        
        js_files = []
        for tag in script_tags:
            src = tag.split('"')[0]
            js_files.append(src)
        
        print_info(f"Found {len(js_files)} JavaScript references in {html_path}")
        
        all_exist = True
        base_dir = os.path.dirname(html_path)
        
        for js_file in js_files:
            full_path = os.path.join(base_dir, js_file)
            if not check_file_exists(full_path):
                all_exist = False
        
        return all_exist
    except Exception as e:
        print_error(f"Error checking JS references: {e}")
        return False

def check_css_references(html_path):
    """Check if all CSS files referenced in HTML exist."""
    try:
        with open(html_path, 'r') as f:
            content = f.read()
        
        # Very simple parsing to find link tags with rel="stylesheet"
        link_tags = content.split('<link rel="stylesheet" href="')
        link_tags.pop(0)  # Remove the part before the first link tag
        
        css_files = []
        for tag in link_tags:
            href = tag.split('"')[0]
            css_files.append(href)
        
        print_info(f"Found {len(css_files)} CSS references in {html_path}")
        
        all_exist = True
        base_dir = os.path.dirname(html_path)
        
        for css_file in css_files:
            full_path = os.path.join(base_dir, css_file)
            if not check_file_exists(full_path):
                all_exist = False
        
        return all_exist
    except Exception as e:
        print_error(f"Error checking CSS references: {e}")
        return False

def check_image_references(html_path):
    """Check if all image files referenced in HTML exist."""
    try:
        with open(html_path, 'r') as f:
            content = f.read()
        
        # Very simple parsing to find img tags
        img_tags = content.split('<img src="')
        img_tags.pop(0)  # Remove the part before the first img tag
        
        img_files = []
        for tag in img_tags:
            src = tag.split('"')[0]
            img_files.append(src)
        
        print_info(f"Found {len(img_files)} image references in {html_path}")
        
        all_exist = True
        base_dir = os.path.dirname(html_path)
        
        for img_file in img_files:
            full_path = os.path.join(base_dir, img_file)
            if not check_file_exists(full_path):
                all_exist = False
        
        return all_exist
    except Exception as e:
        print_error(f"Error checking image references: {e}")
        return False

def check_js_syntax(js_path):
    """Basic check for JavaScript syntax."""
    try:
        with open(js_path, 'r') as f:
            content = f.read()
        
        # Check for basic syntax issues
        balanced_braces = content.count('{') == content.count('}')
        balanced_parentheses = content.count('(') == content.count(')')
        balanced_brackets = content.count('[') == content.count(']')
        
        if balanced_braces and balanced_parentheses and balanced_brackets:
            print_success(f"✓ JS syntax check passed: {js_path}")
            return True
        else:
            print_warning(f"⚠ JS syntax check failed: {js_path}")
            if not balanced_braces:
                print_warning("  - Unbalanced braces { }")
            if not balanced_parentheses:
                print_warning("  - Unbalanced parentheses ( )")
            if not balanced_brackets:
                print_warning("  - Unbalanced brackets [ ]")
            return False
    except Exception as e:
        print_error(f"Error checking JS syntax: {e}")
        return False

def main():
    """Main function to verify deployment readiness."""
    print_info("=== HAM DEALER Deployment Verification ===")
    
    # Define the game directory path
    game_dir = Path("../game")
    
    if not os.path.isdir(game_dir):
        print_error(f"Game directory not found: {game_dir}")
        sys.exit(1)
    
    # Check required directories
    directories = [
        game_dir / "css",
        game_dir / "js",
        game_dir / "assets",
        game_dir / "assets/images"
    ]
    
    dir_checks_passed = all(check_directory_exists(d) for d in directories)
    
    # Check required files
    files = [
        game_dir / "index.html",
        game_dir / "css/style.css",
        game_dir / "js/game.js",
        game_dir / "js/market.js",
        game_dir / "js/travel.js",
        game_dir / "js/events.js",
        game_dir / "assets/images/avatar.png",
        game_dir / "README.md"
    ]
    
    file_checks_passed = all(check_file_exists(f) for f in files)
    
    # Check references in HTML
    print_info("\nChecking file references in HTML...")
    html_path = game_dir / "index.html"
    js_refs_passed = check_js_references(html_path)
    css_refs_passed = check_css_references(html_path)
    img_refs_passed = check_image_references(html_path)
    
    # Check JS syntax
    print_info("\nChecking JavaScript syntax...")
    js_files = [
        game_dir / "js/game.js",
        game_dir / "js/market.js",
        game_dir / "js/travel.js",
        game_dir / "js/events.js"
    ]
    
    js_syntax_passed = all(check_js_syntax(js_file) for js_file in js_files)
    
    # Summary
    print_info("\n=== Verification Summary ===")
    
    all_passed = (
        dir_checks_passed and 
        file_checks_passed and 
        js_refs_passed and 
        css_refs_passed and 
        img_refs_passed and 
        js_syntax_passed
    )
    
    if all_passed:
        print_success("\n✓ All checks passed! The game is ready for deployment.")
        print_info("\nNext steps:")
        print_info("1. Deploy to Netlify or GitHub Pages using the instructions in DEPLOYMENT.md")
        print_info("2. Test the deployed game to ensure all features work correctly")
        print_info("3. Update the README.md with the public URL")
    else:
        print_error("\n✗ Some checks failed. Please fix the issues before deploying.")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())